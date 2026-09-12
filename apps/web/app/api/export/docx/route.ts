import { NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { getCaseType } from '@reinstate/shared';
import { caseByToken, latestDraft } from '@/lib/cases';
import { captureError } from '@/lib/ops';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('case');
  if (!token) return NextResponse.json({ error: 'Missing case.' }, { status: 400 });

  try {
    const record = await caseByToken(token);
    if (!record) return NextResponse.json({ error: 'Case not found.' }, { status: 404 });

    const draft = await latestDraft(record.id);
    if (!draft) return NextResponse.json({ error: 'There is no draft to export yet.' }, { status: 400 });

    const caseType = getCaseType(record.case_type);
    const children: Paragraph[] = [];

    for (const line of draft.body_md.split('\n')) {
      const text = line.trim();
      if (!text) continue;
      if (text.startsWith('#')) {
        children.push(
          new Paragraph({
            text: text.replace(/^#{1,6}\s*/, ''),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
          }),
        );
      } else if (/^[-*]\s+/.test(text)) {
        children.push(
          new Paragraph({
            children: [new TextRun(text.replace(/^[-*]\s+/, ''))],
            bullet: { level: 0 },
            spacing: { after: 80 },
          }),
        );
      } else {
        children.push(new Paragraph({ children: [new TextRun(text)], spacing: { after: 160 } }));
      }
    }

    const doc = new Document({
      creator: 'Reinstate',
      title: caseType?.name ?? 'Appeal',
      sections: [{ children }],
    });

    const buffer = await Packer.toBuffer(doc);
    const filename = `${(caseType?.id ?? 'appeal')}-v${draft.version}.docx`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'content-type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'content-disposition': `attachment; filename="${filename}"`,
        'cache-control': 'no-store',
      },
    });
  } catch (err) {
    captureError(err, { route: 'export/docx' });
    return NextResponse.json({ error: 'The export failed. Copy the plain text instead.' }, { status: 500 });
  }
}
