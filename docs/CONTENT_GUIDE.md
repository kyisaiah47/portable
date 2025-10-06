# Content Management Guide

How to add and manage tips, guides, and resources in the Portable app.

---

## Overview

All content (tips, guides, resources) is stored in a **centralized registry** at:

```
src/lib/content-registry.ts
```

This single file contains:
- All tips shown on the Home tab
- All guides shown on the Learn tab
- City-specific data and benchmarks
- Filtering logic

**Benefits:**
- ✅ Single source of truth
- ✅ Easy to add new content
- ✅ Automatic filtering by city + gig type
- ✅ Consistent across the app

---

## Adding a New Tip

Tips appear on the **Home tab** under "Personalized tips".

### Step 1: Choose a Category

Tips can be one of:
- `income` - Income optimization tips
- `tax` - Tax reminders and deductions
- `benefits` - Health insurance, retirement, emergency funds
- `platform` - Platform diversification advice
- `city` - City-specific benchmarks and hotspots

### Step 2: Add to CONTENT_REGISTRY Array

Open `src/lib/content-registry.ts` and add a new object to the `CONTENT_REGISTRY` array:

```typescript
{
  id: 'unique-tip-id',                    // Must be unique
  type: 'tip',                            // Always 'tip' for tips
  title: 'Short catchy title',            // Keep under 40 characters
  description: 'Longer explanation...',   // 1-2 sentences
  category: 'income',                     // One of: income, tax, benefits, platform, city
  gigTypes: ['rideshare', 'delivery'],   // Which gig types this applies to
  cities: ['New York'],                   // Which cities (or ['all'] for all cities)
  priority: 'high',                       // high, medium, or low
  icon: '💰',                            // Single emoji
  color: 'green',                         // blue, green, purple, orange, red, yellow
  action: 'Learn more',                   // Optional: CTA button text
  actionLink: '/dashboard?tab=taxes',     // Optional: Link for CTA button
}
```

### Example: Tax Tip for All Gig Types

```typescript
{
  id: 'quarterly-payment-due',
  type: 'tip',
  title: 'Q2 tax payment due June 15',
  description: 'Your estimated quarterly tax payment is due June 15. Set aside 30% of your income to avoid penalties.',
  category: 'tax',
  gigTypes: ['all'],                     // Applies to everyone
  cities: ['all'],                        // Shows in all cities
  priority: 'high',
  icon: '📅',
  color: 'orange',
  action: 'View tax calendar',
  actionLink: '/dashboard?tab=taxes',
}
```

### Example: City-Specific Rideshare Tip

```typescript
{
  id: 'sf-tech-commute',
  type: 'tip',
  title: 'San Francisco tech shuttle rush',
  description: 'Tech shuttle times (8-9AM, 6-7PM) create high demand. Position yourself near SoMa and Mission for guaranteed rides.',
  category: 'city',
  gigTypes: ['rideshare'],               // Only for rideshare drivers
  cities: ['San Francisco'],             // Only shows in SF
  priority: 'medium',
  icon: '💡',
  color: 'blue',
}
```

---

## Adding a New Guide

Guides appear on the **Learn tab** as article cards.

### Step 1: Add to CONTENT_REGISTRY Array

```typescript
{
  id: 'guide-unique-slug',
  type: 'guide',                          // Always 'guide' for guides
  title: 'How to Master Uber Surge Pricing',
  description: 'Learn when and where surge hits highest, and how to position yourself for maximum earnings.',
  category: 'guide',                      // Always 'guide' for guides
  gigTypes: ['rideshare'],               // Which gig types this applies to
  cities: ['New York', 'Chicago'],       // Which cities (or ['all'])
  priority: 'high',
  icon: '📖',                            // Usually 📖 for guides
  color: 'blue',
  readTime: '5 min read',                // Estimate reading time
  tags: ['surge', 'strategy', 'uber'],   // Optional: for future search
}
```

### Example: Multi-City Freelance Guide

```typescript
{
  id: 'guide-upwork-rates',
  type: 'guide',
  title: 'How to Raise Your Upwork Rates Without Losing Clients',
  description: 'Step-by-step guide with email templates to increase your hourly rate by 20-30% while keeping existing clients happy.',
  category: 'guide',
  gigTypes: ['freelance'],
  cities: ['all'],                        // Applies everywhere
  priority: 'high',
  icon: '📖',
  color: 'green',
  readTime: '6 min read',
  tags: ['upwork', 'pricing', 'negotiation', 'freelance'],
}
```

---

## Filtering Logic

Content automatically filters based on:

1. **City Filter** (dropdown on Learn page)
   - If cities selected: shows content for those cities + content marked `['all']`
   - If no cities selected: shows all content

2. **Gig Type Filter** (dropdown on Learn page)
   - If gig types selected: shows content for those types + content marked `['all']`
   - If no gig types selected: shows all content

3. **Priority Sorting**
   - Content always sorted by priority: high → medium → low

### Examples

**User selects:**
- Cities: `['New York', 'Chicago']`
- Gig Types: `['rideshare']`

