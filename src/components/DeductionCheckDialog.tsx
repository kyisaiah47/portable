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
  yes: { label: 'Deductible', className: 'bg-green-500/20 text-green-400 border-green-500/30', icon: Check },
  partially: { label: 'Partially deductible', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Scale },
  no: { label: 'Not deductible', className: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XIcon },
  depends: { label: 'It depends', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: HelpCircle },
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
        className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-md text-purple-400 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40 transition-colors"
      >
        <Sparkles className="w-3 h-3" />
        <span>Deduct?</span>
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-lg w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white font-space-grotesk flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Can I deduct this?
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-400">
              {description} • ${Math.abs(amount).toFixed(2)}
            </DialogDescription>
          </DialogHeader>

          {loading && (
            <div className="flex items-center gap-3 py-6 justify-center text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
              <span className="text-sm">Checking IRS deduction rules...</span>
            </div>
          )}

          {error && !loading && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400 mb-3">{error}</p>
              <button
                onClick={fetchVerdict}
                className="text-xs font-semibold text-white bg-white/10 border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {verdict && !loading && !error && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${style!.className}`}
                >
                  <VerdictIcon className="w-3.5 h-3.5" />
                  {style!.label}
                </span>
                {verdict.deductionRate > 0 && (
                  <span className="text-xs text-slate-400 font-semibold">
                    {verdict.deductionRate}% deductible
                  </span>
                )}
              </div>

              {verdict.category && (
                <div className="bg-slate-800/50 rounded-lg p-3 border border-white/5">
                  <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-1">
                    Deduction category
                  </div>
                  <div className="text-sm font-semibold text-white">{verdict.category}</div>
                </div>
              )}

              <p className="text-sm text-slate-300 leading-relaxed">{verdict.explanation}</p>

              <p className="text-[11px] text-slate-500">
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
