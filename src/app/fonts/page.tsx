'use client';

import Link from 'next/link';

export default function FontsPreview() {
  const fonts = [
    { name: 'Geist (Current)', class: 'font-sans' },
    { name: 'Inter', class: 'font-inter' },
    { name: 'Space Grotesk', class: 'font-space-grotesk' },
    { name: 'Outfit', class: 'font-outfit' },
    { name: 'Sora', class: 'font-sora' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-bold text-white mb-4">Pick a font for "Portable"</h1>
        <p className="text-xl text-slate-400 mb-16">Try different options for the logo</p>

        <div className="space-y-12">
          {fonts.map((font) => (
            <div key={font.name} className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-12 border border-white/10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-600"></div>
                  </div>
                  <span className={`text-3xl font-bold text-white ${font.class}`}>Portable</span>
                </div>
                <span className="text-sm text-slate-400">{font.name}</span>
              </div>

              <div className="border-t border-white/10 pt-8">
                <p className={`text-lg text-slate-300 ${font.class}`}>
                  The quick brown fox jumps over the lazy dog. Financial guidance for gig workers.
                </p>
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