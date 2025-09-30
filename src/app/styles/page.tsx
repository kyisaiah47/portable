'use client';

import Link from 'next/link';

export default function StylesIndex() {
  const styles = [
    { id: 1, name: 'Dark Premium', desc: 'Dark slate, gradient blurs, glassmorphism', status: '✓' },
    { id: 2, name: 'Clean Modern', desc: 'Stripe-inspired, professional fintech, light', status: '✓' },
    { id: 3, name: 'Robinhood Bold', desc: 'Black bg, emerald green, investing focus', status: '✓' },
    { id: 4, name: 'Revolut Gradient', desc: 'Colorful gradients, glass cards, modern', status: '✓' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-bold text-white mb-4">Pick a style</h1>
        <p className="text-xl text-slate-400 mb-16">10 different landing page designs</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {styles.map((style) => (
            <Link
              key={style.id}
              href={`/styles/${style.id}`}
              className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all group"
            >
              <div className="text-4xl font-bold text-white mb-2">{style.id}</div>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                {style.name}
              </h3>
              <p className="text-slate-400">{style.desc}</p>
            </Link>
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