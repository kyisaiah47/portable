/**
 * POST /api/deduction-check
 *
 * "Can I deduct this?" — single-transaction deduction explanation.
 * One Claude call returning a grounded verdict: deduction category,
 * IRS-style rationale, and a confidence level.
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 30;

const MODEL = 'claude-sonnet-4-6';

const VERDICT_TOOL: Anthropic.Tool = {
  name: 'record_verdict',
  description: 'Record the deduction verdict for the transaction.',
  input_schema: {
    type: 'object',
    properties: {
      verdict: {
        type: 'string',
        enum: ['yes', 'partially', 'no', 'depends'],
        description:
          'yes = fully deductible business expense; partially = deductible at a reduced rate (mixed use); no = personal/not deductible; depends = needs more context from the user',
      },
      category: {
        type: 'string',
        description:
          'The deduction category, e.g. "Car and truck expenses (Schedule C, Line 9)", "Supplies (Schedule C, Line 22)". Empty string if verdict is "no".',
      },
      deductionRate: {
        type: 'number',
        description: 'Percent deductible 0-100 (e.g. 80 for a phone bill with mixed use).',
      },
      explanation: {
        type: 'string',
        description:
          '2-4 sentences in plain English: why it is or is not deductible, grounded in IRS rules for self-employed workers (ordinary and necessary, business-use percentage, documentation needed). No legalese.',
      },
      confidence: {
        type: 'string',
        enum: ['high', 'medium', 'low'],
      },
    },
    required: ['verdict', 'category', 'deductionRate', 'explanation', 'confidence'],
  },
};

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'AI deduction checks are not configured on this server.' },
      { status: 503 }
    );
  }

  let body: {
    description?: string;
    amount?: number;
    date?: string;
    gigTypes?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.description || typeof body.description !== 'string') {
    return NextResponse.json({ error: 'Missing transaction description' }, { status: 400 });
  }

  const gigContext =
    body.gigTypes && body.gigTypes.length > 0
      ? `The user earns gig income from: ${body.gigTypes.slice(0, 10).join(', ')}.`
      : 'The user is a US gig worker (platform mix unknown).';

  const prompt = `${gigContext}

They are asking whether this bank transaction is tax-deductible as a self-employment business expense:

Description: "${body.description.slice(0, 300)}"
Amount: $${Math.abs(Number(body.amount) || 0).toFixed(2)}
Date: ${body.date || 'unknown'}

Give your verdict. Be practical and conservative — this is general information, not personalized tax advice. If the expense is only deductible in proportion to business use (phone, internet, vehicle), say so and use a typical business-use percentage.`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system:
        'You are a tax assistant for US self-employed gig workers. You explain Schedule C deductions in plain English, grounded in IRS rules (ordinary and necessary expenses, business-use percentage, substantiation). You never invent rules and you always remind users this is general information.',
      tools: [VERDICT_TOOL],
      tool_choice: { type: 'tool', name: 'record_verdict' },
      messages: [{ role: 'user', content: prompt }],
    });

    const toolUse = message.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
    );
    if (!toolUse) {
      throw new Error('No structured verdict returned');
    }

    const input = toolUse.input as Record<string, unknown>;
    return NextResponse.json({
      verdict: input.verdict,
      category: input.category,
      deductionRate:
        typeof input.deductionRate === 'number'
          ? Math.min(100, Math.max(0, input.deductionRate))
          : 0,
      explanation: input.explanation,
      confidence: input.confidence,
    });
  } catch (err) {
    console.error('Deduction check error:', err);
    return NextResponse.json(
      { error: 'Could not get an answer right now. Please try again.' },
      { status: 502 }
    );
  }
}