**What they see:**
- ✅ Tips/guides for New York + rideshare
- ✅ Tips/guides for Chicago + rideshare
- ✅ Tips/guides marked `cities: ['all']` + `gigTypes: ['rideshare']`
- ✅ Tips/guides marked `cities: ['New York']` + `gigTypes: ['all']`
- ❌ Tips/guides for San Francisco
- ❌ Tips/guides for delivery only

---

## Adding a New City

### Step 1: Add City Data to CITY_DATA

In `src/lib/content-registry.ts`, add to the `CITY_DATA` object:

```typescript
'Seattle': {
  avgHourly: { uber: 26, lyft: 24, doordash: 21 },
  peakHours: 'Weekday rush 7-9AM, 5-7PM',
  hotspots: ['Capitol Hill', 'Fremont', 'Ballard'],
  tips: [
    'Amazon HQ commute times = guaranteed surge',
    'Ferry terminal runs (5-7PM) very profitable',
    'Avoid downtown during Seahawks games - gridlock',
  ],
},
```

### Step 2: Add City to Type Definition

Update the `City` type at the top of the file:

```typescript
export type City = 'New York' | 'San Francisco' | 'Los Angeles' | 'Chicago' | 'Austin' | 'Seattle' | 'all';
```

### Step 3: Add City to Dropdown

In `src/components/Dashboard.tsx`, find the city dropdown (around line 1709) and add:

```typescript
{['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Austin', 'Seattle'].map((city) => (
  // ... existing code
))}
```

### Step 4: Add City-Specific Content

Now you can add tips/guides with `cities: ['Seattle']`!

---

## Adding a New Gig Type

### Step 1: Add to Type Definition

In `src/lib/content-registry.ts`:

```typescript
export type GigType = 'rideshare' | 'delivery' | 'freelance' | 'creator' | 'rental' | 'tutoring' | 'all';
```

### Step 2: Add to Dropdown

In `src/components/Dashboard.tsx`, find the gig type dropdown (around line 1753) and add:

```typescript
{['Rideshare', 'Delivery', 'Freelance', 'Creator', 'Rental', 'Tutoring'].map((gigType) => (
  // ... existing code
))}
```

### Step 3: Add Content for New Type

Now you can add tips/guides with `gigTypes: ['tutoring']`!

---

## Best Practices

### Writing Effective Tips

✅ **DO:**
- Keep titles under 40 characters
- Use action-oriented language ("Track your mileage", not "Mileage tracking")
- Include specific numbers ("$2000+ savings" vs "significant savings")
- Make descriptions 1-2 sentences max
- Use emojis that match the content

❌ **DON'T:**
- Use jargon or technical terms
- Write vague advice ("work smarter, not harder")
- Make promises you can't keep
- Duplicate existing content

### Writing Effective Guides

✅ **DO:**
- Promise specific outcomes in the title
- Keep titles benefit-focused ("How to earn $X more" vs "Guide to earnings")
- Estimate reading time accurately (100 words = ~30 seconds)
- Use city names when content is location-specific
- Add relevant tags for future searchability

❌ **DON'T:**
- Write clickbait titles
- Make guides city-specific unless they truly are
- Exceed 10 min read time
- Duplicate information from tips

### Choosing Colors

Use colors semantically:

- **Blue** - General advice, platform tips
- **Green** - Income/money-making tips
- **Purple** - Strategy and optimization
- **Orange** - Tax and financial planning
- **Red** - Important warnings, benefits enrollment
- **Yellow** - Quick wins, insider tips

### Choosing Priority

- **High** - Time-sensitive, high-value, or universal advice
- **Medium** - Useful but not urgent
- **Low** - Nice-to-know, niche advice

---

## Testing Your Changes

After adding content:

1. **Check the Home tab:**
   - Your tips should appear in the "Personalized tips" section
   - Try different city/gig type filters

2. **Check the Learn tab:**
   - Your guides should appear with correct filtering
   - Verify read time displays correctly

3. **Test filtering:**
   - Select your specific city → should show your city-specific content
   - Select your specific gig type → should show your gig-specific content
   - Clear filters → should show all content

---

## Content Ideas

### High-Priority Tips to Add

- Quarterly tax deadlines for Q3, Q4
- Mileage tracking apps comparison
- Health insurance open enrollment reminders
- Platform deactivation warning tips
- Multi-app stacking best practices
- Emergency fund goals by income level

### High-Priority Guides to Add

- City-specific guides for more cities (Seattle, Boston, Miami, etc.)
- Platform-specific optimization guides (Lyft, Instacart, Fiverr, etc.)
- Tax filing walkthroughs for each gig type
- Retirement account comparison (Solo 401k vs SEP IRA vs Roth IRA)
- Insurance shopping guides by state

### Additional Gig Types to Support

- Tutoring (Wyzant, Tutor.com)
- Pet care (Rover, Wag)
- Handyman (TaskRabbit, Handy)
- Food prep (Shef, CookUnity)
- Retail arbitrage (Amazon FBA, eBay)

---

## Questions?

If you need help adding content or have questions about the registry system:

1. Read this guide thoroughly
2. Check existing content in `content-registry.ts` for examples
3. Test locally before committing
4. Keep content user-focused and actionable

Happy content creating! 🚀