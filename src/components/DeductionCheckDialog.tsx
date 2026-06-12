'use client';

/**
 * "Can I deduct this?" — per-transaction AI deduction check.
 * Renders a small trigger button that opens a dialog with a grounded
 * explanation from Claude (deduction category + IRS-style rationale).
 */

import { useState } from 'react';
import { Sparkles, Loader2, Check, X as XIcon, HelpCircle, Scale } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeductionVerdict {
  verdict: 'yes' | 'partially' | 'no' | 'depends';
  category: string;
  deductionRate: number;
  explanation: string;
  confidence: 'high' | 'medium' | 'low';
}

interface DeductionCheckDialogProps {
  description: string;
  amount: number;
  date?: Date | string;
  /** The user's gig platforms, for grounding (e.g. ['Uber', 'DoorDash']) */
  gigTypes?: string[];
}

const VERDICT_STYLES: Record<
  DeductionVerdict['verdict'],
  { label: string; className: string; icon: typeof Check }
> = {
  yes: { label: 'Deductible', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Check },
  partially: { label: 'Partially deductible', className: 'bg-amber-50 text-amber-700 border-amber-200', icon: Scale },
  no: { label: 'Not deductible', className: 'bg-red-50 text-red-700 border-red-200', icon: XIcon },
  depends: { label: 'It depends', className: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: HelpCircle },
};

export default function DeductionCheckDialog({
  description,
  amount,
  date,
  gigTypes,
}: DeductionCheckDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState<DeductionVerdict | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchVerdict = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/deduction-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          amount,
          date: date ? new Date(date).toISOString().split('T')[0] : undefined,
          gigTypes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Request failed');
      setVerdict(data as DeductionVerdict);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not get an answer right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next && !verdict && !loading) {
      fetchVerdict();
    }
  };

  const style = verdict ? VERDICT_STYLES[verdict.verdict] : null;
  const VerdictIcon = style?.icon || Sparkles;

  return (
    <>
      <button
        onClick={() => handleOpenChange(true)}
        title="Can I deduct this?"
        className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-colors"
      >
        <Sparkles className="w-3 h-3" />
        <span>Deduct?</span>
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-lg w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Can I deduct this?
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {description} • ${Math.abs(amount).toFixed(2)}
            </DialogDescription>
          </DialogHeader>

          {loading && (
            <div className="flex items-center gap-3 py-6 justify-center text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span className="text-sm">Checking IRS deduction rules…</span>
            </div>
          )}

          {error && !loading && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700 mb-2">{error}</p>
              <button
                onClick={fetchVerdict}
                className="text-xs font-medium text-gray-700 bg-white border border-gray-200 px-2.5 py-1 rounded-md hover:border-gray-300 transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {verdict && !loading && !error && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${style!.className}`}
                >
                  <VerdictIcon className="w-3.5 h-3.5" />
                  {style!.label}
                </span>
                {verdict.deductionRate > 0 && (
                  <span className="text-xs text-gray-500 font-medium">
                    {verdict.deductionRate}% deductible
                  </span>
                )}
              </div>

              {verdict.category && (
                <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                  <div className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1">
                    Deduction category
                  </div>
                  <div className="text-sm font-medium text-gray-900">{verdict.category}</div>
                </div>
              )}

              <p className="text-sm text-gray-600 leading-relaxed">{verdict.explanation}</p>

              <p className="text-[11px] text-gray-400">
                AI confidence: {verdict.confidence}. General information, not personalized tax
                advice.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
