# Portable Design System

Based on the landing page aesthetic - this is the visual language for the entire app.

---

## Core Design Principles

### 1. **Bold & Declarative**
- Large, confident typography (text-5xl to text-9xl)
- Single-word or short declarative statements ("Covered", "Building", "Simplified")
- Space Grotesk for headings, Inter for body

### 2. **Vibrant Gradients**
- Blue → Purple → Pink gradient palette
- Gradients on text: `bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent`
- Gradient backgrounds on cards
- Animated gradients with `animate-gradient`

### 3. **Floating Elements with Blur**
- Cards have blur behind them: `absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl blur opacity-50`
- Animated blobs in background: `animate-blob`
- Transform on hover: `group-hover:-translate-y-2`

### 4. **Glassmorphism**
- `backdrop-blur-xl` everywhere
- Semi-transparent backgrounds: `bg-slate-900/50`
- Subtle borders: `border border-white/10`
- Hover state: `hover:border-white/20`

---

## Typography Scale

### Headings (Space Grotesk)
```
- Mega:  text-9xl (144px) - Main hero only
- Hero:  text-8xl (96px)  - Section heroes
- Large: text-6xl (60px)  - Major sections
- Med:   text-5xl (48px)  - Subsections
- Small: text-3xl (30px)  - Card titles
- Tiny:  text-xl (20px)   - Labels
```

### Body (Inter)
```
- Large: text-2xl (24px) - Hero descriptions
- Med:   text-xl (20px)  - Section descriptions
- Base:  text-lg (18px)  - Body copy
- Small: text-sm (14px)  - Captions
- Tiny:  text-xs (12px)  - Labels
```

### Font Weights
```
- Black:     font-black (900) - BIG numbers only
- Bold:      font-bold (700)  - Headings
- Semibold:  font-semibold (600) - Subheadings
- Medium:    font-medium (500) - Body
- Light:     font-light (300)  - Descriptions
```

---

## Color Palette

### Gradients (Primary Brand)
```css
/* Blue to Purple to Pink */
from-blue-400 via-purple-400 to-pink-400

/* Card backgrounds */
from-blue-600 to-blue-700
from-purple-600 to-purple-700
from-pink-600 to-pink-700

/* Blob animations */
bg-blue-500/30
bg-purple-500/30
bg-pink-500/30
```

### Base Colors
```
- Background:    bg-slate-950 (almost black)
- Cards:         bg-slate-900/50 (semi-transparent)
- Borders:       border-white/10
- Text Primary:  text-white
- Text Secondary: text-slate-300
- Text Muted:    text-slate-400
```

### Accent Colors
```
- Blue:    from-blue-400 to-blue-600
- Purple:  from-purple-400 to-purple-600
- Pink:    from-pink-400 to-pink-600
- Green:   text-green-400 (success states)
- Orange:  text-orange-400 (warnings)
- Red:     text-red-400 (errors)
```

---

## Component Patterns

### Floating Gradient Card (SIGNATURE STYLE)
```jsx
<div className="group relative">
  {/* Blur effect behind */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>

  {/* Actual card */}
  <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-10 border border-blue-400/50 transform group-hover:-translate-y-2 transition-transform">
    <div className="text-sm text-blue-200 font-semibold mb-3 uppercase tracking-wider">Label</div>
    <div className="text-5xl font-black text-white mb-5 font-space-grotesk">WORD</div>
    <div className="text-blue-200 text-lg">Description here</div>
  </div>
</div>
```

### Animated Blob Background
```jsx
<div className="absolute inset-0">
  <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
  <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
  <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
</div>
```

### Glassmorphism Card (Secondary Style)
```jsx
<div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all">
  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
    <Icon className="w-7 h-7 text-white" />
  </div>
  <h3 className="text-2xl font-bold text-white mb-4 font-space-grotesk">Title</h3>
  <p className="text-slate-300 text-lg">Description text</p>
</div>
```

### Gradient Text
```jsx
<span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
  Gradient Text
</span>
```

### CTA Button
```jsx
<button className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-14 py-6 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-2xl shadow-purple-600/50 inline-flex items-center gap-3">
  <span>Text</span>
  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
</button>
```

---

## Spacing System

### Padding Scale
```
- Tiny:   p-2  (8px)
- Small:  p-4  (16px)
- Base:   p-6  (24px)
- Large:  p-8  (32px)
- XL:     p-10 (40px)
- 2XL:    p-12 (48px)
```

### Gap Scale
```
- Tight:  gap-2  (8px)
- Base:   gap-4  (16px)
- Large:  gap-6  (24px)
- XL:     gap-8  (32px)
```

### Section Padding
```
- Vertical: py-32 (128px)
- Hero: pt-28 pb-32
```

---

## Border Radius

