import { NextResponse } from 'next/server';
import { caseByToken, evidenceFor } from '@/lib/cases';
import { db, EVIDENCE_BUCKET } from '@/lib/supabase';
import { captureError } from '@/lib/ops';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB each
const MAX_FILES = 20; // 20 per case

/** Upload one evidence file. Extraction is a separate call so the upload never blocks on it. */
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  try {
    const record = await caseByToken(token);
    if (!record) return NextResponse.json({ error: 'Case not found.' }, { status: 404 });

    const existing = await evidenceFor(record.id);
    if (existing.length >= MAX_FILES) {
      return NextResponse.json({ error: 'A case takes 20 files. Remove one before adding another.' }, { status: 400 });
    }

    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Attach a file.' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'That file is over 25 MB. Send a smaller scan.' }, { status: 400 });
    }

    const storagePath = `${record.id}/${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, '_')}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await db()
      .storage.from(EVIDENCE_BUCKET)
      .upload(storagePath, buffer, { contentType: file.type || 'application/octet-stream', upsert: false });
    if (uploadError) throw new Error(uploadError.message);

    const { data, error } = await db()
      .from('evidence')
      .insert({ case_id: record.id, filename: file.name, storage_path: storagePath, confirmed: false })
      .select('id, filename, storage_path, confirmed')
      .single();
    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true, evidence: data });
  } catch (err) {
    captureError(err, { route: 'case/evidence' });
    return NextResponse.json({ error: 'The upload failed. Try again.' }, { status: 500 });
  }
}

/** Confirm or reject the extracted facts, or delete the file. */
export async function PATCH(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  try {
    const record = await caseByToken(token);
    if (!record) return NextResponse.json({ error: 'Case not found.' }, { status: 404 });

    const { evidence_id, confirmed, remove } = (await request.json()) as {
      evidence_id?: string;
      confirmed?: boolean;
      remove?: boolean;
    };
    if (!evidence_id) return NextResponse.json({ error: 'Which file?' }, { status: 400 });

    const rows = await evidenceFor(record.id);
    const row = rows.find((r) => r.id === evidence_id);
    if (!row) return NextResponse.json({ error: 'File not found on this case.' }, { status: 404 });

    if (remove) {
      await db().storage.from(EVIDENCE_BUCKET).remove([row.storage_path]);
      await db().from('evidence').delete().eq('id', evidence_id);
      return NextResponse.json({ ok: true, removed: true });
    }

    await db().from('evidence').update({ confirmed: Boolean(confirmed) }).eq('id', evidence_id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    captureError(err, { route: 'case/evidence', method: 'PATCH' });
    return NextResponse.json({ error: 'That did not save. Try again.' }, { status: 500 });
  }
}
