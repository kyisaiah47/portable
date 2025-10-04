/**
 * Centralized Content Registry
 *
 * All tips, guides, and resources in one place for easy filtering
 * by city, gig type, and category.
 */

export type ContentCategory = 'income' | 'tax' | 'benefits' | 'platform' | 'city' | 'guide';
export type GigType = 'rideshare' | 'delivery' | 'freelance' | 'creator' | 'rental' | 'all';
export type City = 'New York' | 'San Francisco' | 'Los Angeles' | 'Chicago' | 'Austin' | 'all';

export interface ContentItem {
  id: string;
  type: 'tip' | 'guide' | 'resource';
  title: string;
  description: string;
  category: ContentCategory;
  gigTypes: GigType[];
  cities: City[];
  priority: 'high' | 'medium' | 'low';
  icon: string;
  color: string;
  action?: string;
  actionLink?: string;
  readTime?: string; // For guides
  tags?: string[];
  content?: string; // For guides
}

/**
 * City-specific data and benchmarks
 */
export const CITY_DATA: Record<string, {
  avgHourly: { [key: string]: number };
  peakHours: string;
  hotspots: string[];
  tips: string[];
}> = {
  'New York': {
    avgHourly: { uber: 28, lyft: 26, doordash: 22 },
    peakHours: 'Friday-Saturday 7PM-2AM, Weekday mornings 7-9AM',
    hotspots: ['Manhattan Midtown', 'Brooklyn Heights', 'Queens LIC'],
    tips: [
      'Surge pricing peaks during Broadway show times (8PM)',
      'Airport runs (JFK/LGA) are most profitable 5-7AM',
      'Avoid Midtown during lunch rush - too much traffic',
    ],
  },
  'San Francisco': {
    avgHourly: { uber: 32, lyft: 30, doordash: 24 },
    peakHours: 'Weekday commute 7-9AM, 5-7PM',
    hotspots: ['Mission District', 'Marina', 'Financial District'],
    tips: [
      'Tech shuttle times (8-9AM, 6-7PM) create high demand',
      'Mission District dinner rush (7-9PM) best for delivery',
      'Avoid SoMa during conferences - parking nightmare',
    ],
  },
  'Los Angeles': {
    avgHourly: { uber: 24, lyft: 22, doordash: 20 },
    peakHours: 'Friday-Saturday nights, Sunday brunch',
    hotspots: ['West Hollywood', 'Santa Monica', 'Downtown LA'],
    tips: [
      'LAX runs are most profitable early morning (5-8AM)',
      'WeHo nightlife (10PM-2AM) has consistent surge',
      'Avoid freeway during rush hour - surface streets faster',
    ],
  },
  'Chicago': {
    avgHourly: { uber: 25, lyft: 23, doordash: 21 },
    peakHours: 'Weekend nights, Cubs/Sox game days',
    hotspots: ['Wrigleyville', 'River North', 'Loop'],
    tips: [
      'Game days at Wrigley = 2-3x surge pricing',
      'River North bar close (2-3AM) very profitable',
      'Winter = less drivers = higher rates',
    ],
  },
  'Austin': {
    avgHourly: { uber: 22, lyft: 20, doordash: 19 },
    peakHours: 'Thursday-Saturday nights, SXSW/ACL',
    hotspots: ['6th Street', 'Rainey Street', 'Domain'],
    tips: [
      'SXSW/ACL weeks = 3-5x normal earnings',
      '6th Street bar close (2AM) guaranteed surge',
      'UT game days = easy money near campus',
    ],
  },
};

/**
 * Master content registry
 */
