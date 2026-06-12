/**
 * POST /api/insights
 *
 * Claude reads the worker's full financial picture (platform mix, momentum,
 * deductions, tax position) and writes its analysis — the narrative layer
 * on top of the deterministic math.
 */
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 30;

const MODEL = 'claude-sonnet-4-6';

const INSIGHTS_TOOL: Anthropic.Tool = {
	name: 'record_insights',
	description: 'Record the financial analysis for the gig worker.',
	input_schema: {
		type: 'object',
		properties: {
			headline: {
				type: 'string',
				description:
					'One punchy sentence summarizing their overall position — specific to their numbers, not generic.',
			},
			insights: {
				type: 'array',
				maxItems: 5,
				items: {
					type: 'object',
					properties: {
						kind: {
							type: 'string',
							enum: ['opportunity', 'risk', 'pattern'],
						},
						title: { type: 'string', description: 'Short, specific. 4-8 words.' },
						body: {
							type: 'string',
							description:
								'2-3 sentences. Reference their actual numbers and platforms. End with a concrete action where possible. Plain English, no fluff.',
						},
					},
					required: ['kind', 'title', 'body'],
				},
			},
		},
		required: ['headline', 'insights'],
	},
};

export async function POST(request: NextRequest) {
	if (!process.env.ANTHROPIC_API_KEY) {
		return NextResponse.json(
			{ error: 'AI insights are not configured on this server.' },
			{ status: 503 }
		);
	}

	let body: { stats?: Record<string, unknown> };
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
	}
	if (!body.stats) {
		return NextResponse.json({ error: 'Missing stats' }, { status: 400 });
	}

	const prompt = `Here is a US gig worker's financial picture, computed from their actual bank statement:

${JSON.stringify(body.stats, null, 2)}

Write your analysis: what stands out, what's risky, what they should do next. Be specific to THEIR numbers — name the platforms, cite the dollar amounts and percentages. Do not restate the obvious ("you earned money from Uber"); find the things they wouldn't notice themselves: concentration risk, momentum shifts, deduction gaps (e.g. heavy driving income but thin vehicle deductions suggests unlogged mileage), tax exposure relative to income.`;

	const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

	try {
		const message = await anthropic.messages.create({
			model: MODEL,
			max_tokens: 1500,
			system:
				'You are a sharp financial analyst for US gig workers — part bookkeeper, part coach. You write tight, specific, numbers-first analysis. No hedging, no generic advice, no "consider consulting a professional" filler.',
			tools: [INSIGHTS_TOOL],
			tool_choice: { type: 'tool', name: 'record_insights' },
			messages: [{ role: 'user', content: prompt }],
		});

		const toolUse = message.content.find(
			(block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
		);
		if (!toolUse) throw new Error('No structured insights returned');

		return NextResponse.json(toolUse.input);
	} catch (err) {
		console.error('[insights] failed:', err);
		return NextResponse.json({ error: 'Analysis failed — try again.' }, { status: 500 });
	}
}
