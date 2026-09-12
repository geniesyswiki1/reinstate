import { NextResponse } from 'next/server';
import {
  callAnthropic,
  parseJson,
  EXTRACT_SYSTEM,
  MODELS,
  EFFORT,
  isConfigError,
  MAX_TOKENS,
  type ContentBlock,
  type ExtractedFact,
} from '@reinstate/shared';
import { caseByToken, evidenceFor } from '@/lib/cases';
import { db, EVIDENCE_BUCKET } from '@/lib/supabase';
import { rateLimit, clientIp } from '@/lib/ratelimit';
import { captureError } from '@/lib/ops';

export const runtime = 'nodejs';
export const maxDuration = 120;

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

/** Card numbers never reach storage (section 4.7). */
function redactCards(fact: ExtractedFact): ExtractedFact {
  const redact = (s: string) => s.replace(/\b(?:\d[ -]?){13,19}\b/g, (m) => `card ending ${m.replace(/\D/g, '').slice(-4)}`);
  return {
    ...fact,
    issuer: fact.issuer ? redact(fact.issuer) : null,
    amounts: fact.amounts.map(redact),
    identifiers: fact.identifiers.map(redact),
    addresses: fact.addresses.map(redact),
    summary: redact(fact.summary),
  };
}

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = await rateLimit(`extract:${ip}:${new Date().toISOString().slice(0, 10)}`, 200, 86400);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many documents today. Try again tomorrow.' }, { status: 429 });
  }

  const { case_token, evidence_id } = (await request.json()) as {
    case_token?: string;
    evidence_id?: string;
  };
  if (!case_token || !evidence_id) {
    return NextResponse.json({ error: 'Missing case or file.' }, { status: 400 });
  }

  try {
    const record = await caseByToken(case_token);
    if (!record) return NextResponse.json({ error: 'Case not found.' }, { status: 404 });

    const row = (await evidenceFor(record.id)).find((r) => r.id === evidence_id);
    if (!row) return NextResponse.json({ error: 'File not found on this case.' }, { status: 404 });

    const { data: blob, error } = await db().storage.from(EVIDENCE_BUCKET).download(row.storage_path);
    if (error || !blob) throw new Error(error?.message ?? 'download failed');

    const bytes = Buffer.from(await blob.arrayBuffer());
    const mediaType = blob.type || 'application/octet-stream';
    const content: ContentBlock[] = [];

    if (mediaType === 'application/pdf') {
      content.push({
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: bytes.toString('base64') },
      });
    } else if (IMAGE_TYPES.includes(mediaType)) {
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: mediaType, data: bytes.toString('base64') },
      });
    } else {
      return NextResponse.json(
        { error: 'We can read PDFs and images. Convert the file and upload it again.' },
        { status: 400 },
      );
    }
    content.push({ type: 'text', text: `Filename: ${row.filename}. Read this document and return the facts it contains.` });

    const call = await callAnthropic({
      model: MODELS.extract,
      system: EXTRACT_SYSTEM,
      content,
      effort: EFFORT.extract,
      max_tokens: MAX_TOKENS.extract,
    });

    const fact = redactCards(parseJson<ExtractedFact>(call.text));

    await db()
      .from('evidence')
      .update({ doc_type: fact.doc_type, extracted_json: fact })
      .eq('id', evidence_id);

    return NextResponse.json({ ok: true, fact });
  } catch (err) {
    captureError(err, { route: 'extract' });
    if (isConfigError(err)) {
      return NextResponse.json(
        { error: 'The appeal service is not set up correctly. That is on us, not your notice. Try again shortly.' },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: 'We could not read that document. Rescan it in colour at full page size and try again.' },
      { status: 502 },
    );
  }
}