export const CONTENT_REGISTRY: ContentItem[] = [
  // Tax Tips
  {
    id: 'quarterly-tax-reminder',
    type: 'tip',
    title: 'Set aside for Q2 taxes',
    description: 'Based on your current income, you should save about 30% for quarterly estimated taxes. Due June 15th.',
    category: 'tax',
    gigTypes: ['all'],
    cities: ['all'],
    priority: 'high',
    icon: '📊',
    color: 'orange',
    action: 'View tax calendar',
    actionLink: '/dashboard?tab=taxes',
  },
  {
    id: 'mileage-tracking',
    type: 'tip',
    title: 'Track your mileage',
    description: 'Standard mileage deduction is $0.67/mile. Most rideshare/delivery drivers leave $2000+ on the table by not tracking miles properly.',
    category: 'tax',
    gigTypes: ['rideshare', 'delivery'],
    cities: ['all'],
    priority: 'medium',
    icon: '🚗',
    color: 'blue',
    action: 'Set up tracking',
  },

  // Platform Diversification
  {
    id: 'diversify-platforms',
    type: 'tip',
    title: 'Diversify your income streams',
    description: 'Top earners work 3+ platforms to smooth out slow periods and maximize earnings.',
    category: 'platform',
    gigTypes: ['all'],
    cities: ['all'],
    priority: 'high',
    icon: '🎯',
    color: 'blue',
    action: 'Add a platform',
  },
  {
    id: 'uber-doordash-stack',
    type: 'tip',
    title: 'Pair Uber with DoorDash',
    description: 'Uber drivers who also do DoorDash earn 40% more on average. Stack orders during your Uber downtime.',
    category: 'income',
    gigTypes: ['rideshare', 'delivery'],
    cities: ['all'],
    priority: 'high',
    icon: '💰',
    color: 'green',
    action: 'Connect DoorDash',
  },

  // Benefits
  {
    id: 'health-insurance',
    type: 'tip',
    title: 'You can afford health insurance',
    description: 'Health plans start at $150/mo with subsidies. Protect yourself and your earnings.',
    category: 'benefits',
    gigTypes: ['all'],
    cities: ['all'],
    priority: 'high',
    icon: '🏥',
    color: 'red',
    action: 'Browse plans',
    actionLink: '/dashboard?tab=benefits',
  },

  // City-Specific Tips - New York
  {
    id: 'ny-benchmark',
    type: 'tip',
    title: 'New York average: $28/hr',
    description: 'Rideshare drivers in New York average $28/hr. Peak earnings: Friday-Saturday 7PM-2AM, Weekday mornings 7-9AM.',
    category: 'city',
    gigTypes: ['rideshare'],
    cities: ['New York'],
    priority: 'medium',
    icon: '📍',
    color: 'purple',
  },
  {
    id: 'ny-hotspots',
    type: 'tip',
    title: 'Best zones in New York',
    description: 'Manhattan Midtown, Brooklyn Heights, Queens LIC. These areas have the highest order volume and tips.',
    category: 'city',
    gigTypes: ['rideshare', 'delivery'],
    cities: ['New York'],
    priority: 'medium',
    icon: '🗺️',
    color: 'blue',
  },
  {
    id: 'ny-broadway-surge',
    type: 'tip',
    title: 'New York insider tip',
    description: 'Surge pricing peaks during Broadway show times (8PM)',
    category: 'city',
    gigTypes: ['rideshare'],
    cities: ['New York'],
    priority: 'low',
    icon: '💡',
    color: 'yellow',
  },

  // City-Specific Tips - San Francisco
  {
    id: 'sf-benchmark',
    type: 'tip',
    title: 'San Francisco average: $32/hr',
    description: 'Rideshare drivers in San Francisco average $32/hr. Peak earnings: Weekday commute 7-9AM, 5-7PM.',
    category: 'city',
    gigTypes: ['rideshare'],
    cities: ['San Francisco'],
    priority: 'medium',
    icon: '📍',
    color: 'purple',
  },
  {
    id: 'sf-hotspots',
    type: 'tip',
    title: 'Best zones in San Francisco',
    description: 'Mission District, Marina, Financial District. These areas have the highest order volume and tips.',
    category: 'city',
    gigTypes: ['rideshare', 'delivery'],
    cities: ['San Francisco'],
    priority: 'medium',
    icon: '🗺️',
    color: 'blue',
  },
  {
    id: 'sf-tech-shuttle',
    type: 'tip',
    title: 'San Francisco insider tip',
    description: 'Tech shuttle times (8-9AM, 6-7PM) create high demand',
    category: 'city',
    gigTypes: ['rideshare'],
    cities: ['San Francisco'],
    priority: 'low',
    icon: '💡',
    color: 'yellow',
  },

  // City-Specific Tips - Los Angeles
  {
    id: 'la-benchmark',
    type: 'tip',
    title: 'Los Angeles average: $24/hr',
    description: 'Rideshare drivers in Los Angeles average $24/hr. Peak earnings: Friday-Saturday nights, Sunday brunch.',
    category: 'city',
    gigTypes: ['rideshare'],
    cities: ['Los Angeles'],
    priority: 'medium',
    icon: '📍',
    color: 'purple',
  },
  {
    id: 'la-hotspots',
    type: 'tip',
    title: 'Best zones in Los Angeles',
    description: 'West Hollywood, Santa Monica, Downtown LA. These areas have the highest order volume and tips.',
    category: 'city',
    gigTypes: ['rideshare', 'delivery'],
    cities: ['Los Angeles'],
    priority: 'medium',
    icon: '🗺️',
    color: 'blue',
  },
  {
    id: 'la-lax',
    type: 'tip',
    title: 'Los Angeles insider tip',
    description: 'LAX runs are most profitable early morning (5-8AM)',
    category: 'city',
    gigTypes: ['rideshare'],
    cities: ['Los Angeles'],
    priority: 'low',
    icon: '💡',
    color: 'yellow',
  },

  // City-Specific Tips - Chicago
  {
    id: 'chi-benchmark',
    type: 'tip',
    title: 'Chicago average: $25/hr',
    description: 'Rideshare drivers in Chicago average $25/hr. Peak earnings: Weekend nights, Cubs/Sox game days.',
    category: 'city',
    gigTypes: ['rideshare'],
    cities: ['Chicago'],
    priority: 'medium',
    icon: '📍',
    color: 'purple',
  },
  {
    id: 'chi-hotspots',
    type: 'tip',
    title: 'Best zones in Chicago',
    description: 'Wrigleyville, River North, Loop. These areas have the highest order volume and tips.',
    category: 'city',
    gigTypes: ['rideshare', 'delivery'],
    cities: ['Chicago'],
    priority: 'medium',
    icon: '🗺️',
    color: 'blue',
  },
  {
    id: 'chi-wrigley',
    type: 'tip',
    title: 'Chicago insider tip',
    description: 'Game days at Wrigley = 2-3x surge pricing',
    category: 'city',
    gigTypes: ['rideshare'],
    cities: ['Chicago'],
    priority: 'low',
    icon: '💡',
    color: 'yellow',
  },

  // City-Specific Tips - Austin
  {
    id: 'aus-benchmark',
    type: 'tip',
    title: 'Austin average: $22/hr',
    description: 'Rideshare drivers in Austin average $22/hr. Peak earnings: Thursday-Saturday nights, SXSW/ACL.',
    category: 'city',
    gigTypes: ['rideshare'],
    cities: ['Austin'],
    priority: 'medium',
    icon: '📍',
    color: 'purple',
  },
  {
    id: 'aus-hotspots',
    type: 'tip',
    title: 'Best zones in Austin',
    description: '6th Street, Rainey Street, Domain. These areas have the highest order volume and tips.',
    category: 'city',
    gigTypes: ['rideshare', 'delivery'],
    cities: ['Austin'],
    priority: 'medium',
    icon: '🗺️',
    color: 'blue',
  },
  {
    id: 'aus-sxsw',
    type: 'tip',
    title: 'Austin insider tip',
    description: 'SXSW/ACL weeks = 3-5x normal earnings',
    category: 'city',
    gigTypes: ['rideshare', 'delivery'],
    cities: ['Austin'],
    priority: 'low',
    icon: '💡',
    color: 'yellow',
  },

  // Guides - Rideshare
  {
    id: 'guide-uber-surge-nyc',
    type: 'guide',
    title: 'Mastering Uber Surge in NYC',
    description: 'Learn when and where surge pricing peaks in New York City, and how to position yourself for maximum earnings.',
    category: 'guide',
    gigTypes: ['rideshare'],
    cities: ['New York'],
    priority: 'high',
    icon: '📖',
    color: 'blue',
    readTime: '4 min read',
    tags: ['surge', 'uber', 'strategy'],
    content: `# Mastering Uber Surge in NYC

Surge pricing can make or break your earnings as an NYC rideshare driver. Here's how to position yourself for maximum surge multipliers.

## Peak Surge Times

**Weekday Morning (7-9 AM)**
- Penn Station, Grand Central: 2.5-3.5x surge
- Financial District: 2.0-3.0x surge
- Position yourself near major subway stations by 6:45 AM

**Weekday Evening (5-7 PM)**
- Midtown exits: 2.0-4.0x surge
- Brooklyn Bridge entrance: 2.5-3.5x surge
- Start positioning by 4:30 PM before the rush

**Friday/Saturday Night (10 PM-2 AM)**
- Meatpacking District: 3.0-5.0x surge
- LES/East Village: 2.5-4.0x surge
- Times Square (after shows): 2.0-3.5x surge

**Sunday Morning (6-9 AM)**
- Airport runs from Manhattan: 1.8-2.5x surge
- JFK/LGA always have consistent surge

## Strategic Positioning

**The 3-Block Rule**: Park 3 blocks away from the surge zone center. When riders request, you'll already be positioned while other drivers are still driving in.

**Airport Strategy**: LGA typically has shorter queues than JFK. Check the driver app queue times. If JFK shows 45+ min wait, head to LGA instead.

**Event Calendar**: Madison Square Garden, Barclays Center, Yankee Stadium - check event schedules. Position yourself 30 minutes before events end.

## Surge Multiplier Sweet Spots

Don't chase 5.0x surges - they disappear quickly. Instead:
- Accept 2.0-2.5x surges immediately
- These convert to rides faster
- You'll complete more trips per hour

**The Math**: 3 rides at 2.5x ($75 total) beats waiting 30 minutes for one 4.0x ride ($40).

## Weather = Surge

Rain, snow, extreme heat all trigger surge:
- Light rain: 1.5-2.0x surge across all zones
- Heavy rain: 2.5-4.0x surge citywide
- Snow: 3.0-5.0x surge (if you can drive safely)

Monitor weather apps and position yourself 15 minutes before precipitation starts.

## Tools You Need

- **Uber Driver App**: Obviously
- **Google Maps**: Check real-time traffic
- **Weather App**: Predict surge 30 min early
- **NYC Events Calendar**: Know when concerts/games end

Master these patterns and you'll consistently earn $40-50/hour instead of $25-30/hour.`,
  },
  {
    id: 'guide-multi-app',
    type: 'guide',
    title: 'Multi-App Strategy for Drivers',
    description: 'How to run Uber, Lyft, and DoorDash simultaneously without getting deactivated. Proven system from $100K/year drivers.',
    category: 'guide',
    gigTypes: ['rideshare', 'delivery'],
    cities: ['all'],
    priority: 'high',
    icon: '📖',
    color: 'green',
    readTime: '5 min read',
    tags: ['strategy', 'multi-app', 'income'],
    content: `# Multi-App Strategy for Drivers

Running multiple apps simultaneously is how top drivers earn $100K+/year. Here's the proven system that won't get you deactivated.

## The Core Principle: Never Accept Blind

**Wrong Way**: Turn on Uber, Lyft, and DoorDash all at once and accept whatever comes first.

**Right Way**: Keep all apps open, but be strategic about what you accept:
- Only accept rides with pickup under 5 minutes away
- Decline orders under $7 ($1.50/mile minimum)
- Always check the estimated time before accepting

## The 3-App Rotation System

### Phase 1: Rideshare Priority (Rush Hours)
**7-9 AM & 5-7 PM**

1. **Uber/Lyft PRIMARY** (both on)
   - Accept first ride that appears
   - Immediately turn OFF the app you didn't accept from
   - Keep DoorDash on but set to "paused"

2. **During the ride**:
   - Check DoorDash for orders along your route
   - Only accept if: (a) pickup is on the way, (b) dropoff adds <5 min detour
   - This adds $8-12 extra per rideshare trip

3. **After dropoff**:
   - Turn both Uber and Lyft back on
   - Complete the DoorDash order if you accepted one
   - Repeat

**Why this works**: Rideshare pays better during rush hour ($25-40/hour). DoorDash fills the gaps.

### Phase 2: Delivery Priority (Off-Peak)
**10 AM-4 PM & 8 PM-10 PM**

1. **DoorDash/UberEats PRIMARY**
   - Accept stacked orders (2-3 orders, same restaurant)
   - $20-25 for 30-45 minutes of work

2. **Keep Uber/Lyft on**:
   - Only accept rides if: (a) 3.0+ miles, (b) headed toward restaurants
   - Ignore short rides (they kill your delivery momentum)

3. **The Stack Technique**:
   - Accept DoorDash order → immediately check UberEats
   - If UberEats shows order from same area, accept it
   - Complete both deliveries (usually 10-15 min apart)
   - Earn $15-20 in 30 minutes

### Phase 3: Late Night Strategy (10 PM-2 AM)
**Friday & Saturday only**

1. **Rideshare ONLY** (highest surge)
   - Turn off all delivery apps
   - Focus 100% on Uber/Lyft
   - Accept rides 2.0x surge or higher

2. **Why no delivery?**:
   - Most restaurants closed
   - Rideshare pays 2-3x more with surge
   - Bar/club pickups = better tips

## The Rules That Keep You Safe

### Never Do These (Guaranteed Deactivation):
❌ Accept ride while passenger is in your car
❌ Cancel rides/orders after accepting (>5% cancellation = warning)
❌ Keep rider waiting while doing delivery
❌ Accept 2 rideshare trips simultaneously (from Uber AND Lyft)

### Always Do These:
✅ Mark "arrived" immediately when you reach pickup
✅ Communicate if you're running late (>2 min)
✅ Complete current ride/delivery before accepting next
✅ Use "Stop New Requests" when you need to focus

## The Math: Single App vs Multi-App

**Single App (Uber only)**:
- 3 rides/hour × $12 average = $36/hour
- 25% downtime between rides
- **$27/hour after downtime**

**Multi-App (Uber + DoorDash)**:
- 2 rides/hour × $15 average = $30
- 2 deliveries/hour × $8 average = $16
- 10% downtime (always have next order ready)
- **$41/hour after downtime**

**That's $14/hour more = $560/week = $29,000/year difference.**

## App-Specific Tips

**Uber**: Best for long trips (3+ miles). Accept rides to airports.

**Lyft**: Better passenger tips on average. Use during Uber downtime.

**DoorDash**: Highest delivery volume. Accept orders $7+, decline everything under.

**UberEats**: Great for stacked orders. Restaurants are more reliable.

**Instacart**: Save for slow days. $20-30/hour but takes 45-60 min per order.

## Your Daily Schedule

**6:30 AM**: Wake up, turn on Uber + Lyft
**7-9 AM**: Rideshare only (rush hour surge)
**9-11 AM**: Switch to DoorDash + UberEats (breakfast/lunch prep)
**11 AM-1 PM**: Delivery priority (lunch rush)
**1-4 PM**: Mix both (accept best offers)
**4-6 PM**: Rideshare only (evening rush)
**6-8 PM**: Dinner delivery (highest tips)
**8-10 PM**: Flexibility (take best offers)

Follow this system and you'll earn 40-60% more than single-app drivers.`,
  },

  // Guides - Delivery
  {
    id: 'guide-doordash-zones-sf',
    type: 'guide',
    title: 'Best DoorDash Zones in San Francisco',
    description: 'Mission, Marina, and SOMA ranked by order volume, tips, and parking availability.',
    category: 'guide',
    gigTypes: ['delivery'],
    cities: ['San Francisco'],
    priority: 'high',
    icon: '📖',
    color: 'orange',
    readTime: '3 min read',
    tags: ['doordash', 'zones', 'tips'],
    content: `# Best DoorDash Zones in San Francisco

Not all SF neighborhoods are created equal for delivery. Here's the data on which zones pay best.

## Top 3 Zones (Ranked)

### 1. Mission District 🏆
**Average: $25-32/hour**

**Why it's #1**:
- Highest order volume in SF (400+ restaurants)
- Mix of cheap eats + upscale = constant orders
- Tight geography = short drives between deliveries

**Best streets to wait**: 16th & Valencia, 24th & Mission

**Parking**: Residential streets off Valencia (Bryant, York, Alabama)

**Peak times**:
- Lunch: 11:30 AM - 1:30 PM ($22-28/hour)
- Dinner: 6:00 PM - 9:00 PM ($28-35/hour)

**Pro tip**: Accept orders headed toward Castro/Noe Valley (wealthier = better tips), decline orders to Bayview/Excelsior (long drives, low tips).

### 2. Marina District 🥈
**Average: $24-30/hour**

**Why it ranks #2**:
- Wealthy residents = 20-25% average tips
- Lower order volume than Mission, but higher value
- Easy parking during day

**Best streets to wait**: Chestnut St (between Fillmore and Divisadero)

**Parking**: Residential streets perpendicular to Chestnut

**Peak times**:
- Weekday dinner: 7:00 PM - 9:30 PM (when young professionals order)
- Weekend brunch: 10:00 AM - 1:00 PM (best tips of the week)

**Pro tip**: Avoid Friday/Saturday night (impossible parking, drunk pedestrians). Stick to Sunday-Thursday.

### 3. SOMA (South of Market) 🥉
**Average: $22-28/hour**

**Why it ranks #3**:
- High lunch volume (office workers)
- Lower tips than Marina but consistent orders
- Easy parking at meters (2-hour limits)

**Best streets to wait**: 2nd St (between Market and Brannan), Howard St

**Parking**: Metered spots on 2nd, 3rd, 4th streets (pay attention to time limits!)

**Peak times**:
- Lunch only: 11:45 AM - 1:15 PM (office rush)
- After 6 PM volume drops (most workers go home)

**Pro tip**: SOMA is a lunch-only zone. After 2 PM, drive to Mission or Marina.

## Zones to Avoid

**Financial District**: Dead after 6 PM, nightmare parking, too many pedestrians.

**Sunset/Richmond**: Low order volume, long drives between restaurants, parking is the only good thing.

**Tenderloin**: High order volume but lowest tips in SF, safety concerns at night.

## The SF Parking Game

- **Red zones are loading zones 9 AM-6 PM**: You can stop for "active loading" (picking up food). Don't park.
- **Yellow zones are commercial loading**: Same deal. 5-minute limit.
- **White zones are passenger loading**: Technically allowed for pickups, but traffic enforcement is aggressive.
- **Best strategy**: Find residential streets 1 block off main drags. Free parking, short walk to restaurants.

## Weather Impact

SF is micro-climates. Fog/cold/rain hits some zones harder:
- **Marina/Richmond**: Foggiest → order volume drops
- **Mission/SOMA**: Usually warmer → orders stay consistent
- **Rainy days**: 30-40% increase in orders citywide, but tips don't increase much in SF (unlike other cities)

Stick to Mission and Marina, avoid Financial District and Outer Sunset, and you'll earn 50% more than drivers who don't zone-optimize.`,
  },
  {
    id: 'guide-delivery-tax-deductions',
    type: 'guide',
    title: 'Tax Deductions for Delivery Drivers',
    description: 'Complete guide to mileage tracking, hot bags, phone bills, and other deductible expenses.',
    category: 'guide',
    gigTypes: ['delivery'],
    cities: ['all'],
    priority: 'medium',
    icon: '📖',
    color: 'purple',
    readTime: '6 min read',
    tags: ['tax', 'deductions', 'mileage'],
    content: `# Tax Deductions for Delivery Drivers

Delivery drivers can deduct thousands in expenses. Here's exactly what you can write off and how to track it properly.

## The Big One: Mileage Deduction

**2024 Standard Mileage Rate: $0.67/mile**

This covers gas, maintenance, insurance, depreciation - everything. It's the single biggest deduction for delivery drivers.

### How to Track Mileage

**Option 1: Apps (Recommended)**
- **Stride**: Free, auto-tracks when you're driving, IRS-compliant reports
- **Everlance**: $8/month, more detailed analytics
- **MileIQ**: $6/month, works automatically in background

**Option 2: Manual Log**
If apps fail, keep a manual log:
- Date
- Starting odometer reading
- Ending odometer reading
- Total miles driven for work
- Purpose (delivery work)

**What Miles Count**:
✅ Miles from accepting order to delivery completion
✅ Miles between deliveries while logged into apps
✅ Miles driving to hotspots/busy zones
✅ Miles to restaurants even if you decline the order
❌ Miles from home to first order (commute)
❌ Miles from last order back home (commute)

**The Trick**: If you accept an order before leaving home, ALL miles count (no commute). If you complete an order near home, keep the app on until you get home - those miles count.

### Example Math:
- 20,000 miles driven for DoorDash in 2024
- 20,000 × $0.67 = **$13,400 deduction**
- At 25% effective tax rate = **$3,350 tax savings**

## Equipment & Supplies

### Hot Bags & Delivery Gear
**100% deductible**

- Insulated food bags ($20-50)
- Pizza bags ($30-60)
- Drink carriers ($15-30)
- Coolers for grocery delivery ($40-100)
- Phone mounts ($20-40)
- Car organizers ($25-50)

**Save all receipts.** Take photos and store in Google Drive folder named "2024 Tax Deductions."

### Phone & Service
**Deductible: 80-100% depending on usage**

If you use your phone primarily for delivery work:
- Monthly phone bill: 80% deductible (if you use it for personal too)
- New phone purchase: 100% deductible if used only for work
- Phone accessories (chargers, cases): 100% deductible

**Example**:
- $80/month phone bill × 12 months = $960
- 80% business use = **$768 deduction**

## Vehicle Expenses (If Not Using Standard Mileage)

**You can't deduct both mileage AND actual expenses. Pick one.**

Most drivers should use standard mileage (easier, usually higher deduction). But if you have a cheap, fuel-efficient car with high miles, actual expenses might be better.

### Actual Expense Method Includes:
- Gas
- Oil changes & maintenance
- Repairs
- Tires
- Car insurance
- Registration & license fees
- Car washes (yes, really)
- Lease payments or depreciation

**You must calculate business use percentage**:
- 15,000 total miles driven
- 12,000 miles for delivery
- Business use = 80%
- Deduct 80% of all vehicle costs

**Warning**: Once you choose actual expenses for a car, you can't switch to standard mileage for that car. Choose carefully in year 1.

## Other Deductible Expenses

### Parking & Tolls
**100% deductible**

- Parking meters while picking up food
- Parking garage fees
- Bridge tolls
- Parking tickets while on delivery (debatable, but some accountants allow it)

### Health Insurance Premiums
**100% deductible (if you qualify)**

If you're self-employed and not eligible for employer coverage:
- Full monthly premium amount is deductible
- Reduces both income tax AND self-employment tax
- This is huge - could be $400-600/month deduction

### Roadside Assistance & Car Washes
**100% deductible**

- AAA membership: $60-120/year
- Car washes: $15-30/month (keep receipts)

### Accounting Software & Apps
**100% deductible**

- QuickBooks Self-Employed: $15/month
- TurboTax Self-Employed: $119/year
- Stride (free but Premium is $5/month)

## How to Actually Take These Deductions

### Step 1: Track Everything (All Year)
- Use Stride or Everlance for mileage
- Save every receipt (photo + digital)
- Create folder structure: "2024 Taxes" → "Mileage," "Equipment," "Phone," etc.

### Step 2: File Schedule C (Form 1040)
This is where you report self-employment income and deductions.

**Income Section**: Total DoorDash/UberEats earnings
**Expense Section**: All your deductions

### Step 3: Use Software or Accountant
- **TurboTax/H&R Block**: Walks you through Schedule C ($119-179)
- **Accountant**: $200-500, worth it if you earned $40K+

## Common Mistakes to Avoid

❌ **Not tracking mileage**: You'll miss out on $10K+ in deductions
❌ **Mixing personal + business**: Keep separate or track percentage
❌ **No receipts**: IRS can disallow deductions without proof
❌ **Forgetting quarterly taxes**: You owe taxes 4x/year, not just April
❌ **Deducting 100% phone when you use it personally**: Be honest about usage

## The Bottom Line

**Average delivery driver working full-time**:
- Income: $45,000
- Mileage deduction: $13,400
- Other deductions: $2,600
- **Total deductions: $16,000**
- **Tax savings: $4,000-5,000**

Track everything, use the standard mileage rate, and don't leave money on the table.`,
  },

  // Guides - Freelance
  {
    id: 'guide-upwork-pricing',
    type: 'guide',
    title: 'How to Raise Your Rates on Upwork',
    description: 'Step-by-step guide to increasing your hourly rate without losing clients. Includes email templates.',
    category: 'guide',
    gigTypes: ['freelance'],
    cities: ['all'],
    priority: 'high',
    icon: '📖',
    color: 'green',
    readTime: '5 min read',
    tags: ['upwork', 'pricing', 'negotiation'],
    content: `# How to Raise Your Rates on Upwork

Most freelancers underprice themselves for years. Here's how to increase your rates strategically without losing clients.

## When to Raise Your Rates

### Signal 1: You're Booked Solid
If you're turning down work or can't take new clients, your rates are too low. **Raise them by 25-50%.**

### Signal 2: You Have 10+ Reviews with 4.9+ Stars
Social proof is built. You're no longer "new." **Raise rates by 20-30%.**

### Signal 3: You've Gained New Skills
Learned a new framework? Specialized in a niche? You're more valuable. **Raise rates by 15-25%.**

### Signal 4: It's Been 12+ Months
Even if nothing changed, inflation means your effective rate dropped. **Minimum 10% annual increase.**

## The 3-Phase Approach

### Phase 1: Raise Rates for New Clients Only
**Don't touch existing client rates yet.**

1. Go to your Upwork profile
2. Update your hourly rate (visible to new clients)
3. Update your proposal template with new rate
4. Keep working with existing clients at old rate

**Why this works**: You test the new rate with zero risk. Existing clients don't feel surprised or abandoned.

**Example**:
- Old rate: $45/hour
- New rate for new clients: $60/hour
- Existing clients stay at $45/hour

### Phase 2: Notify Existing Clients (60 Days Notice)
After 30 days of successfully landing clients at the new rate, inform existing clients:

**Email Template:**

---

Subject: Rate Update - 60 Days Notice

Hi [Client Name],

I wanted to give you advance notice that my hourly rate will be increasing from $45 to $60/hour, effective [Date 60 days from now].

Over the past [X months/years] working together, I've:
- [Specific result you delivered - "Increased conversion rate by 40%"]
- [Another measurable win - "Reduced page load time by 2 seconds"]
- [Third accomplishment - "Built 12 new features on time"]

My new rate reflects the value I bring and aligns with current market rates for [your skill] specialists. I'm committed to continuing to deliver exceptional results.

If you'd like to discuss this or have any questions, I'm happy to chat.

Best,
[Your Name]

---

**Key elements**:
- 60 days notice (respectful and professional)
- Specific results you've delivered (justifies increase)
- Confident tone (not apologetic)
- Open to discussion (but not negotiating)

### Phase 3: Implement the Increase
60 days later:
1. Update the contract rate in Upwork
2. Send a brief reminder email: "Just a reminder that my new rate takes effect today. Looking forward to our continued work together!"

**What usually happens**:
- 80% of clients accept without pushback
- 15% negotiate (you can offer to phase it in over 3 months)
- 5% leave (they were price-shopping anyway, not worth keeping)

## Handling Pushback

### "That's too expensive"
**Response**: "I understand budget is important. Would you like to reduce the scope to fit your budget, or should we discuss a phased increase - say $5/hour every 3 months?"

### "Can you make an exception for me?"
**Response**: "I appreciate working with you, but I need to be consistent with all my clients. However, I'm happy to explore a phased approach if that helps."

### "I'll need to find someone else"
**Response**: "I completely understand. I'm happy to help with the transition and recommend someone in your budget range."

**Reality check**: If they leave over a $10-15/hour increase after months/years of great work, they don't value you. Let them go.

## Advanced: Value-Based Pricing

Once you're at $60-75/hour, consider moving from hourly to project-based pricing.

### Example: Website Redesign

**Hourly approach**:
- 40 hours estimated
- $60/hour
- Total: $2,400

**Value-based approach**:
- Client's business does $500K/year revenue
- A 10% conversion improvement = $50K more revenue
- Charge: $5,000 (10% of value created)
- Your actual time: 30 hours
- **Effective rate: $166/hour**

**How to pitch it**:
"Instead of billing hourly, I recommend a fixed project fee of $5,000. Based on similar clients, this redesign typically increases conversions by 10-15%, which would add $50-75K to your annual revenue. The ROI is clear."

## Rate Benchmarks by Skill (2024)

**Beginner (0-2 years, <50 reviews)**:
- Writing: $30-50/hour
- Design: $35-60/hour
- Web Development: $40-70/hour

**Intermediate (2-5 years, 50+ reviews)**:
- Writing: $50-85/hour
- Design: $60-100/hour
- Web Development: $70-120/hour

**Expert (5+ years, 100+ reviews, Top Rated)**:
- Writing: $85-150/hour
- Design: $100-200/hour
- Web Development: $120-250/hour

If you're below these ranges, you're leaving money on the table.

## The Confidence Mindset

**Most freelancers think**: "What if I lose this client?"

**Reality**: If you're good, clients need you more than you need them. There are always more clients. There's only one you.

**The math**:
- Lose 20% of clients after raising rates 30%
- **Net gain: +4% revenue** (1.3 × 0.8 = 1.04)
- Plus: You work less and have time for better clients

## Action Plan (This Week)

1. **Monday**: Update your Upwork profile rate (+20-30%)
2. **Tuesday**: Update proposal template with new rate
3. **Wednesday**: Send 3 proposals at new rate
4. **In 30 days**: If you land 2+ clients at new rate, send "60-day notice" email to existing clients
5. **In 90 days**: New rate is your only rate

Raise your rates. You're worth it.`,
  },
  {
    id: 'guide-freelance-taxes',
    type: 'guide',
    title: 'Quarterly Tax Guide for Freelancers',
    description: 'When to pay, how much to set aside, and which forms to file. Avoid IRS penalties.',
    category: 'guide',
    gigTypes: ['freelance'],
    cities: ['all'],
    priority: 'medium',
    icon: '📖',
    color: 'orange',
    readTime: '7 min read',
    tags: ['tax', 'quarterly', 'freelance'],
    content: `# Quarterly Tax Guide for Freelancers

Freelancers pay taxes 4 times per year, not once in April. Here's exactly when, how much, and how to avoid penalties.

## Why Quarterly Taxes Exist

When you're an employee, your employer withholds taxes from every paycheck. As a freelancer, **you** are responsible for paying estimated taxes throughout the year.

**If you owe $1,000+ in taxes, you must pay quarterly.** Otherwise, the IRS charges penalties (typically 0.5% per month on unpaid taxes).

## The 4 Quarterly Deadlines

| Quarter | Income Period | Due Date |
|---------|---------------|----------|
| **Q1** | Jan 1 - Mar 31 | **April 15** |
| **Q2** | Apr 1 - May 31 | **June 15** |
| **Q3** | Jun 1 - Aug 31 | **September 15** |
| **Q4** | Sep 1 - Dec 31 | **January 15** (next year) |

**Note**: Q2 is only 2 months, Q3 is 3 months. Weird IRS logic.

**If deadline falls on a weekend/holiday**, payment is due the next business day.

## How Much to Pay

### The Simple Method: 30% Rule

Set aside **30% of your net income** (income minus expenses) each quarter.

**Example**:
- Q1 income: $15,000
- Q1 expenses: $3,000
- Net income: $12,000
- **Estimated quarterly tax: $3,600** (30%)

This covers:
- Federal income tax (~15-20%)
- Self-employment tax (15.3% on 92.35% of net income)
- State tax (~5-10%, varies by state)

### The Precise Method: IRS Worksheet

Use **Form 1040-ES** (available on IRS.gov) to calculate exact estimated tax.

**Steps**:
1. Estimate your total annual income
2. Subtract estimated deductions (standard deduction is $14,600 for 2024)
3. Calculate self-employment tax (15.3% on 92.35% of net profit)
4. Calculate federal income tax using tax brackets
5. Add state tax
6. Divide by 4 for quarterly payment

**Example calculation** (single filer, $80K annual income):
- Gross income: $80,000
- Business expenses: $15,000
- **Net profit: $65,000**
- Self-employment tax: $9,176 (15.3% × 92.35% × $65,000)
- Deductible SE tax: $4,588 (50% of SE tax)
- AGI: $60,412 ($65,000 - $4,588)
- Taxable income: $45,812 ($60,412 - $14,600 standard deduction)
- Federal income tax: $5,237
- State tax (CA ~5%): $2,270
- **Total annual tax: $16,683**
- **Quarterly payment: $4,171**

## How to Pay Quarterly Taxes

### Option 1: IRS Direct Pay (Free, Recommended)
1. Go to **irs.gov/payments**
2. Select "Direct Pay"
3. Choose "Estimated Tax" → "Form 1040-ES"
4. Enter payment amount and bank info
5. Get instant confirmation

### Option 2: EFTPS (Electronic Federal Tax Payment System)
1. Enroll at **eftps.gov** (takes 5-7 days for PIN to arrive)
2. Schedule payments in advance
3. Can set up recurring payments

### Option 3: Mail a Check
1. Print **Form 1040-ES payment voucher**
2. Make check payable to "United States Treasury"
3. Write SSN and "2024 Form 1040-ES" on check
4. Mail to IRS address for your state (listed on Form 1040-ES)

**State taxes**: Most states have their own quarterly tax system. Google "[your state] estimated tax payment" to find the process.

## Safe Harbor Rules (Avoid Penalties)

You **won't be penalized** if you meet any of these:

### Rule 1: Pay 90% of Current Year Tax
If you pay at least 90% of your actual 2024 tax liability by Jan 15, 2025, no penalty.

### Rule 2: Pay 100% of Prior Year Tax
If you pay at least 100% of your 2023 tax liability (from your 2023 return), no penalty - even if you earn way more in 2024.

**Exception**: If your 2023 AGI was over $150K, you must pay 110% of prior year tax.

### Rule 3: Owe Less Than $1,000
If your total tax owed (after withholding and credits) is under $1,000, no penalty.

**Pro tip**: If you had a great year in 2023, use Rule 2 to safely underpay in 2024 (you'll just pay the difference in April).

## What Happens If You Miss a Payment?

### Late Payment Penalty
- **0.5% per month** of unpaid taxes
- Maximum 25% total penalty

### Underpayment Penalty
- **Variable rate** (currently ~8% annual)
- Calculated from when payment was due until when you pay

**Example**:
- You owe $4,000 for Q1 (due April 15)
- You pay it in June (2 months late)
- Penalty: ~$53 (8% annual / 6 = 1.33% per 2 months)

**Not catastrophic, but avoidable.**

## How to Catch Up If You're Behind

### Scenario: You're in October, haven't paid anything all year

**Don't panic.** Here's what to do:

1. **Calculate total tax owed for the year** (use the 30% rule or Form 1040-ES)
2. **Pay 75% of that amount immediately** (to cover Q1-Q3)
3. **Pay remaining 25% by Jan 15** (Q4 deadline)
4. **File Form 2210 with your tax return** to see if you qualify for reduced penalties

**Example**:
- Estimated annual tax: $20,000
- Missed Q1, Q2, Q3 (total $15,000)
- Pay $15,000 now + $5,000 in January
- Penalty will be ~$500-800 (not fun, but survivable)

## Tax-Saving Strategies

### 1. Max Out Retirement Contributions
- SEP IRA: Up to $69,000/year (25% of net profit)
- Traditional IRA: Up to $7,000/year
- **Both reduce your taxable income**

### 2. Deduct Health Insurance Premiums
If self-employed, 100% of health insurance premiums are deductible (reduces both income tax AND self-employment tax).

### 3. Home Office Deduction
If you have a dedicated workspace:
- **Simplified method**: $5/square foot (up to 300 sq ft = $1,500 max)
- **Actual expense method**: (Office sq ft / Total home sq ft) × Total home expenses

### 4. Track Every Business Expense
- Software subscriptions
- Internet (partial deduction)
- Phone (partial deduction)
- Co-working space
- Equipment (laptop, monitor, desk, chair)

## Your Quarterly Tax Workflow

### Week 1 of Each Quarter:
1. **Calculate net profit** (income - expenses from last quarter)
2. **Multiply by 30%** (or use Form 1040-ES for precision)
3. **Pay via IRS Direct Pay** (takes 5 minutes)
4. **Pay state estimated tax** (if your state requires it)
5. **Save confirmation emails**

### Throughout the Quarter:
1. **Track income** (use QuickBooks, Wave, or a spreadsheet)
2. **Track expenses** (save receipts, log everything)
3. **Set aside 30% of profit in separate savings account** (so money is ready when due)

## Common Mistakes to Avoid

❌ **Thinking you can pay it all in April**: You'll owe penalties
❌ **Using gross income instead of net income**: You're overpaying
❌ **Forgetting state taxes**: California, New York, etc. want their cut too
❌ **Not keeping payment confirmations**: You'll need proof if IRS questions you
❌ **Guessing instead of calculating**: Use Form 1040-ES or the 30% rule

## Bottom Line

- **Pay quarterly** (April 15, June 15, Sept 15, Jan 15)
- **Set aside 30%** of net income (or use Form 1040-ES)
- **Use IRS Direct Pay** (free, instant confirmation)
- **Meet safe harbor rules** (90% current year or 100% prior year)
- **Track everything** (income, expenses, payments)

Do this and you'll never have a scary tax surprise in April.`,
  },

  // Guides - Creator
  {
    id: 'guide-youtube-monetization',
    type: 'guide',
    title: 'YouTube Monetization Breakdown',
    description: 'Ad revenue, sponsorships, memberships - how much you actually make per view and how to maximize it.',
    category: 'guide',
    gigTypes: ['creator'],
    cities: ['all'],
    priority: 'high',
    icon: '📖',
    color: 'red',
    readTime: '6 min read',
    tags: ['youtube', 'monetization', 'income'],
    content: `# YouTube Monetization Breakdown

Most creators misunderstand how YouTube pays. Here's the real math on ad revenue, sponsorships, and other income streams.

## Ad Revenue (YouTube Partner Program)

### Requirements to Get Monetized
- 1,000 subscribers
- 4,000 watch hours in past 12 months (or 10M Shorts views in 90 days)
- Follow YouTube's policies
- Have an AdSense account

### How Much YouTube Pays Per View

**The famous "CPM" (Cost Per Mille = cost per 1,000 views)**

**Reality**: CPM varies wildly by niche, audience location, and video topic.

**Average CPMs by Niche (2024)**:
- **Finance/Investing**: $15-40 CPM (highest paying)
- **Tech Reviews**: $8-20 CPM
- **Business/Entrepreneurship**: $10-25 CPM
- **Health/Fitness**: $6-15 CPM
- **Lifestyle/Vlog**: $3-8 CPM
- **Gaming**: $2-6 CPM (lowest paying)
- **Kids Content**: $1-4 CPM (post-COPPA)

**Why the range?** Advertisers pay more for audiences who buy expensive products (finance viewers > gaming viewers).

### RPM vs CPM: What You Actually Earn

**CPM** = What advertisers pay YouTube
**RPM** (Revenue Per Mille) = What **you** earn after YouTube's 45% cut

**Formula**: RPM ≈ CPM × 0.55

**Example**:
- Your video has $10 CPM
- YouTube takes 45%
- **Your RPM: $5.50 per 1,000 views**
- 100,000 views = **$550**

### The Real Math: What to Expect

**Small Creator (10K subs, 50K views/month)**:
- Average RPM: $4
- Monthly views: 50,000
- **Monthly ad revenue: $200**

**Mid Creator (100K subs, 500K views/month)**:
- Average RPM: $6
- Monthly views: 500,000
- **Monthly ad revenue: $3,000**

**Large Creator (1M subs, 5M views/month)**:
- Average RPM: $8
- Monthly views: 5,000,000
- **Monthly ad revenue: $40,000**

**Reality check**: Most creators with 100K subs earn $2K-4K/month from ads alone.

## Sponsorships (The Real Money)

Once you hit 10K-50K subs, sponsorships will pay 5-10x more than ad revenue.

### Sponsorship Rates (Industry Standard)

**Integrated sponsorships (30-60 second spot in video)**:
- **Micro creators (10K-50K subs)**: $100-500 per video
- **Mid creators (50K-250K subs)**: $500-2,500 per video
- **Large creators (250K-1M subs)**: $2,500-10,000 per video
- **Major creators (1M+ subs)**: $10,000-50,000+ per video

**Common formula**: $10-25 per 1,000 views

**Example**:
- You average 100K views per video
- Sponsor rate: $15 CPM
- **Sponsorship payment: $1,500 per video**

### Best Sponsor Niches
- **Highest paying**: SaaS tools, VPNs, investing apps, online courses
- **Medium paying**: Meal kits, subscription boxes, mobile games
- **Lower paying**: Clothing brands, consumer products

### How to Land Sponsorships

**Under 50K subs**: Reach out to brands directly
- Email format: "[Brand] x [Your Channel] Collaboration Proposal"
- Pitch: "I create content for [audience], average [X] views per video, would love to feature [product]"
- Include: Media kit (PDF with stats, demographics, past sponsors)

**Over 50K subs**: Join creator networks
- **AspireIQ, Grapevine, FameBit**: Connect you with brands
- Brands reach out to you directly

## YouTube Memberships

**Requirements**: 30K subs (or 1K for gaming channels)

**How it works**: Viewers pay $4.99/month for perks (badges, emojis, exclusive videos)

**Revenue**: You keep 70% = **$3.50/member/month**

**Realistic conversion rate**: 0.5-2% of subscribers become members

**Example**:
- 100K subs
- 1% conversion = 1,000 members
- **Monthly revenue: $3,500**

**Best for**: Channels with highly engaged communities (gaming, tutorials, niche topics)

## Super Chat & Super Stickers (Live Streams)

**How it works**: Viewers pay to highlight their message during live streams

**Revenue**: You keep 70%

**Average earnings**: $50-500 per live stream (varies widely by audience size and engagement)

**Best for**: Gaming streamers, Q&A channels, live events

## YouTube Shorts Fund → Shorts Ad Revenue

**Old model (Shorts Fund)**: YouTube paid creators from a $100M fund (unpredictable, low payouts)

**New model (Feb 2023+)**: Shorts now have ads, creators earn 45% of ad revenue

**Shorts RPM**: $0.05-0.10 per 1,000 views (10-20x lower than long-form)

**Why so low?**: Shorts are 15-60 seconds, can't fit many ads

**Example**:
- 10M Shorts views/month
- RPM: $0.08
- **Monthly revenue: $800**

**Strategy**: Use Shorts to grow audience, monetize with long-form videos.

## Affiliate Marketing

**How it works**: Promote products in video description, earn commission on sales

**Top affiliate programs for creators**:
- **Amazon Associates**: 1-10% commission (low but easy)
- **Tech products** (Best Buy, B&H Photo): 2-5%
- **Online courses** (Skillshare, Udemy): $7-15 per signup
- **Software** (Epidemic Sound, TubeBuddy): 20-30% recurring

**Realistic earnings**: $200-2,000/month for mid-sized channels (50K-200K subs)

## Merch Shelf

**Requirements**: 10K subs

**How it works**: Sell merch directly below your videos (powered by Teespring, Spreadshop, etc.)

**Revenue**: $5-15 profit per item sold

**Conversion rate**: 0.1-0.5% of viewers buy merch

**Example**:
- 100K views/month
- 0.3% conversion = 300 sales
- $10 profit/item
- **Monthly revenue: $3,000**

**Best for**: Channels with strong brand/catchphrases (gaming, comedy, lifestyle)

## The Full Revenue Breakdown (Mid-Sized Creator)

**Channel stats**: 100K subs, 500K views/month

**Income sources**:
- Ad revenue: $3,000 (RPM $6)
- Sponsorships: $6,000 (4 videos × $1,500 each)
- Memberships: $2,500 (700 members × $3.50)
- Affiliate links: $800
- Merch: $1,200
- **Total monthly income: $13,500**

**Key insight**: Ads are only 22% of total revenue. Sponsorships are the biggest driver.

## How to Maximize Earnings

### 1. Optimize for High CPM Topics
Create content in finance, tech, or business niches (vs gaming/vlogging)

### 2. Target US/UK/Canada Audience
CPMs are 2-5x higher than international audiences

### 3. Make 8-15 Minute Videos
Allows mid-roll ads (2-3 ad breaks per video = 2-3x revenue)

### 4. Focus on Sponsorships Over Ads
Once you hit 20K subs, prioritize sponsor deals (5-10x more per video)

### 5. Build a Loyal Community
1% of highly engaged viewers worth more than 10% of passive viewers

## Bottom Line

**Under 10K subs**: Focus on growth, not money (you'll make <$200/month)
**10K-50K subs**: Start landing small sponsorships ($200-1,000 per video)
**50K-250K subs**: Sponsorships become primary income ($2K-10K/month total)
**250K+ subs**: Diversify with memberships, merch, courses ($10K-50K+/month)

Ad revenue is the baseline. The real money comes from sponsorships and community monetization.`,
  },
  {
    id: 'guide-content-creator-expenses',
    type: 'guide',
    title: 'Tax Write-offs for Content Creators',
    description: 'Camera gear, editing software, home studio - what you can deduct and how to document it.',
    category: 'guide',
    gigTypes: ['creator'],
    cities: ['all'],
    priority: 'medium',
    icon: '📖',
    color: 'purple',
    readTime: '5 min read',
    tags: ['tax', 'deductions', 'equipment'],
    content: `# Tax Write-offs for Content Creators

Content creators can deduct thousands in equipment and software. Here's what qualifies and how to document it properly.

## Equipment Deductions

### Camera Gear
**100% deductible if used exclusively for content creation**

**What qualifies**:
- Cameras (DSLR, mirrorless, action cams)
- Lenses
- Memory cards (SD, CF)
- Camera bags
- Tripods, monopods
- Gimbals/stabilizers
- Batteries and chargers

**Example**:
- Sony A7 IV: $2,500
- 24-70mm lens: $900
- 3 batteries + charger: $200
- Gimbal: $400
- **Total deduction: $4,000**

**How to deduct**:
- Under $2,500 per item: Deduct 100% immediately (Section 179)
- Over $2,500: Depreciate over 5 years (or deduct immediately with Section 179 election)

**Pro tip**: Buy in December to deduct from that year's taxes, even if you only used it for 1 month.

### Audio Equipment
**100% deductible**

- Microphones (shotgun, lavalier, USB mics)
- Audio interfaces
- Headphones (monitoring)
- Boom poles
- Windscreens/dead cats
- XLR cables

**Example setup**:
- Rode VideoMic Pro: $230
- Blue Yeti USB mic: $100
- Sony MDR-7506 headphones: $100
- **Total deduction: $430**

### Lighting
**100% deductible**

- Ring lights
- Softboxes
- LED panels
- Light stands
- Reflectors
- Backdrops

**Example**:
- 2x Neewer LED panels: $200
- Ring light: $80
- Green screen backdrop: $50
- **Total deduction: $330**

### Computer & Tech
**100% deductible if used primarily (>50%) for content creation**

- Laptop/desktop
- Monitors (2nd screen counts)
- External hard drives (backup footage)
- Graphics cards (for rendering)
- RAM upgrades
- Keyboards, mice
- Webcams (for streaming)
- Capture cards (for gaming content)

**Example**:
- MacBook Pro 16": $2,500
- 32" 4K monitor: $500
- 4TB external SSD: $400
- **Total deduction: $3,400**

**Mixed use rule**: If you use your computer 70% for content and 30% personal, deduct 70% of the cost.

### Phone & Accessories
**Deductible based on business use %**

- New iPhone/Android (if you film with it)
- Gimbal for phone (DJI Osmo Mobile)
- Phone lenses (moment lenses)
- Charging cables, battery packs

**Example**:
- iPhone 15 Pro: $1,200
- 80% business use = **$960 deduction**

## Software & Subscriptions

### Editing Software
**100% deductible**

- Adobe Creative Cloud: $60/month = **$720/year**
- Final Cut Pro: $300 (one-time)
- DaVinci Resolve Studio: $295 (one-time)
- CapCut Pro: $8/month = **$96/year**

### Stock Media & Music
**100% deductible**

- Epidemic Sound: $15/month = **$180/year**
- Artlist: $10/month = **$120/year**
- Envato Elements: $17/month = **$204/year**
- Adobe Stock: $30/month = **$360/year**

### Other Tools
**100% deductible**

- TubeBuddy/VidIQ (YouTube tools): $50-200/year
- Canva Pro (thumbnails): $120/year
- Notion/Trello (content planning): $50-100/year
- Grammarly (scripts): $140/year

**Total annual software deductions**: $1,500-3,000 typical

## Home Studio Deduction

### Option 1: Simplified Method
**$5 per square foot, up to 300 sq ft**

- 10x10 ft filming room = 100 sq ft
- 100 × $5 = **$500 deduction/year**

### Option 2: Actual Expense Method
**(Studio sq ft / Total home sq ft) × Home expenses**

**Example**:
- Studio: 150 sq ft
- Total home: 1,500 sq ft
- Business use: 10%
- Annual home expenses: $24,000 (rent/mortgage, utilities, insurance, internet)
- **Deduction: $2,400/year**

**What counts as home expenses**:
- Rent or mortgage interest
- Property taxes
- Utilities (electric, gas, water)
- Internet
- Renters/home insurance
- Repairs to studio space

**Requirement**: Space must be used **regularly and exclusively** for content creation. Can't be your bedroom or living room couch.

## Internet & Phone

### Internet
**Deduct % used for content creation**

- If you upload videos, stream, research = 80% business use
- $80/month × 80% = **$64/month = $768/year deduction**

### Phone Bill
**Deduct % used for content**

- $100/month × 70% business use = **$70/month = $840/year**

## Props, Sets & Supplies

**100% deductible**

- Filming props (depends on niche)
- Set decorations
- Costumes (if for character/persona)
- Consumables (makeup, food for cooking channels)
- Cleaning supplies for set

**Example (cooking channel)**:
- Ingredients for recipe videos: $300/month = **$3,600/year**
- Kitchen props/utensils: $500/year
- **Total: $4,100**

## Marketing & Promotion

**100% deductible**

- YouTube/Instagram/TikTok ads
- Thumbnail designers (Fiverr, Upwork)
- Video editors (if you outsource)
- Website hosting
- Domain names
- Email marketing tools

## Travel & Filming Locations

**Deductible if primary purpose is content creation**

### What counts:
- Mileage to filming locations ($0.67/mile for 2024)
- Airfare/hotels for content trips
- Rental cars
- Parking/tolls
- Meals (50% deductible)

**Example**:
- Travel to film "Best Tacos in Austin" video
- Airfare: $300
- Hotel: $200
- Meals: $100 (deduct $50)
- Uber: $50
- **Total deduction: $600**

**Documentation required**: Log what content you created, where you went, dates.

## How to Document Everything

### Save receipts electronically
- Take photo immediately after purchase
- Use app: Expensify, QuickBooks, or Google Drive folder

### Create expense categories
- Equipment
- Software/subscriptions
- Home office
- Travel
- Props/supplies

### Track mixed-use items
- Log personal vs business use %
- Be honest (IRS can audit)

## What You CAN'T Deduct

❌ Gym membership (even if you film fitness content - IRS says no)
❌ Personal clothing (unless it's a costume/character outfit)
❌ Meals with friends (unless it's a business meeting with agenda)
❌ 100% of vehicle if you use it personally too
❌ Gear you bought before starting content creation business

## Tax Forms You'll Need

### Schedule C (Form 1040)
Where you report:
- Income (AdSense, sponsorships, etc.)
- Expenses (all deductions)
- Net profit (income - expenses)

### Form 8829 (if using actual home office method)
Calculates home office deduction

### Form 4562 (if depreciating equipment)
For items over $2,500

## Real Example: Mid-Level Creator Tax Return

**Income**:
- YouTube ad revenue: $30,000
- Sponsorships: $25,000
- Affiliate sales: $5,000
- **Total income: $60,000**

**Deductions**:
- Equipment (camera, lights, audio): $5,000
- Computer/tech: $3,000
- Software/subscriptions: $2,400
- Home office: $2,000
- Internet/phone: $1,500
- Props/supplies: $1,000
- Marketing/outsourcing: $2,000
- **Total deductions: $16,900**

**Net profit**: $43,100 (income - deductions)
**Taxes owed**: ~$13,000 (federal + self-employment + state)

**Tax savings from deductions**: ~$5,000 (vs if no deductions)

## Pro Tips

### 1. Separate Business & Personal
Open a business checking account. Makes tracking easier and protects you in an audit.

### 2. Keep 3 Years of Records
IRS can audit 3 years back (6 years if major issues). Save receipts + bank statements.

### 3. Quarterly Estimated Taxes
Set aside 30% of profit each quarter. Pay April 15, June 15, Sept 15, Jan 15.

### 4. Use Accounting Software
QuickBooks Self-Employed ($15/month) auto-tracks expenses and generates tax reports.

### 5. Hire a CPA for $200-400
Worth it once you're earning $40K+. They find deductions you'd miss.

## Bottom Line

**Typical creator deductions**:
- Small creator (earning $20K/year): $4K-6K deductions
- Mid creator (earning $50K/year): $10K-15K deductions
- Large creator (earning $150K/year): $30K-50K deductions

Track everything, save receipts, and take every deduction you're entitled to. It's not cheating—it's smart business.`,
  },
];

