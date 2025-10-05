'use client';

import Link from 'next/link';

export default function BodyFontsPreview() {
  const fonts = [
    { name: 'Inter', class: 'font-inter' },
    { name: 'Geist (Current Default)', class: 'font-sans' },
    { name: 'Outfit', class: 'font-outfit' },
    { name: 'Sora', class: 'font-sora' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-bold text-white mb-4 font-space-grotesk">Pick a body font</h1>
        <p className="text-xl text-slate-400 mb-16">Space Grotesk for headings, trying fonts for body text</p>

        <div className="space-y-12">
          {fonts.map((font) => (
            <div key={font.name} className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-12 border border-white/10">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-4xl font-bold text-white font-space-grotesk">Benefits for gig workers.</h2>
                  <span className="text-sm text-slate-400">{font.name}</span>
                </div>
                <p className={`text-xl text-slate-300 ${font.class}`}>
                  Navigate the gig economy with confidence. Access health insurance, retirement plans, and financial guidance designed for independent workers.
                </p>
              </div>

              <div className="border-t border-white/10 pt-8 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 font-space-grotesk">Health insurance</h3>
                  <p className={`text-slate-400 ${font.class}`}>
                    Access affordable health, dental, and vision plans. No employer required.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 font-space-grotesk">Retirement plans</h3>
                  <p className={`text-slate-400 ${font.class}`}>
                    Solo 401(k) and SEP IRA options that follow you from gig to gig.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Link
            href="/"
            className="text-slate-400 hover:text-white transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}