```
- Small:  rounded-xl (12px)
- Medium: rounded-2xl (16px)
- Large:  rounded-3xl (24px)
- Full:   rounded-full (9999px)
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
- animate-blob (7s infinite)
- animate-gradient (8s ease infinite)
- animate-pulse (built-in Tailwind)
```

### Hover States
```
- Cards: group-hover:-translate-y-2
- Buttons: hover:scale-105
- Blur effects: group-hover:opacity-75
- Icons: group-hover:translate-x-1
```

---

## Layout Patterns

### Hero Section
```jsx
<section className="pt-28 pb-32 px-6 relative overflow-hidden">
  {/* Animated gradient mesh background */}
  <div className="absolute inset-0">{/* blobs */}</div>

  <div className="max-w-7xl mx-auto relative z-10">
    <div className="text-center max-w-5xl mx-auto">
      {/* Badge */}
      <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-full border border-white/10 mb-10">
        {/* content */}
      </div>

      {/* Massive heading */}
      <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-10 leading-[0.95] font-space-grotesk">
        <span className="inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
          Main text
        </span>
        <br />
        <span className="text-white">Secondary</span>
      </h1>

      {/* Description */}
      <p className="text-xl md:text-2xl text-slate-300 mb-14 leading-relaxed max-w-4xl mx-auto font-light">
        Description text
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
        {/* buttons */}
      </div>
    </div>
  </div>
</section>
```

### Content Section
```jsx
<section className="py-40 px-6 bg-slate-900/30">
  <div className="max-w-5xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-space-grotesk">
        Section Title
      </h2>
      <p className="text-xl text-slate-400">
        Section description
      </p>
    </div>

    {/* Content */}
  </div>
</section>
```

### Grid Layout
```jsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Cards */}
</div>
```

---

## Icon System

### Lucide React Icons
```
- Size small:  w-4 h-4
- Size base:   w-5 h-5
- Size medium: w-6 h-6
- Size large:  w-7 h-7
```

### Icon Containers
```jsx
{/* Small */}
<div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
  <Icon className="w-5 h-5 text-blue-400" />
</div>

{/* Medium */}
<div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
  <Icon className="w-7 h-7 text-white" />
</div>
```

---

## Dashboard-Specific Patterns

### Stats Display (NOT CARD-BASED)
Use the floating gradient card style with HUGE numbers:
```jsx
<div className="group relative">
  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl blur opacity-50"></div>
  <div className="relative bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-10 border border-green-400/50">
    <div className="text-sm text-green-200 font-semibold mb-2 uppercase">This Month</div>
    <div className="text-7xl font-black text-white mb-3 font-space-grotesk">$4,300</div>
    <div className="text-green-200 text-lg">+12% vs last month</div>
  </div>
</div>
```

### Section Headers
```jsx
<div className="mb-12">
  <h2 className="text-5xl font-bold text-white mb-4 font-space-grotesk">
    Section Title
  </h2>
  <p className="text-xl text-slate-400">
    Description
  </p>
</div>
```

---

## Don'ts ❌

1. **NO small boring stat cards** with tiny numbers
2. **NO `p-6 rounded-xl`** basic cards - use rounded-3xl with gradients
3. **NO small typography** - go BIG or go home
4. **NO flat colors** - everything should have gradients or glow
5. **NO grid-cols-4** tiny cards - use grid-cols-2 or grid-cols-3 max
6. **NO boring white/gray text** for important stuff - use gradients
7. **NO static elements** - add hover effects, transforms, glows

---

## Do's ✅

1. **USE floating gradient cards** for all important content
2. **USE massive typography** (text-5xl+) for key info
3. **USE animated blobs** in backgrounds
4. **USE gradient text** for emphasis
5. **USE hover transforms** on everything
6. **USE glassmorphism** (backdrop-blur-xl)
7. **USE Space Grotesk** for all headings/numbers
8. **MAKE IT BOLD** - declarative statements, not descriptions

---

## Example: Converting a Boring Stat Card

### Before ❌
```jsx
<div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
  <span className="text-slate-400 text-sm">This Month</span>
  <p className="text-3xl font-bold text-white">$4,300</p>
  <p className="text-sm text-green-400">+12%</p>
</div>
```

### After ✅
```jsx
<div className="group relative">
  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
  <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 border border-blue-400/50 transform group-hover:-translate-y-2 transition-transform">
    <div className="text-sm text-blue-200 font-semibold mb-3 uppercase tracking-wider">This Month</div>
    <div className="text-7xl font-black text-white mb-4 font-space-grotesk">$4,300</div>
    <div className="text-blue-200 text-xl">+12% from last month</div>
  </div>
</div>
```

---

## The Vibe Check ✨

**Ask yourself:**
- Would this look at home on the landing page?
- Is the typography bold enough?
- Are the gradients vibrant enough?
- Does it have that floating, glowing effect?
- Would a fintech startup use this to raise millions?

**If the answer is NO to any of these, make it MORE bold, MORE gradient, MORE floating.**