/**
 * Filter content by city and gig type
 */
export function filterContent(
  cities: City[],
  gigTypes: GigType[],
  contentType?: 'tip' | 'guide' | 'resource'
): ContentItem[] {
  let filtered = CONTENT_REGISTRY;

  // Filter by content type
  if (contentType) {
    filtered = filtered.filter(item => item.type === contentType);
  }

  // Filter by cities (show if city is 'all' or matches selected)
  if (cities.length > 0) {
    filtered = filtered.filter(item =>
      item.cities.includes('all') || item.cities.some(city => cities.includes(city))
    );
  }

  // Filter by gig types (show if gigType is 'all' or matches selected)
  if (gigTypes.length > 0) {
    filtered = filtered.filter(item =>
      item.gigTypes.includes('all') || item.gigTypes.some(type => gigTypes.includes(type))
    );
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

/**
 * Get tips only
 */
export function getTips(cities: City[], gigTypes: GigType[]): ContentItem[] {
  return filterContent(cities, gigTypes, 'tip');
}

/**
 * Get guides only
 */
export function getGuides(cities: City[], gigTypes: GigType[]): ContentItem[] {
  return filterContent(cities, gigTypes, 'guide');
}

/**
 * Get supported cities
 */
export function getSupportedCities(): City[] {
  return ['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Austin'];
}

/**
 * Get supported gig types
 */
export function getSupportedGigTypes(): GigType[] {
  return ['rideshare', 'delivery', 'freelance', 'creator', 'rental'];
}