# Portable Dashboard Design System

Internal app pages - dense, functional, corporate, yet branded.

---

## Core Principles

### 1. **Dense & Functional (NOT Landing Page)**
- Multi-column grids (2-3 columns max)
- Compact, scannable information
- Functional banking app aesthetic
- Full-width usage of space

### 2. **Personality in Copy, Not Size**
- Use conversational, helpful text
- "You're crushing it" not just "Dashboard"
- "Real talk: Bump your rate 15%" not just "$50/hr"
- Educational, not just numbers

### 3. **Corporate Polish**
- Clear section dividers (`border-t border-white/10`)
- Consistent padding and spacing
- Professional, organized layout
- Generous breathing room

### 4. **Social Feed Feel**
- Recommendations at top
- Articles and content mixed with data
- Clickable cards with hover states
- Exciting to explore, not just utility

---

## Typography Scale

### Headings (Space Grotesk)
```
- Page hero:  text-2xl to text-3xl (24-30px) - Hero greeting
- Section:    text-xl to text-lg (20-18px)   - Section titles
- Card title: text-base (16px)               - Card headings
- Labels:     text-sm (14px)                 - Subsections
```

### Body (Inter)
```
- Large:  text-lg (18px)   - Hero descriptions
- Base:   text-base (16px) - Card descriptions
- Small:  text-sm (14px)   - Body copy
- Tiny:   text-xs (12px)   - Labels, captions
```

### Numbers (Space Grotesk)
```
- Big stat:    text-xl (20px) - Important metrics
- Medium stat: text-lg (18px) - Card numbers
- Small stat:  text-base (16px) - Secondary numbers
```

**Key difference from landing page:** Everything is 1-2 sizes smaller. text-9xl becomes text-3xl.

---

## Layout Patterns

### Page Container
```jsx
<div className="max-w-7xl mx-auto px-6 py-8">
  <div className="space-y-8">
    {/* Sections with dividers */}
  </div>
</div>
```

### Hero Message (Top of Feed)
```jsx
<div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-8">
  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 font-space-grotesk">
    You're crushing it, Sarah
  </h1>
  <p className="text-base md:text-lg text-slate-300">
    $4,300 earned this month. Auto-saved $876 for benefits and $1,075 for taxes. Most people don't have their shit this together.
  </p>
</div>
```

### Section Divider
```jsx
<div className="border-t border-white/10"></div>
```

### Section Header
```jsx
<div className="mb-4">
  <h2 className="text-xl font-bold text-white font-space-grotesk">Section title</h2>
  <p className="text-xs text-slate-400">Helpful description</p>
</div>
```

### Dense Grid Layout
```jsx
{/* 2 columns on tablet, 3 on desktop */}
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>

{/* Side-by-side sections */}
<div className="grid md:grid-cols-2 gap-4">
  {/* Two equal-width sections */}
</div>
```

---

## Component Patterns

### Recommendation Card
```jsx
<div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer group">
  <div className="flex items-start justify-between mb-2">
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
        <Heart className="w-4 h-4 text-blue-400" />
      </div>
      <h3 className="text-base font-bold text-white font-space-grotesk">Get health insurance</h3>
    </div>
    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
  </div>
  <p className="text-xs text-slate-400 mb-2">As an Uber driver, having health coverage protects you and your income. Plans start at $200/mo with subsidies available.</p>
  <div className="text-xs text-blue-400 font-semibold">Browse marketplace →</div>
</div>
```

### Platform/Stat Card
```jsx
<div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-blue-500/50 transition-all">
  <div className="flex items-start justify-between mb-3">
    <div className="flex items-center space-x-2">
      <div className="text-2xl">🚗</div>
      <div>
        <h3 className="text-base font-bold text-white font-space-grotesk">Uber</h3>
        <p className="text-xs text-slate-400">Rideshare</p>
      </div>
    </div>
    <div className="text-right">
      <div className="text-xl font-black bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent font-space-grotesk">$1,890</div>
      <div className="text-xs text-slate-400">44% of income</div>
    </div>
  </div>
  <div className="h-1.5 bg-slate-800 rounded-full mb-2 overflow-hidden">
    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{width: '44%'}}></div>
  </div>
  <p className="text-xs text-blue-400"><strong>Your best hours:</strong> 5-9pm weekdays when surge hits</p>
</div>
```

### Article Card
```jsx
<div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer group">
  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
    <BookOpen className="w-4 h-4 text-blue-400" />
  </div>
  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-blue-400 transition-colors">Article title</h3>
  <p className="text-xs text-slate-400 mb-3">Article preview text that explains what the user will learn.</p>
  <div className="flex items-center justify-between">
    <span className="text-xs text-blue-400">5 min read</span>
    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-400 transition-colors" />
  </div>
</div>
```

### Action Button Card
```jsx
<div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
  <h3 className="text-lg font-bold text-white mb-3 font-space-grotesk">Quick actions</h3>
  <div className="space-y-2">
    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg text-left hover:opacity-90 transition-opacity flex items-center justify-between">
      <div>
        <div className="text-sm font-semibold">Connect new platform</div>
        <div className="text-xs text-blue-100">Sync earnings automatically</div>
      </div>
      <Globe className="w-5 h-5" />
    </button>
  </div>
</div>
```

