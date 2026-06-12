/**
 * POST /api/tax-summary
 *
 * Plain-English quarterly tax summary. The tax calculator does all the math;
 * Claude only narrates the numbers it is given (what you owe, why, and what
 * to set aside).
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 30;

const MODEL = 'claude-sonnet-4-6';

interface TaxSummaryRequest {
  grossIncome: number;
  totalDeductions: number;
  adjustedGrossIncome: number;
  federalIncomeTax: number;
  selfEmploymentTax: number;
  socialSecurity: number;
  medicare: number;
  stateTax: number;
  totalTaxLiability: number;
  effectiveTaxRate: number; // 0..1
  quarterlyPayment: number;
  nextDeadline?: { quarter: string; dueDate: string } | null;
  platforms?: string[];
  deductionsByCategory?: Record<string, number>;
}

function fmt(n: number): string {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'AI summaries are not configured on this server.' },
      { status: 503 }
    );
  }

  let body: TaxSummaryRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const numericFields: (keyof TaxSummaryRequest)[] = [
    'grossIncome',
    'totalDeductions',
    'federalIncomeTax',
    'selfEmploymentTax',
    'stateTax',
    'totalTaxLiability',
    'quarterlyPayment',
  ];
  for (const field of numericFields) {
    if (typeof body[field] !== 'number' || !isFinite(body[field] as number)) {
      return NextResponse.json({ error: `Missing or invalid field: ${field}` }, { status: 400 });
    }
  }

  const deductionLines = body.deductionsByCategory
    ? Object.entries(body.deductionsByCategory)
        .map(([cat, amt]) => `  - ${cat}: ${fmt(amt)}`)
        .join('\n')
    : '  (no category breakdown available)';

  const prompt = `Write a plain-English quarterly tax summary for a US gig worker, using ONLY these pre-computed figures (projected annual amounts). Do not recalculate, change, or add any numbers — quote them as given.

Income & deductions:
- Projected gross self-employment income: ${fmt(body.grossIncome)}
- Business deductions found: ${fmt(body.totalDeductions)}
${deductionLines}
- Income sources: ${body.platforms?.length ? body.platforms.join(', ') : 'various gig platforms'}

Computed taxes (projected annual):
- Self-employment tax: ${fmt(body.selfEmploymentTax)} (Social Security ${fmt(body.socialSecurity ?? 0)} + Medicare ${fmt(body.medicare ?? 0)})
- Federal income tax: ${fmt(body.federalIncomeTax)}
- State tax estimate: ${fmt(body.stateTax)}
- Total tax liability: ${fmt(body.totalTaxLiability)}
- Effective tax rate: ${(body.effectiveTaxRate * 100).toFixed(1)}%
- Quarterly estimated payment: ${fmt(body.quarterlyPayment)}
${body.nextDeadline ? `- Next deadline: ${body.nextDeadline.quarter}, due ${body.nextDeadline.dueDate}` : ''}

Write 2-3 short paragraphs covering:
1. What they owe and why (self-employment tax exists because no employer withholds; deductions already lowered the bill).
2. What to set aside from each payout going forward (relate the effective rate to a practical per-dollar habit).
3. The quarterly payment amount and next deadline, and the one highest-impact thing they could do (e.g. track more deductions).

Tone: friendly, direct, second person. Plain text only — no markdown formatting of any kind (no headers, no bullet lists, no asterisks/bold). No disclaimers longer than one short sentence at the end. Do not perform any arithmetic of your own.`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();

    if (!text) throw new Error('Empty summary returned');

    return NextResponse.json({ summary: text });
  } catch (err) {
    console.error('Tax summary error:', err);
    return NextResponse.json(
      { error: 'Could not generate a summary right now. Please try again.' },
      { status: 502 }
    );
  }
}
