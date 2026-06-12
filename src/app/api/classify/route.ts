/**
 * POST /api/classify
 *
 * Batch-classifies bank transactions with Claude. This is the second pass of
 * the hybrid pipeline: the client's regex pass handles obvious hits for free,
 * and only the remainder/low-confidence transactions are sent here.
 *
 * The Anthropic API key never leaves the server.
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type {
  TransactionClassification,
  ClassifiableTransaction,
} from '@/lib/classification-types';

export const maxDuration = 60;

const MODEL = 'claude-sonnet-4-6';
const BATCH_SIZE = 50; // transactions per Claude call (cost control)
const MAX_TRANSACTIONS = 500; // hard cap per request

const CLASSIFICATION_TOOL: Anthropic.Tool = {
  name: 'record_classifications',
  description: 'Record the classification for every transaction in the batch.',
  input_schema: {
    type: 'object',
    properties: {
      classifications: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'The transaction id, copied exactly' },
            kind: {
              type: 'string',
              enum: ['income', 'expense', 'none'],
              description:
                'income = gig/self-employment income; expense = business expense for a gig worker; none = personal/irrelevant',
            },
            confidence: { type: 'number', description: '0 to 1' },
            platform: {
              type: 'string',
              description:
                'Income only: the gig platform or income source (e.g. Uber, DoorDash, Upwork). Use "Other Gig Work" if unbranded.',
            },
            incomeCategory: {
              type: 'string',
              enum: ['rideshare', 'delivery', 'freelance', 'creator', 'rental', 'other'],
            },
            expenseCategory: {
              type: 'string',
              enum: ['vehicle', 'equipment', 'supplies', 'software', 'phone', 'home-office', 'other'],
            },
            subcategory: {
              type: 'string',
              description: 'Expense only: short label, e.g. "Gas Station", "Software Subscriptions"',
            },
            deductible: { type: 'boolean', description: 'Expense only: is it plausibly deductible?' },
            deductionRate: {
              type: 'number',
              description:
                'Expense only: percent deductible 0-100. Use less than 100 for mixed personal/business use (e.g. 80 for phone, 50 for home internet).',
            },
            rationale: {
              type: 'string',
              description:
                'Expense only: one sentence, IRS-style justification citing the deduction type (e.g. Schedule C car-and-truck expenses).',
            },
          },
          required: ['id', 'kind', 'confidence'],
        },
      },
    },
    required: ['classifications'],
  },
};

const SYSTEM_PROMPT = `You classify bank-statement transactions for US gig workers (rideshare, delivery, freelance, creator, rental).

Rules:
- credit transactions can only be "income" or "none". A credit is income only if it plausibly comes from gig/self-employment work (platform payouts, client payments, marketplace sales). Salaries (W-2 payroll), refunds, transfers, and interest are "none".
- debit transactions can only be "expense" or "none". An expense is only worth recording if it is plausibly an ordinary and necessary business expense for a gig worker (vehicle costs, equipment, supplies, software, phone, home office). Groceries, restaurants, rent, entertainment are "none".
- Be conservative: when in doubt, use "none" with your honest confidence.
- For partially-deductible expenses use a reduced deductionRate (phone ~80, home internet ~50).
- Return a classification for EVERY transaction id you are given, exactly once.`;

function buildBatchPrompt(batch: ClassifiableTransaction[]): string {
  const lines = batch
    .map(
      (t) =>
        `id=${t.id} | date=${t.date} | type=${t.type} | amount=${t.amount.toFixed(2)} | description="${t.description}"`
    )
    .join('\n');
  return `Classify these ${batch.length} transactions:\n\n${lines}`;
}

function sanitize(raw: unknown): TransactionClassification | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== 'string' || typeof r.kind !== 'string') return null;
  if (!['income', 'expense', 'none'].includes(r.kind)) return null;

  const confidence =
    typeof r.confidence === 'number' ? Math.min(1, Math.max(0, r.confidence)) : 0.5;

  const c: TransactionClassification = {
    id: r.id,
    kind: r.kind as TransactionClassification['kind'],
    source: 'ai',
    confidence,
  };

  if (c.kind === 'income') {
    c.platform = typeof r.platform === 'string' && r.platform ? r.platform : 'Other Gig Work';
    c.incomeCategory = ([
      'rideshare',
      'delivery',
      'freelance',
      'creator',
      'rental',
      'other',
    ] as const).includes(r.incomeCategory as never)
      ? (r.incomeCategory as TransactionClassification['incomeCategory'])
      : 'other';
  } else if (c.kind === 'expense') {
    c.expenseCategory = ([
      'vehicle',
      'equipment',
      'supplies',
      'software',
      'phone',
      'home-office',
      'other',
    ] as const).includes(r.expenseCategory as never)
      ? (r.expenseCategory as TransactionClassification['expenseCategory'])
      : 'other';
    c.subcategory = typeof r.subcategory === 'string' ? r.subcategory : 'Business Expense';
    c.deductible = r.deductible !== false;
    c.deductionRate =
      typeof r.deductionRate === 'number' ? Math.min(100, Math.max(0, r.deductionRate)) : 100;
    c.rationale = typeof r.rationale === 'string' ? r.rationale : undefined;
  }

  return c;
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'AI classification is not configured on this server.' },
      { status: 503 }
    );
  }

  let body: { transactions?: ClassifiableTransaction[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const transactions = (body.transactions || []).filter(
    (t) =>
      t &&
      typeof t.id === 'string' &&
      typeof t.description === 'string' &&
      typeof t.amount === 'number' &&
      (t.type === 'credit' || t.type === 'debit')
  );

  if (transactions.length === 0) {
    return NextResponse.json({ classifications: [], model: MODEL, batches: 0 });
  }
  if (transactions.length > MAX_TRANSACTIONS) {
    return NextResponse.json(
      { error: `Too many transactions (max ${MAX_TRANSACTIONS} per request).` },
      { status: 413 }
    );
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const batches: ClassifiableTransaction[][] = [];
  for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
    batches.push(transactions.slice(i, i + BATCH_SIZE));
  }

  const results: TransactionClassification[] = [];

  try {
    for (const batch of batches) {
      const message = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 8192,
        system: SYSTEM_PROMPT,
        tools: [CLASSIFICATION_TOOL],
        tool_choice: { type: 'tool', name: 'record_classifications' },
        messages: [{ role: 'user', content: buildBatchPrompt(batch) }],
      });

      const toolUse = message.content.find(
        (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
      );
      const rawList =
        (toolUse?.input as { classifications?: unknown[] } | undefined)?.classifications || [];

      const batchIds = new Set(batch.map((t) => t.id));
      for (const raw of rawList) {
        const c = sanitize(raw);
        if (c && batchIds.has(c.id)) {
          results.push(c);
          batchIds.delete(c.id); // ignore duplicates
        }
      }
      // Anything the model skipped is treated as unclassified
      for (const id of batchIds) {
        results.push({ id, kind: 'none', source: 'ai', confidence: 0 });
      }
    }
  } catch (err) {
    console.error('Claude classification error:', err);
    return NextResponse.json(
      { error: 'AI classification failed. Transactions were classified by pattern matching only.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ classifications: results, model: MODEL, batches: batches.length });
}
