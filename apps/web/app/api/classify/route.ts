import { NextResponse } from 'next/server';
import {
  callAnthropic,
  parseJson,
  getCaseType,
  CLASSIFY_SYSTEM,
  classifyUserMessage,
  MODELS,
  EFFORT,
  isConfigError,
  MAX_TOKENS,
  type Classification,
  type ContentBlock,
} from '@reinstate/shared';
import { rateLimit, clientIp } from '@/lib/ratelimit';
import { db } from '@/lib/supabase';
import { hasSupabase } from '@/lib/env';
import { captureError } from '@/lib/ops';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

interface Body {
  notice_text?: string;
  /** base64 data URL of a screenshot or PDF of the notice. */
  file?: { media_type: string; data: string };
}

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const day = new Date().toISOString().slice(0, 10);
  const limit = await rateLimit(`classify:${ip}:${day}`, 10, 86400);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error:
          'You have used today’s free classifications. Start a case to continue, or come back tomorrow.',
      },
      { status: 429 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Send JSON.' }, { status: 400 });
  }

  const noticeText = (body.notice_text ?? '').trim();
  if (!noticeText && !body.file) {
    return NextResponse.json(
      {
        error:
          'We need the suspension notice to classify your case. Paste the email text or upload a screenshot.',
      },
      { status: 400 },
    );
  }

  const content: ContentBlock[] = [];
  if (body.file) {
    const bytes = Math.floor((body.file.data.length * 3) / 4);
    if (bytes > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: 'That file is over 8 MB. Send a smaller image or paste the text.' }, { status: 400 });
    }
    if (body.file.media_type === 'application/pdf') {
      content.push({
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: body.file.data },
      });
    } else {
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: body.file.media_type, data: body.file.data },
      });
    }
  }
  content.push({ type: 'text', text: classifyUserMessage(noticeText || '(see attached image)') });

  let result: Classification;
  try {
    const call = await callAnthropic({
      model: MODELS.classify,
      system: CLASSIFY_SYSTEM,
      content,
      effort: EFFORT.classify,
      max_tokens: MAX_TOKENS.classify,
    });
    result = parseJson<Classification>(call.text);
  } catch (err) {
    captureError(err, { route: 'classify' });
    if (isConfigError(err)) {
      return NextResponse.json(
        { error: 'The appeal service is not set up correctly. That is on us, not your notice. Try again shortly.' },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: 'We could not read that notice. Paste the text of the email instead.' },
      { status: 502 },
    );
  }

  // The model is told to choose from a closed list. Enforce it.
  if (result.case_type && !getCaseType(result.case_type)) {
    result.case_type = null;
    result.confidence = 0;
  }
  result.alternates = (result.alternates ?? []).filter((a) => Boolean(getCaseType(a.case_type)));

  let classificationId: string | null = null;
  if (hasSupabase() && result.case_type) {
    try {
      const { data } = await db()
        .from('classifications')
        .insert({
          platform: result.platform,
          case_type: result.case_type,
          confidence: result.confidence,
          notice_text: noticeText || null,
          deadline: result.deadline,
          report_json: result,
        })
        .select('id')
        .single();
      classificationId = (data?.id as string) ?? null;
    } catch (err) {
      // A classification that cannot be stored is still worth showing.
      captureError(err, { route: 'classify', step: 'store' });
    }
  }

  return NextResponse.json({ ...result, classification_id: classificationId });
}