### Community Insights
```jsx
<div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-6">
  <div className="flex items-center space-x-2 mb-3">
    <Users className="w-5 h-5 text-blue-400" />
    <h2 className="text-lg font-bold text-white font-space-grotesk">Community insights</h2>
  </div>
  <div className="space-y-3">
    <div className="flex items-start space-x-3">
      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
      <p className="text-sm text-slate-300">
        <span className="font-bold text-white">12,000 Uber drivers</span> on Portable average <span className="font-bold text-blue-400">$2,100/mo more</span> with multi-platform strategies
      </p>
    </div>
  </div>
</div>
```

---

## Spacing System

### Container Spacing
```
- Page padding: px-6 py-8
- Section spacing: space-y-8
- Card grids: gap-4
```

### Card Padding
```
- Standard card: p-5 (20px)
- Hero card: p-8 (32px)
- Tight content: p-4 (16px)
```

### Margins
```
- Section header: mb-4
- Card internal: mb-2, mb-3
- Between text: mb-2
```

### Border Radius
```
- Cards: rounded-lg (8px) - LESS rounded than landing page
- Icon containers: rounded-lg (8px)
- Buttons: rounded-lg (8px)
- Progress bars: rounded-full
```

**Key difference from landing page:** rounded-lg instead of rounded-3xl for a tighter, more professional look.

---

## Navigation

### Sticky Top Nav
```jsx
<nav className="backdrop-blur-xl bg-slate-900/70 border-b border-white/10 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex justify-between items-center h-16">
      {/* Logo + tabs */}
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          {/* Gradient dots logo */}
          <h1 className="text-2xl font-bold text-white font-space-grotesk">Portable</h1>
        </div>
        <div className="hidden md:flex items-center space-x-1">
          {/* Tabs with icons */}
        </div>
      </div>
      {/* User + logout */}
    </div>
  </div>
</nav>
```

### Tab Navigation
```jsx
<button
  className={`flex items-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
    active ? 'text-white' : 'text-slate-400 hover:text-white'
  }`}
>
  <Icon className="w-4 h-4" />
  <span>Label</span>
</button>
```

---

## Color Usage

### Status Colors
```
- Success: text-green-400, bg-green-500/20, border-green-500/30
- Warning: text-yellow-400, bg-yellow-500/20, border-yellow-500/30
- Error:   text-red-400, bg-red-500/20, border-red-500/30
- Info:    text-blue-400, bg-blue-500/20, border-blue-500/30
```

### Hover States
```
- Card borders: border-white/10 → hover:border-blue-500/50
- Icon colors: text-slate-400 → group-hover:text-blue-400
- Button opacity: opacity-100 → hover:opacity-90
- Background: bg-slate-800/50 → hover:bg-slate-800
```

---

## Content Organization

### Typical Dashboard Page Flow
1. **Hero greeting** - Personalized welcome with key stats
2. **Divider**
3. **Recommendations** - 2-column grid of actionable items
4. **Divider**
5. **Main data** - Platform breakdown, earnings, etc. (3-column grid)
6. **Divider**
7. **Quick actions + Status** - Side-by-side 2-column
8. **Divider**
9. **Educational content** - Article grid (3-column)
10. **Divider**
11. **Community insights** - Social proof section

---

## Do's ✅

1. **USE DIVIDERS** - `border-t border-white/10` between all sections
2. **BE DENSE** - 2-3 column grids, not single column
3. **ADD PERSONALITY** - Write helpful copy, not just labels
4. **MIX CONTENT** - Recommendations, data, articles, social proof
5. **CONSISTENT PADDING** - p-5 for most cards, p-8 for hero
6. **HOVER EVERYTHING** - All clickable cards should have hover states
7. **USE GRADIENTS ON NUMBERS** - Make important stats gradient text
8. **KEEP IT SCANNABLE** - Users should quickly see what's important

## Don'ts ❌

1. **NO GIANT TEXT** - This isn't the landing page, use text-lg max for most things
2. **NO SINGLE COLUMN** - Always use grids for density
3. **NO MISSING DIVIDERS** - Every section should be clearly separated
4. **NO BORING LABELS** - "Earnings" → "Where your money's coming from"
5. **NO TINY PADDING** - p-4 minimum, p-5 standard, p-8 for heroes
6. **NO ROUNDED-3XL** - Use rounded-lg for tighter, professional look
7. **NO NUMBERS WITHOUT CONTEXT** - "$1,890" → "$1,890 • 44% of income • Your best hours: 5-9pm"

---

## The Vibe Check ✨

**Ask yourself:**
- Does this look like Stripe, Revolut, or Cash App?
- Can I scan the page and understand everything quickly?
- Is there personality in the copy, not just numbers?
- Are there things to click on and explore?
- Is it dense but not overwhelming?
- Does it feel professional but still branded?

**If the answer is NO to any of these, make it more dense, more organized, more helpful.**