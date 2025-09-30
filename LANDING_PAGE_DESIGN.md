# Portable Landing Page Design System

The marketing site - bold, declarative, and scroll-focused.

---

## Core Principles

### 1. **Massive & Bold Typography**
- Huge, confident headings (text-7xl to text-9xl)
- Single-word or short declarative statements ("Covered", "Building", "Simplified")
- Space Grotesk for all headings and numbers
- Leading: tight (leading-[0.95]) for drama

### 2. **Vibrant Gradients Everywhere**
- Blue → Purple → Pink (brand gradient)
- Animated gradient text with `animate-gradient`
- Gradient CTAs that pop
- Colored glow effects on hover

### 3. **Floating Gradient Cards**
- Blur effect behind card (signature style)
- Transform on hover (`group-hover:-translate-y-2`)
- Large padding (p-10, p-12)
- Rounded-3xl corners

### 4. **Animated Background Blobs**
- Large gradient orbs (`bg-blue-500/30`)
- `animate-blob` with delays
- `mix-blend-multiply` for depth
- Creates movement and energy

---

## Typography Scale

### Headings (Space Grotesk)
```
- Mega:  text-9xl (144px) - Main hero only ("Benefits" "Simplified")
- Hero:  text-8xl (96px)  - Section heroes
- Large: text-6xl (60px)  - Major section titles
- Med:   text-5xl (48px)  - Subsection titles
- Small: text-3xl (30px)  - Card titles
```

### Body (Inter)
```
- Hero:  text-2xl (24px) - Hero descriptions
- Large: text-xl (20px)  - Section descriptions
- Base:  text-lg (18px)  - Feature descriptions
```

### Font Weights
```
- Black: font-black (900) - Headlines and big numbers
- Bold:  font-bold (700)  - Section headings
- Light: font-light (300) - Descriptions
```

---

## Component Patterns

### Hero Section
```jsx
<section className="pt-28 pb-32 px-6 relative overflow-hidden">
  {/* Animated gradient mesh background */}
  <div className="absolute inset-0">
    <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
    <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
    <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
  </div>

  <div className="max-w-7xl mx-auto relative z-10">
    <div className="text-center max-w-5xl mx-auto">
      {/* Badge */}
      <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-full border border-white/10 mb-10">
        <Sparkles className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium text-white">Built for 60M+ independent workers</span>
      </div>

      {/* Massive heading with gradient */}
      <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-10 leading-[0.95] font-space-grotesk">
        <span className="inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
          Benefits
        </span>
        <br />
        <span className="text-white">Simplified</span>
      </h1>

      {/* Description */}
      <p className="text-xl md:text-2xl text-slate-300 mb-14 leading-relaxed max-w-4xl mx-auto font-light">
        Health insurance, retirement plans, and income tracking for gig workers. Built for Uber drivers, DoorDash couriers, and freelancers.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
        <button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-14 py-5 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-2xl shadow-purple-600/50">
          Get Started Free
        </button>
        <button className="bg-white/10 backdrop-blur-sm text-white px-14 py-5 rounded-full text-lg font-bold border border-white/20 hover:bg-white/20 transition-colors">
          Learn More
        </button>
      </div>
    </div>
  </div>
</section>
```

### Floating Gradient Card (Signature Landing Page Style)
```jsx
<div className="group relative">
  {/* Blur effect behind */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>

  {/* Actual card */}
  <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-10 border border-blue-400/50 transform group-hover:-translate-y-2 transition-transform">
    <div className="text-sm text-blue-200 font-semibold mb-3 uppercase tracking-wider">Healthcare</div>
    <div className="text-5xl font-black text-white mb-5 font-space-grotesk">COVERED</div>
    <div className="text-blue-200 text-lg">No employer required</div>
  </div>
</div>
```

### Feature Grid (Glassmorphism Cards)
```jsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
  <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all">
    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
      <Shield className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-2xl font-bold text-white mb-4 font-space-grotesk">Health insurance</h3>
    <p className="text-slate-400 leading-relaxed">
      Access affordable health, dental, and vision plans. No employer required.
    </p>
  </div>
</div>
```

### Gradient CTA Section
```jsx
<section className="py-32 px-6 relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
  <div className="absolute inset-0 bg-[url('...')] opacity-20"></div>

  <div className="max-w-4xl mx-auto text-center relative z-10">
    <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 font-space-grotesk">
      Join 60M+ independent workers
    </h2>
    <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
      Get started in minutes. No credit check, no monthly fees, no minimum balance.
    </p>
    <Link
      href="/signup"
      className="bg-white text-gray-900 px-14 py-5 rounded-full text-lg font-bold hover:bg-gray-100 transition-colors shadow-2xl inline-flex items-center gap-3"
    >
      Download Portable
      <ArrowRight className="w-5 h-5" />
    </Link>
  </div>
</section>
```

---

## Spacing & Layout

### Section Padding
```
- Hero: pt-28 pb-32
- Content sections: py-40
- CTA sections: py-32
```

### Container Widths
```
- Hero content: max-w-5xl
- Section content: max-w-5xl or max-w-7xl
- Description text: max-w-4xl
```

### Grid Gaps
```
- Feature grids: gap-8
- Large card grids: gap-10
```

### Border Radius
```
- Cards: rounded-3xl (24px)
- Badges: rounded-full
- Buttons: rounded-full
- Icon containers: rounded-2xl (16px)
```

---

## Animations

### Keyframes (in globals.css)
```css
@keyframes blob {
  0%, 100% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

### Usage
```
- animate-blob (7s ease-in-out infinite)
- animate-gradient (8s ease infinite, background-size: 200% 200%)
- Cards: group-hover:-translate-y-2
- Buttons: hover:scale-105
- Icons: group-hover:translate-x-1
```

---

## Color Palette

### Brand Gradients
```css
/* Primary gradient */
from-blue-400 via-purple-400 to-pink-400

/* Card gradients */
from-blue-600 to-blue-700
from-purple-600 to-purple-700
from-pink-600 to-pink-700
from-green-600 to-green-700

/* Background blobs */
bg-blue-500/30
bg-purple-500/30
bg-pink-500/30
```

### Base Colors
```
- Background: bg-slate-950
- Cards: bg-slate-900/50
- Borders: border-white/10, border-white/20 (hover)
- Text: text-white, text-slate-300, text-slate-400
```

---

## Do's ✅

1. **GO BIG** - Use text-8xl and text-9xl for main headlines
2. **USE SCROLL** - Design for vertical storytelling
3. **ANIMATE** - Add blob backgrounds and gradient animations
4. **FLOAT** - Use the blur + card pattern for key messages
5. **GRADIENT TEXT** - Make important words gradient with bg-clip-text
6. **FULL-WIDTH SECTIONS** - Use full viewport width with padding
7. **BOLD STATEMENTS** - Single words or short phrases, not paragraphs

## Don'ts ❌

1. **NO DENSE LAYOUTS** - Landing pages scroll, they don't pack
2. **NO SMALL TYPE** - If it's not at least text-5xl, reconsider
3. **NO BORING BACKGROUNDS** - Always have animated blobs or gradients
4. **NO SUBTLE EFFECTS** - Go bold or go home
5. **NO MULTI-COLUMN COMPLEXITY** - Keep it simple, centered, scrollable