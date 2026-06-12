// Schedule C-shaped CSV export built from already-classified data.
// All numbers come from the deterministic calculators — nothing is recomputed here.

interface RawTransaction {
	date: string | Date;
	description: string;
	amount: number;
	type: 'credit' | 'debit';
	classification?: {
		kind: 'income' | 'expense' | 'none';
		platform?: string;
		incomeCategory?: string;
		expenseCategory?: string;
		deductible?: boolean;
		deductionRate?: number;
		rationale?: string;
	} | null;
}

function csvCell(v: string | number): string {
	const s = String(v);
	return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function buildAccountantCsv(opts: {
	totalIncome: number;
	totalDeductions: number;
	taxCalc: {
		selfEmploymentTax: number;
		federalIncomeTax: number;
		totalFederalTax: number;
		stateTax: number;
		quarterlyPayment: number;
	};
	transactions: RawTransaction[];
	mileage?: { totalMiles: number; rate: number };
}): string {
	const { totalIncome, totalDeductions, taxCalc, transactions, mileage } = opts;
	const lines: string[] = [];

	lines.push('STUB — ACCOUNTANT EXPORT');
	lines.push(`Generated,${new Date().toISOString().slice(0, 10)}`);
	lines.push('');

	lines.push('SUMMARY');
	lines.push(`Gross income,${totalIncome.toFixed(2)}`);
	lines.push(`Deductible expenses,${totalDeductions.toFixed(2)}`);
	if (mileage && mileage.totalMiles > 0) {
		lines.push(
			`Mileage deduction (${mileage.totalMiles.toFixed(1)} mi @ $${mileage.rate.toFixed(2)}),${(
				mileage.totalMiles * mileage.rate
			).toFixed(2)}`
		);
	}
	lines.push(`Self-employment tax (est.),${taxCalc.selfEmploymentTax.toFixed(2)}`);
	lines.push(`Federal income tax (est.),${taxCalc.federalIncomeTax.toFixed(2)}`);
	lines.push(`State tax (est.),${taxCalc.stateTax.toFixed(2)}`);
	lines.push(`Total federal tax (est.),${taxCalc.totalFederalTax.toFixed(2)}`);
	lines.push(`Suggested quarterly payment,${taxCalc.quarterlyPayment.toFixed(2)}`);
	lines.push('');

	const income = transactions.filter((t) => t.classification?.kind === 'income');
	lines.push('INCOME BY TRANSACTION');
	lines.push('Date,Description,Platform,Category,Amount');
	for (const t of income) {
		lines.push(
			[
				csvCell(typeof t.date === 'string' ? t.date : t.date.toISOString().slice(0, 10)),
				csvCell(t.description),
				csvCell(t.classification?.platform ?? ''),
				csvCell(t.classification?.incomeCategory ?? ''),
				t.amount.toFixed(2),
			].join(',')
		);
	}
	lines.push('');

	const expenses = transactions.filter(
		(t) => t.classification?.kind === 'expense' && t.classification?.deductible
	);
	lines.push('DEDUCTIBLE EXPENSES');
	lines.push('Date,Description,Category,Deduction rate %,Amount,Deductible amount,Reason');
	for (const t of expenses) {
		const rate = t.classification?.deductionRate ?? 100;
		const amt = Math.abs(t.amount);
		lines.push(
			[
				csvCell(typeof t.date === 'string' ? t.date : t.date.toISOString().slice(0, 10)),
				csvCell(t.description),
				csvCell(t.classification?.expenseCategory ?? ''),
				rate,
				amt.toFixed(2),
				((amt * rate) / 100).toFixed(2),
				csvCell(t.classification?.rationale ?? ''),
			].join(',')
		);
	}

	return lines.join('\n');
}

export function downloadAccountantCsv(csv: string) {
	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `stub-accountant-export-${new Date().toISOString().slice(0, 10)}.csv`;
	a.click();
	URL.revokeObjectURL(url);
}
