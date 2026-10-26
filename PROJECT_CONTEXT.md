# Project Context Bundle: UtsavPilot (Prompt Wars 2026)

> Generated on 2026-10-26 19:03:55
> This document contains the project structure, configuration, types, API routes, library utilities, and React components for easy context sharing with AI models (Gemini, ChatGPT, Claude, etc.).

---

## Table of Contents

- [package.json](#packagejson)
- [tsconfig.json](#tsconfigjson)
- [next.config.ts](#nextconfigts)
- [README.md](#readmemd)
- [.env.example](#envexample)
- [src/types/event.ts](#src-types-eventts)
- [src/lib/gemini.ts](#src-lib-geminits)
- [src/lib/gemini-server.ts](#src-lib-gemini-serverts)
- [src/lib/storage.ts](#src-lib-storagets)
- [src/app/api/generate-plan/route.ts](#src-app-api-generate-plan-routets)
- [src/app/api/refine-plan/route.ts](#src-app-api-refine-plan-routets)
- [src/app/layout.tsx](#src-app-layouttsx)
- [src/app/page.tsx](#src-app-pagetsx)
- [src/app/globals.css](#src-app-globalscss)
- [src/components/Navbar.tsx](#src-components-navbartsx)
- [src/components/LandingHero.tsx](#src-components-landingherotsx)
- [src/components/EventFormWizard.tsx](#src-components-eventformwizardtsx)
- [src/components/LoadingOverlay.tsx](#src-components-loadingoverlaytsx)
- [src/components/PlanDashboard.tsx](#src-components-plandashboardtsx)
- [src/components/SavedPlansModal.tsx](#src-components-savedplansmodaltsx)
- [test_qa_suite.js](#test_qa_suitejs)

---

## package.json

``json
{
  "name": "utsavpilot-promptwars-2026",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build --webpack",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@google/genai": "^2.30.0",
    "lucide-react": "^1.60.0",
    "next": "16.4.2",
    "react": "19.3.0",
    "react-dom": "19.3.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.3.3",
    "@tailwindcss/turbopack": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.4.2",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}

``

---

## tsconfig.json

``json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}

``

---

## next.config.ts

``typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@google/genai'],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

``

---

## README.md

``markdown
# UTSAVPILOT

> **"Plan the celebration. Weâ€™ll handle the complexity."**

UtsavPilot is a GenAI-powered planning assistant built for the **Virtual PromptWars 2026** competition by **Hack2Skill**. It transforms celebration requirements (weddings, birthdays, community festivals, and social gatherings) into personalized, budget-aware event plans in seconds.

---

## ðŸŒŸ Key Features

1. **Intelligent Event Creation Wizard**:
   - Captures Event Type, Celebration Date, City/Location, Guest Count, Budget in INR (â‚¹), Style/Vibe, and Food Preferences.
   - Built-in real-time cost-per-guest metrics and feasibility checks.
   - 1-click competition presets (`50k Birthday`, `2 Lakh Wedding`, `80k Community`, `10k Edge Case`).

2. **Server-Side Gemini Generation**:
   - Multi-step loading state communicating real-time AI progression (*Understanding event...* âž” *Building budget...* âž” *Creating timeline...* âž” *Preparing vendor checklist...*).
   - Generates structured JSON matching celebration parameters and market standards.

3. **Complete Celebration Dashboard**:
   - **Overview**: Concept description, tailored fit explanation, and contingency risks.
   - **Budget**: Total Budget, Estimated Spending, Buffer Reserve, visual segmented allocation bar, line-item rationale, and actionable saving suggestions.
   - **Timeline**: Milestone preparation schedules mapped to reverse-engineered calendar dates with interactive checkable tasks.
   - **Vendors**: Checklist covering Venue, Catering, Decor, Photography, Entertainment, and Cake with interactive status toggles (`Not Started` âž” `In Contact` âž” `Booked`) and live booked counters.
   - **Ideas**: Curated aesthetic themes, decor palettes, culinary highlights, and guest activities.

4. **Dynamic AI Refinement ("Ask Utsav AI")**:
   - Live Gemini refinement area allowing users to adjust budgets (e.g., *"Actually, my budget is only â‚¹40,000. Adjust the plan."*), switch culinary menus, or modify entertainment.
   - Recalculates the entire structured plan and displays a prominent **"AI Refinement Applied"** banner explaining the exact changes made.

5. **Edge-Case Feasibility Handling**:
   - Detects mathematically unrealistic constraints (e.g. â‚¹10,000 for 200 guests).
   - Displays clear caution alerts with 5 practical strategic alternatives.

6. **Browser LocalStorage & Print Ready**:
   - Automatically saves generated plans locally with full page-reload persistence.
   - Clean `@media print` styling for clean, physical judging handouts.

---

## ðŸ› ï¸ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Version 16)
- **UI & Components**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Intelligence**: [Google Gen AI SDK](https://www.npmjs.com/package/@google/genai) (`@google/genai` v2.30.0)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Persistence**: Browser `localStorage` (No external database required)

---

## ðŸ”‘ Environment Variables

To run with live Gemini AI generation, create a `.env.local` file in the project root:

```bash
# .env.local
GEMINI_API_KEY=your_gemini_api_key_here
```

### ðŸ”’ Security Guarantee:
- `GEMINI_API_KEY` is accessed **strictly on the server-side** in API routes (`src/app/api/generate-plan/route.ts` and `src/app/api/refine-plan/route.ts`).
- It is **never** exposed to client-side code and has **no** `NEXT_PUBLIC` prefix.
- `.env*` files are included in `.gitignore`.

---

## ðŸš€ Local Setup & Running Locally

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local` and add your Google Gemini API key:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ðŸ—ï¸ Production Build & Local Production Run

To build and run the production bundle locally:

```bash
# 1. Build optimized production bundle
npm run build

# 2. Start production server
npm run start
```

---

## â˜ï¸ Vercel Deployment Instructions

Deploying UtsavPilot to Vercel is seamless:

1. **Push your repository** to GitHub, GitLab, or Bitbucket.
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New" âž” "Project"**.
3. **Import** your `utsavpilot-promptwars-2026` repository.
4. **Configure Environment Variables**:
   Under **Environment Variables**, add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: *Your Gemini API Key from Google AI Studio*
   - Check all environments (**Production**, **Preview**, **Development**).
5. Click **"Deploy"**.

Vercel will run `npm run build` and deploy the application with zero additional configuration needed.

---

## ðŸ¤– Gemini API Setup Guide

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account and click **"Create API Key"**.
3. Copy the key and paste it as `GEMINI_API_KEY` in:
   - `.env.local` (for local development)
   - Vercel Project Settings âž” Environment Variables (for production deployment).

``

---

## .env.example

``text
# UtsavPilot - Gemini API Key (Server-Side Only)
# Get your API key from https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

``

---

## src/types/event.ts

``typescript
export type EventType = 'Birthday' | 'Wedding' | 'Community Event' | 'Other';

export type EventVibe =
  | 'Elegant'
  | 'Fun'
  | 'Traditional'
  | 'Modern'
  | 'Colorful'
  | 'Minimal'
  | 'Custom';

export type FoodPreference = 'Vegetarian' | 'Non-vegetarian' | 'Vegan' | 'Mixed';

export type VendorPriority = 'High' | 'Medium' | 'Low';
export type VendorStatus = 'Not Started' | 'In Contact' | 'Booked';

export interface EventFormData {
  eventType: EventType;
  customEventType?: string;
  eventDate: string; // YYYY-MM-DD
  location: string;
  guests: number;
  budget: number; // in INR
  vibe: EventVibe;
  customVibe?: string;
  foodPreference: FoodPreference;
  notes?: string;
}

export interface BudgetCategory {
  name: string;
  estimatedAmount: number;
  reason: string;
}

export interface BudgetPlan {
  totalBudget: number;
  estimatedTotal: number;
  remaining: number;
  categories: BudgetCategory[];
  savingSuggestions: string[];
}

export interface TimelineMilestone {
  timeframe: string;
  date?: string;
  tasks: string[];
}

export interface VendorItem {
  category: string;
  priority: VendorPriority;
  whatToLookFor: string;
  status: VendorStatus;
}

export interface EventIdeas {
  theme: string;
  decor: string[];
  food: string[];
  entertainment: string[];
  activities: string[];
}

export interface BudgetFeasibility {
  isUnrealistic: boolean;
  warningMessage: string;
  suggestions: string[];
}

export interface EventPlan {
  id: string;
  createdAt: string;
  formData: EventFormData;
  eventSummary: {
    title: string;
    concept: string;
    description: string;
  };
  budget: BudgetPlan;
  timeline: TimelineMilestone[];
  vendors: VendorItem[];
  ideas: EventIdeas;
  risks: string[];
  budgetFeasibility?: BudgetFeasibility;
  refinementNotes?: string;
}

``

---

## src/lib/gemini.ts

``typescript
import { EventFormData, EventPlan, BudgetFeasibility } from '@/types/event';

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash'];

/**
 * Clean and parse JSON that might be wrapped in markdown codeblocks
 */
export function cleanAndParseJSON(rawText: string): any {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/i, '');
  }
  return JSON.parse(cleaned.trim());
}

/**
 * Check if the user event requirements are budget-constrained or unrealistic
 */
export function evaluateBudgetFeasibility(formData: EventFormData): BudgetFeasibility {
  const perGuestBudget = formData.guests > 0 ? formData.budget / formData.guests : 0;
  
  // Unrealistic thresholds for Indian celebrations
  let isUnrealistic = false;
  let minRealisticPerGuest = 500;

  if (formData.eventType === 'Wedding') {
    minRealisticPerGuest = 1200;
  } else if (formData.eventType === 'Birthday') {
    minRealisticPerGuest = 400;
  } else if (formData.eventType === 'Community Event') {
    minRealisticPerGuest = 250;
  }

  if (perGuestBudget < minRealisticPerGuest || (formData.budget < 15000 && formData.guests > 50)) {
    isUnrealistic = true;
  }

  const suggestions: string[] = [
    `Reduce guest count (e.g., from ${formData.guests} to around ${Math.max(15, Math.floor(formData.guests * 0.6))} guests) to preserve celebration quality.`,
    `Simplify catering with live counter snack combos or authentic thali rather than an expansive 5-course buffet.`,
    `Opt for a community hall, society clubhouse, temple hall, or public garden instead of luxury commercial banquets.`,
    `Embrace minimal or eco-friendly decor using local marigold florals, fairy lights, and fabric drapes.`,
    `Consider increasing your budget from â‚¹${formData.budget.toLocaleString('en-IN')} to around â‚¹${Math.max(formData.budget * 1.5, formData.guests * minRealisticPerGuest).toLocaleString('en-IN')} for full vendor coverage.`
  ];

  return {
    isUnrealistic,
    warningMessage: isUnrealistic 
      ? `Your current requirements (â‚¹${formData.budget.toLocaleString('en-IN')} for ${formData.guests} guests, ~â‚¹${Math.round(perGuestBudget)}/guest) may exceed the available budget in ${formData.location || 'your area'}.`
      : '',
    suggestions: isUnrealistic ? suggestions : []
  };
}

/**
 * Build the system prompt for event plan generation
 */
export function buildGenerationPrompt(formData: EventFormData, feasibility: BudgetFeasibility): string {
  return `You are UtsavPilot, an expert AI event planner for celebrations in India (weddings, birthdays, community festivals, anniversaries, corporate celebrations).
Analyze the following event parameters and produce a detailed, culturally attuned, budget-conscious event plan in strict JSON format.

Event Requirements:
- Event Type: ${formData.eventType} ${formData.customEventType ? `(${formData.customEventType})` : ''}
- Event Date: ${formData.eventDate}
- Location / City: ${formData.location}
- Number of Guests: ${formData.guests}
- Total Budget: â‚¹${formData.budget} INR
- Style / Vibe: ${formData.vibe} ${formData.customVibe ? `(${formData.customVibe})` : ''}
- Food Preference: ${formData.foodPreference}
- Notes: ${formData.notes || 'None'}

${feasibility.isUnrealistic ? `IMPORTANT CONTEXT: The budget is very tight (â‚¹${formData.budget} for ${formData.guests} guests). Acknowledge this constraint realistically. Allocate funds judiciously to essentials and provide actionable cost-saving strategies.` : ''}

CRITICAL RULES:
1. Return ONLY valid, RFC 8259 compliant JSON. Do not include markdown preamble or conversational explanations outside the JSON.
2. Currency amounts must be numbers in INR without rupee symbols or commas.
3. The sum of 'budget.categories[].estimatedAmount' plus 'budget.remaining' should equal 'budget.totalBudget' (or within 5%).
4. Provide realistic line items tailored to ${formData.location} and Indian market rates.
5. In 'timeline', provide specific actionable timeframes (e.g. "4 Weeks Before", "2 Weeks Before", "1 Week Before", "2 Days Before", "1 Day Before", "Event Day Morning", "Event Day Evening").
6. In 'vendors', list 5-8 essential vendor categories (e.g., Venue, Catering, Decor & Floral, Photography/Videography, Sound/Entertainment, Cake & Desserts, Invitations/Favors). Priority must be "High", "Medium", or "Low". Initial status must be "Not Started".
7. In 'ideas', provide tailored, creative suggestions matching the ${formData.vibe} vibe.

REQUIRED JSON STRUCTURE:
{
  "eventSummary": {
    "title": "A catchy, festive title for the event",
    "concept": "A 1-sentence memorable concept",
    "description": "2-3 sentences describing the overall vision, atmosphere, and why it fits their preferences."
  },
  "budget": {
    "totalBudget": ${formData.budget},
    "estimatedTotal": number,
    "remaining": number,
    "categories": [
      {
        "name": "e.g., Venue & Stage",
        "estimatedAmount": number,
        "reason": "Clear justification based on guest count and location"
      }
    ],
    "savingSuggestions": [
      "Actionable cost saving tip 1",
      "Actionable cost saving tip 2",
      "Actionable cost saving tip 3"
    ]
  },
  "timeline": [
    {
      "timeframe": "e.g. 4 Weeks Before",
      "tasks": [
        "Task 1",
        "Task 2"
      ]
    }
  ],
  "vendors": [
    {
      "category": "e.g. Catering & Beverages",
      "priority": "High",
      "whatToLookFor": "Key questions to ask and quality cues",
      "status": "Not Started"
    }
  ],
  "ideas": {
    "theme": "Creative theme name",
    "decor": ["Decor idea 1", "Decor idea 2", "Decor idea 3"],
    "food": ["Menu highlight 1", "Menu highlight 2", "Menu highlight 3"],
    "entertainment": ["Entertainment concept 1", "Entertainment concept 2"],
    "activities": ["Interactive guest activity 1", "Interactive guest activity 2"]
  },
  "risks": [
    "Potential risk & mitigation 1",
    "Potential risk & mitigation 2"
  ]
}`;
}

/**
 * Build prompt for AI Refinement
 */
export function buildRefinementPrompt(
  currentPlan: EventPlan,
  formData: EventFormData,
  userInstruction: string
): string {
  return `You are UtsavPilot AI. A user wants to refine an existing celebration plan.

Existing Event Requirements:
- Event: ${formData.eventType}
- Date: ${formData.eventDate}
- Location: ${formData.location}
- Guests: ${formData.guests}
- Current Budget: â‚¹${currentPlan.budget.totalBudget} INR
- Food: ${formData.foodPreference}
- Vibe: ${formData.vibe}

User's Refinement Instruction:
"${userInstruction}"

Current Plan JSON:
${JSON.stringify({
  eventSummary: currentPlan.eventSummary,
  budget: currentPlan.budget,
  timeline: currentPlan.timeline,
  vendors: currentPlan.vendors,
  ideas: currentPlan.ideas,
  risks: currentPlan.risks
}, null, 2)}

TASK:
1. Update the entire plan JSON reflecting the user's instructions.
2. If the user changed the budget, recalculate all category allocations, estimated total, and remaining amount accurately.
3. If the user changed theme, catering, or activities, adapt all relevant sections cohesively.
4. Add a top-level string field called "changeSummary" that explicitly describes what you changed in 2-3 concise sentences (e.g. "Budget reduced from â‚¹50,000 to â‚¹40,000. Reallocated venue and decor budgets while preserving the live entertainment and dinner menu.").

RETURN ONLY VALID JSON WITH THE EXACT SAME KEYS PLUS "changeSummary".`;
}

/**
 * Fallback generator when API key is missing or for offline evaluation
 */
export function generateMockEventPlan(formData: EventFormData, feasibility: BudgetFeasibility): EventPlan {
  const perGuest = Math.round(formData.budget / Math.max(1, formData.guests));
  const isBudgetTight = feasibility.isUnrealistic;

  // Proportions
  const venueShare = isBudgetTight ? 0.28 : 0.32;
  const cateringShare = isBudgetTight ? 0.38 : 0.35;
  const decorShare = isBudgetTight ? 0.14 : 0.15;
  const photoShare = isBudgetTight ? 0.08 : 0.10;
  const entertainmentShare = isBudgetTight ? 0.06 : 0.05;
  const bufferShare = 0.03;

  const venueCost = Math.round(formData.budget * venueShare);
  const cateringCost = Math.round(formData.budget * cateringShare);
  const decorCost = Math.round(formData.budget * decorShare);
  const photoCost = Math.round(formData.budget * photoShare);
  const entertainmentCost = Math.round(formData.budget * entertainmentShare);
  const estimatedTotal = venueCost + cateringCost + decorCost + photoCost + entertainmentCost;
  const remaining = Math.max(0, formData.budget - estimatedTotal);

  return {
    id: 'plan_' + Date.now(),
    createdAt: new Date().toISOString(),
    formData,
    eventSummary: {
      title: `${formData.vibe} ${formData.eventType} in ${formData.location || 'India'}`,
      concept: `A culturally rich ${formData.vibe.toLowerCase()} gathering centered around warm hospitality and seamless guest experiences.`,
      description: `Designed for ${formData.guests} esteemed guests in ${formData.location || 'your chosen venue'}. The plan balances a ${formData.foodPreference.toLowerCase()} feast, captivating ${formData.vibe.toLowerCase()} aesthetics, and cost-effective vendor arrangements within â‚¹${formData.budget.toLocaleString('en-IN')}.`
    },
    budget: {
      totalBudget: formData.budget,
      estimatedTotal,
      remaining,
      categories: [
        {
          name: 'Catering & Beverages',
          estimatedAmount: cateringCost,
          reason: `Covers ${formData.foodPreference} menu for ${formData.guests} guests at ~â‚¹${Math.round(cateringCost / Math.max(1, formData.guests))}/plate.`
        },
        {
          name: 'Venue & Seating',
          estimatedAmount: venueCost,
          reason: `Rental for a suitable hall or outdoor space in ${formData.location || 'the area'} with standard furniture layout.`
        },
        {
          name: 'Decor & Florals',
          estimatedAmount: decorCost,
          reason: `${formData.vibe} styling with backdrop, entrance arch, warm fairy lights, and seasonal table accents.`
        },
        {
          name: 'Photography & Memories',
          estimatedAmount: photoCost,
          reason: `Single candid photographer covering primary celebration rituals, family portraits, and key moments.`
        },
        {
          name: 'Entertainment & Sound',
          estimatedAmount: entertainmentCost,
          reason: `Quality PA system, wireless mics, and custom festive playlist curation.`
        }
      ],
      savingSuggestions: [
        'Negotiate an all-inclusive venue package that bundles tables, chairs, and basic sound setup.',
        `Opt for seasonal local flowers (like marigolds and jasmine) instead of exotic imported blooms to save up to 40% on floral decor.`,
        'Limit the live dessert spread to 2 signature regional sweets and 1 live ice-cream counter to minimize food waste.',
        'Send stylish digital animated invitations (WhatsApp/email) instead of heavy paper printouts.'
      ]
    },
    timeline: [
      {
        timeframe: '4 Weeks Before',
        tasks: [
          'Finalize and lock the venue booking with advance deposit.',
          'Schedule menu tasting with short-listed caterers for the ' + formData.foodPreference + ' spread.',
          'Send save-the-dates to all ' + formData.guests + ' guests.'
        ]
      },
      {
        timeframe: '2 Weeks Before',
        tasks: [
          'Confirm decor blueprint and color palette matching the ' + formData.vibe + ' style.',
          'Book photographer and outline must-have family portraits.',
          'Create high-energy celebratory playlist.'
        ]
      },
      {
        timeframe: '1 Week Before',
        tasks: [
          'Collect final RSVP count and adjust catering headcount guarantee.',
          'Order celebration cake and return gifts / favor boxes.',
          'Design digital seating/welcome chart.'
        ]
      },
      {
        timeframe: '2 Days Before',
        tasks: [
          'Coordinate venue load-in timings with decor vendor.',
          'Prepare emergency kit (safety pins, double-sided tape, phone power banks, mints).',
          'Review audio-visual equipment and cordless microphones with technician.'
        ]
      },
      {
        timeframe: 'Event Day',
        tasks: [
          'Morning: Lead vendor arrives for stage setup and floral delivery.',
          '2 Hours Prior: Soundcheck, lighting check, and welcome mocktail station setup.',
          'Event Start: Warm guest greeting and kickoff of scheduled highlights!',
          'Wrap-up: Settle vendor balances and gather gift keepsakes.'
        ]
      }
    ],
    vendors: [
      {
        category: 'Venue & Banquet',
        priority: 'High',
        whatToLookFor: 'AC efficiency, dedicated bridal/green room, parking space for guests, and in-house power backup.',
        status: 'Not Started'
      },
      {
        category: 'Catering Service',
        priority: 'High',
        whatToLookFor: 'Hygiene certification, uniform staff, live cooking stations, and complimentary tasting session.',
        status: 'Not Started'
      },
      {
        category: 'Decor & Florist',
        priority: 'Medium',
        whatToLookFor: 'Portfolio of previous ' + formData.vibe + ' themes, fabric condition, and eco-friendly dismantling.',
        status: 'Not Started'
      },
      {
        category: 'Candid Photographer',
        priority: 'Medium',
        whatToLookFor: 'Delivery timeline for highlight teaser and edited high-resolution photo gallery.',
        status: 'Not Started'
      },
      {
        category: 'Sound & Lighting Tech',
        priority: 'Medium',
        whatToLookFor: 'Decibel compliance for location, crisp microphones for speeches, and ambient uplighting.',
        status: 'Not Started'
      },
      {
        category: 'Cake & Confectionery',
        priority: 'Low',
        whatToLookFor: 'Safe refrigerated delivery to venue 1 hour before cutting, customized topper.',
        status: 'Not Started'
      }
    ],
    ideas: {
      theme: `${formData.vibe} Royal Blossom & Starlight`,
      decor: [
        'Draped chiffon canopies with warm fairy-light cascades for evening sparkle',
        'Brass urli bowls filled with fresh marigolds, floating candles, and rose petals at the entrance',
        'Minimalist brass geometric photo-backdrop with personalized neon monogram'
      ],
      food: [
        'Welcome coolers: Fresh tender coconut water with mint & saffron spiced aam panna',
        'Live Chaat & Tapas Station featuring mini pav sliders and crispy corn cones',
        'Grand signature spread with slow-cooked biryani, artisanal dal makhani, and warm flaky breads'
      ],
      entertainment: [
        'Curated acoustic musical trio during guest reception and dinner',
        'Interactive rapid-fire trivia quiz about the guest of honor via QR code'
      ],
      activities: [
        'Polaroid memory guestbook: Guests snap instant photos and write blessing notes',
        'DIY potpourri or sweet favor jar packing counter as a memorable take-home gift'
      ]
    },
    risks: [
      'Last-minute weather or sudden rain: Ensure venue has indoor banquet transition or waterproof waterproof canopies.',
      'Guest count overflow: Keep a 10% buffer on catering plates with the banquet manager.',
      'Sound restrictions: Check local municipality noise curfew (usually 10:00 PM for outdoor amplification).'
    ],
    budgetFeasibility: feasibility
  };
}

``

---

## src/lib/gemini-server.ts

``typescript
import { GoogleGenAI } from '@google/genai';
import { cleanAndParseJSON } from './gemini';

interface GeminiCallParams {
  prompt: string;
  systemInstruction?: string;
  apiKey?: string;
}

/**
 * Server-side Gemini caller using the official @google/genai SDK
 * Executes with model fallback and strict JSON parsing
 */
export async function callGeminiApi({ prompt, systemInstruction, apiKey }: GeminiCallParams): Promise<any> {
  // Read ONLY from server-side environment variables or explicit server parameter
  const key = apiKey || process.env.GEMINI_API_KEY;

  if (!key || key.trim() === '' || key === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY_MISSING');
  }

  const ai = new GoogleGenAI({ apiKey: key });
  const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error(`Empty response from Gemini model ${model}`);
      }

      return cleanAndParseJSON(text);
    } catch (err: any) {
      lastError = err;
      console.warn(`Gemini SDK invocation with model ${model} failed:`, err.message);
    }
  }

  throw lastError || new Error('All Gemini SDK model invocations failed');
}

``

---

## src/lib/storage.ts

``typescript
import { EventPlan } from '@/types/event';

const STORAGE_KEY = 'utsavpilot_saved_plans';
const ACTIVE_PLAN_KEY = 'utsavpilot_active_plan';

/**
 * Retrieve all saved plans from localStorage
 */
export function getSavedPlans(): EventPlan[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load saved plans from localStorage', e);
    return [];
  }
}

/**
 * Save or update a plan in localStorage
 */
export function savePlanToStorage(plan: EventPlan): void {
  if (typeof window === 'undefined') return;
  try {
    const plans = getSavedPlans();
    const existingIndex = plans.findIndex((p) => p.id === plan.id);
    if (existingIndex >= 0) {
      plans[existingIndex] = plan;
    } else {
      plans.unshift(plan);
    }
    // Keep up to 10 latest plans
    const trimmed = plans.slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    localStorage.setItem(ACTIVE_PLAN_KEY, JSON.stringify(plan));
  } catch (e) {
    console.error('Failed to save plan to localStorage', e);
  }
}

/**
 * Get active plan from localStorage
 */
export function getActivePlan(): EventPlan | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ACTIVE_PLAN_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get active plan from localStorage', e);
    return null;
  }
}

/**
 * Delete a plan from localStorage
 */
export function deletePlanFromStorage(id: string): EventPlan[] {
  if (typeof window === 'undefined') return [];
  try {
    const plans = getSavedPlans().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    const active = getActivePlan();
    if (active && active.id === id) {
      localStorage.removeItem(ACTIVE_PLAN_KEY);
    }
    return plans;
  } catch (e) {
    console.error('Failed to delete plan from localStorage', e);
    return [];
  }
}

``

---

## src/app/api/generate-plan/route.ts

``typescript
import { NextRequest, NextResponse } from 'next/server';
import { EventFormData, EventPlan } from '@/types/event';
import {
  buildGenerationPrompt,
  evaluateBudgetFeasibility,
  generateMockEventPlan,
} from '@/lib/gemini';
import { callGeminiApi } from '@/lib/gemini-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const formData = body.formData as EventFormData;

    // Validate required fields
    if (!formData) {
      return NextResponse.json(
        { error: 'Missing form data in request body' },
        { status: 400 }
      );
    }

    if (!formData.eventType) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      );
    }

    if (!formData.eventDate) {
      return NextResponse.json(
        { error: 'Event date is required' },
        { status: 400 }
      );
    }

    if (!formData.location || formData.location.trim() === '') {
      return NextResponse.json(
        { error: 'Event location / city is required' },
        { status: 400 }
      );
    }

    if (!formData.guests || formData.guests <= 0) {
      return NextResponse.json(
        { error: 'Number of guests must be at least 1' },
        { status: 400 }
      );
    }

    if (!formData.budget || formData.budget <= 0) {
      return NextResponse.json(
        { error: 'Budget in INR must be greater than 0' },
        { status: 400 }
      );
    }

    // Evaluate budget feasibility (Edge case handling: e.g. â‚¹10,000 for 200 guests)
    const feasibility = evaluateBudgetFeasibility(formData);

    // Check if server-side key is available
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
      // Return high-fidelity fallback plan with clear notification
      const fallbackPlan = generateMockEventPlan(formData, feasibility);
      return NextResponse.json({
        plan: fallbackPlan,
        isDemoSimulation: true,
        warning: 'GEMINI_API_KEY is not configured in .env.local. Serving smart simulation plan.'
      });
    }

    // Call Gemini with strict JSON prompt
    const prompt = buildGenerationPrompt(formData, feasibility);
    const systemInstruction = 'You are UtsavPilot, an expert AI celebration and event planner. Always respond with strict, valid JSON matching the exact requested schema.';

    let rawPlanData: any;
    try {
      rawPlanData = await callGeminiApi({
        prompt,
        systemInstruction,
        apiKey
      });
    } catch (apiErr: any) {
      console.error('Gemini API call failed:', apiErr);
      // Fallback gracefully so the page never crashes
      const fallbackPlan = generateMockEventPlan(formData, feasibility);
      return NextResponse.json({
        plan: fallbackPlan,
        isDemoSimulation: true,
        warning: `Gemini API error: ${apiErr.message || 'Service unavailable'}. Loaded local recovery plan.`
      });
    }

    // Strict budget mathematical consistency
    const totalBudget = Number(rawPlanData?.budget?.totalBudget) || formData.budget;
    const categories = Array.isArray(rawPlanData?.budget?.categories) && rawPlanData.budget.categories.length > 0
      ? rawPlanData.budget.categories.map((c: any) => ({
          name: String(c.name || 'Expense'),
          estimatedAmount: Math.max(0, Math.round(Number(c.estimatedAmount) || 0)),
          reason: String(c.reason || '')
        }))
      : [];

    const categorySum = categories.reduce((sum: number, c: any) => sum + c.estimatedAmount, 0);
    const estimatedTotal = categorySum > 0 ? categorySum : Math.round(totalBudget * 0.95);
    const remaining = Math.max(0, totalBudget - estimatedTotal);

    // Validate and sanitize returned response structure
    const plan: EventPlan = {
      id: 'plan_' + Date.now(),
      createdAt: new Date().toISOString(),
      formData,
      eventSummary: {
        title: rawPlanData?.eventSummary?.title || `${formData.vibe} ${formData.eventType} in ${formData.location}`,
        concept: rawPlanData?.eventSummary?.concept || 'A personalized celebration tailored to your requirements.',
        description: rawPlanData?.eventSummary?.description || 'A complete celebration plan curated for an unforgettable experience.'
      },
      budget: {
        totalBudget,
        estimatedTotal,
        remaining,
        categories,
        savingSuggestions: Array.isArray(rawPlanData?.budget?.savingSuggestions)
          ? rawPlanData.budget.savingSuggestions.map(String)
          : []
      },
      timeline: Array.isArray(rawPlanData?.timeline)
        ? rawPlanData.timeline.map((t: any) => ({
            timeframe: String(t.timeframe || 'Milestone'),
            tasks: Array.isArray(t.tasks) ? t.tasks.map(String) : []
          }))
        : [],
      vendors: Array.isArray(rawPlanData?.vendors)
        ? rawPlanData.vendors.map((v: any) => ({
            category: String(v.category || 'Vendor'),
            priority: (v.priority === 'High' || v.priority === 'Low') ? v.priority : 'Medium',
            whatToLookFor: String(v.whatToLookFor || ''),
            status: 'Not Started'
          }))
        : [],
      ideas: {
        theme: String(rawPlanData?.ideas?.theme || `${formData.vibe} Celebration`),
        decor: Array.isArray(rawPlanData?.ideas?.decor) ? rawPlanData.ideas.decor.map(String) : [],
        food: Array.isArray(rawPlanData?.ideas?.food) ? rawPlanData.ideas.food.map(String) : [],
        entertainment: Array.isArray(rawPlanData?.ideas?.entertainment) ? rawPlanData.ideas.entertainment.map(String) : [],
        activities: Array.isArray(rawPlanData?.ideas?.activities) ? rawPlanData.ideas.activities.map(String) : []
      },
      risks: Array.isArray(rawPlanData?.risks) ? rawPlanData.risks.map(String) : [],
      budgetFeasibility: feasibility
    };

    return NextResponse.json({
      plan,
      isDemoSimulation: false
    });
  } catch (error: any) {
    console.error('Error generating event plan:', error);
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred while generating the plan' },
      { status: 500 }
    );
  }
}

``

---

## src/app/api/refine-plan/route.ts

``typescript
import { NextRequest, NextResponse } from 'next/server';
import { EventPlan, EventFormData } from '@/types/event';
import { buildRefinementPrompt, evaluateBudgetFeasibility } from '@/lib/gemini';
import { callGeminiApi } from '@/lib/gemini-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const currentPlan = body.currentPlan as EventPlan;
    const formData = (body.formData || currentPlan?.formData) as EventFormData;
    const instruction = body.instruction as string;

    if (!currentPlan) {
      return NextResponse.json(
        { error: 'Current event plan is required for refinement' },
        { status: 400 }
      );
    }

    if (!instruction || instruction.trim() === '') {
      return NextResponse.json(
        { error: 'Please provide a refinement instruction for Utsav AI' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Check if key exists
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
      // Local fallback refinement simulation if key is not yet set
      const updatedPlan: EventPlan = JSON.parse(JSON.stringify(currentPlan));
      
      // Parse instruction for common demo changes
      const lower = instruction.toLowerCase();
      let changeExplanation = `Refined celebration plan according to: "${instruction}".`;

      const budgetMatch = instruction.match(/(?:budget|â‚¹|rs\.?)\s*(\d[\d,]*)/i) || instruction.match(/(\d[\d,]*)\s*(?:budget|inr|rupees)/i);
      if (budgetMatch) {
        const rawNum = parseInt(budgetMatch[1].replace(/,/g, ''), 10);
        if (rawNum > 0) {
          const oldBudget = updatedPlan.budget.totalBudget;
          updatedPlan.budget.totalBudget = rawNum;
          const ratio = rawNum / oldBudget;
          updatedPlan.budget.categories.forEach((cat) => {
            cat.estimatedAmount = Math.round(cat.estimatedAmount * ratio);
          });
          const newEstimated = updatedPlan.budget.categories.reduce((acc, c) => acc + c.estimatedAmount, 0);
          updatedPlan.budget.estimatedTotal = newEstimated;
          updatedPlan.budget.remaining = Math.max(0, rawNum - newEstimated);
          updatedPlan.formData.budget = rawNum;
          changeExplanation = `Budget re-calibrated from â‚¹${oldBudget.toLocaleString('en-IN')} to â‚¹${rawNum.toLocaleString('en-IN')}. Proportional category expenses adjusted while preserving core celebration vendor slots.`;
        }
      } else if (lower.includes('vegan') || lower.includes('vegetarian')) {
        updatedPlan.formData.foodPreference = lower.includes('vegan') ? 'Vegan' : 'Vegetarian';
        updatedPlan.ideas.food = [
          'Delectable plant-based appetizer platter with grilled kebabs & dips',
          'Rich traditional mains prepared with cold-pressed oils and coconut milk bases',
          'Artisanal almond-milk kheer and dairy-free pistachio kulfi'
        ];
        changeExplanation = `Updated catering focus to ${updatedPlan.formData.foodPreference}. Replaced conventional dairy & non-veg line items with curated plant-based culinary delicacies.`;
      } else if (lower.includes('dj') || lower.includes('music') || lower.includes('dance')) {
        updatedPlan.ideas.entertainment.push('High-energy live DJ set with festival lighting and wireless microphones');
        changeExplanation = 'Added professional DJ entertainment and interactive party music playlist to the celebration lineup.';
      }

      updatedPlan.refinementNotes = changeExplanation;
      const feasibility = evaluateBudgetFeasibility(updatedPlan.formData);
      updatedPlan.budgetFeasibility = feasibility;

      return NextResponse.json({
        plan: updatedPlan,
        changeSummary: changeExplanation,
        isDemoSimulation: true,
        warning: 'GEMINI_API_KEY is not configured in .env.local. Served smart offline refinement.'
      });
    }

    // Call Gemini API for real dynamic refinement
    const prompt = buildRefinementPrompt(currentPlan, formData, instruction);
    const systemInstruction = 'You are UtsavPilot AI. Always return strictly valid JSON matching the exact schema of the event plan with the updated fields, plus a "changeSummary" string.';

    let rawRefinedData: any;
    try {
      rawRefinedData = await callGeminiApi({
        prompt,
        systemInstruction,
        apiKey
      });
    } catch (apiErr: any) {
      console.error('Gemini refinement failed:', apiErr);
      return NextResponse.json(
        { error: `Gemini API error during refinement: ${apiErr.message}` },
        { status: 500 }
      );
    }

    const changeSummary = rawRefinedData?.changeSummary || `Updated plan according to: "${instruction}"`;

    // Merge into structured plan
    const updatedTotalBudget = Number(rawRefinedData?.budget?.totalBudget) || currentPlan.budget.totalBudget;
    const updatedFormData: EventFormData = {
      ...formData,
      budget: updatedTotalBudget
    };

    const feasibility = evaluateBudgetFeasibility(updatedFormData);

    const refinedCategories = Array.isArray(rawRefinedData?.budget?.categories) && rawRefinedData.budget.categories.length > 0
      ? rawRefinedData.budget.categories.map((c: any) => ({
          name: String(c.name || 'Expense'),
          estimatedAmount: Math.max(0, Math.round(Number(c.estimatedAmount) || 0)),
          reason: String(c.reason || '')
        }))
      : currentPlan.budget.categories;

    const refinedCategorySum = refinedCategories.reduce((sum: number, c: any) => sum + c.estimatedAmount, 0);
    const refinedEstimatedTotal = refinedCategorySum > 0 ? refinedCategorySum : (Number(rawRefinedData?.budget?.estimatedTotal) || currentPlan.budget.estimatedTotal);
    const refinedRemaining = Math.max(0, updatedTotalBudget - refinedEstimatedTotal);

    const updatedPlan: EventPlan = {
      id: currentPlan.id,
      createdAt: currentPlan.createdAt,
      formData: updatedFormData,
      eventSummary: {
        title: rawRefinedData?.eventSummary?.title || currentPlan.eventSummary.title,
        concept: rawRefinedData?.eventSummary?.concept || currentPlan.eventSummary.concept,
        description: rawRefinedData?.eventSummary?.description || currentPlan.eventSummary.description
      },
      budget: {
        totalBudget: updatedTotalBudget,
        estimatedTotal: refinedEstimatedTotal,
        remaining: refinedRemaining,
        categories: refinedCategories,
        savingSuggestions: Array.isArray(rawRefinedData?.budget?.savingSuggestions)
          ? rawRefinedData.budget.savingSuggestions.map(String)
          : currentPlan.budget.savingSuggestions
      },
      timeline: Array.isArray(rawRefinedData?.timeline)
        ? rawRefinedData.timeline.map((t: any) => ({
            timeframe: String(t.timeframe || 'Milestone'),
            tasks: Array.isArray(t.tasks) ? t.tasks.map(String) : []
          }))
        : currentPlan.timeline,
      vendors: Array.isArray(rawRefinedData?.vendors)
        ? rawRefinedData.vendors.map((v: any, index: number) => {
            // Preserve existing status if available
            const existingVendor = currentPlan.vendors.find((ex) => ex.category.toLowerCase() === (v.category || '').toLowerCase());
            return {
              category: String(v.category || 'Vendor'),
              priority: (v.priority === 'High' || v.priority === 'Low') ? v.priority : 'Medium',
              whatToLookFor: String(v.whatToLookFor || ''),
              status: existingVendor ? existingVendor.status : 'Not Started'
            };
          })
        : currentPlan.vendors,
      ideas: {
        theme: String(rawRefinedData?.ideas?.theme || currentPlan.ideas.theme),
        decor: Array.isArray(rawRefinedData?.ideas?.decor) ? rawRefinedData.ideas.decor.map(String) : currentPlan.ideas.decor,
        food: Array.isArray(rawRefinedData?.ideas?.food) ? rawRefinedData.ideas.food.map(String) : currentPlan.ideas.food,
        entertainment: Array.isArray(rawRefinedData?.ideas?.entertainment) ? rawRefinedData.ideas.entertainment.map(String) : currentPlan.ideas.entertainment,
        activities: Array.isArray(rawRefinedData?.ideas?.activities) ? rawRefinedData.ideas.activities.map(String) : currentPlan.ideas.activities
      },
      risks: Array.isArray(rawRefinedData?.risks) ? rawRefinedData.risks.map(String) : currentPlan.risks,
      budgetFeasibility: feasibility,
      refinementNotes: changeSummary
    };

    return NextResponse.json({
      plan: updatedPlan,
      changeSummary,
      isDemoSimulation: false
    });
  } catch (error: any) {
    console.error('Error refining plan:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to refine plan' },
      { status: 500 }
    );
  }
}

``

---

## src/app/layout.tsx

``typescript
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'UTSAVPILOT â€” Plan the celebration. Weâ€™ll handle the complexity.',
  description:
    'GenAI-powered planning assistant that helps users organize weddings, birthdays, and community events with budgets, timelines, vendor checklists, and personalized ideas.',
  keywords: [
    'event planner',
    'wedding planner',
    'birthday planner',
    'celebration',
    'AI event planner',
    'Gemini AI',
    'Indian events',
    'INR budget planner'
  ],
  authors: [{ name: 'UtsavPilot Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}

``

---

## src/app/page.tsx

``typescript
'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { LandingHero } from '@/components/LandingHero';
import { EventFormWizard } from '@/components/EventFormWizard';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { PlanDashboard } from '@/components/PlanDashboard';
import { SavedPlansModal } from '@/components/SavedPlansModal';
import { EventFormData, EventPlan } from '@/types/event';
import {
  getSavedPlans,
  savePlanToStorage,
  getActivePlan,
  deletePlanFromStorage,
} from '@/lib/storage';
import { AlertCircle, X } from 'lucide-react';

export default function Home() {
  const [view, setView] = useState<'landing' | 'wizard' | 'dashboard'>('landing');
  const [activePlan, setActivePlan] = useState<EventPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<EventPlan[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formDataDraft, setFormDataDraft] = useState<Partial<EventFormData> | undefined>(undefined);
  const [isDemoSimulation, setIsDemoSimulation] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const plans = getSavedPlans();
    setSavedPlans(plans);

    const cachedActive = getActivePlan();
    if (cachedActive) {
      setActivePlan(cachedActive);
      setView('dashboard');
    }
  }, []);

  // Handle sample selection from hero
  const handleSelectSample = (sampleData: EventFormData) => {
    setFormDataDraft(sampleData);
    setView('wizard');
    setErrorMessage(null);
  };

  // Handle plan generation
  const handleGeneratePlan = async (formData: EventFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate event plan');
      }

      if (data.plan) {
        setActivePlan(data.plan);
        setIsDemoSimulation(Boolean(data.isDemoSimulation));
        savePlanToStorage(data.plan);
        setSavedPlans(getSavedPlans());
        setView('dashboard');
      } else {
        throw new Error('No plan data received from server');
      }
    } catch (err: any) {
      console.error('Plan generation error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred while communicating with Gemini.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle updating plan (e.g. status changes or refinement)
  const handleUpdatePlan = (updatedPlan: EventPlan) => {
    setActivePlan(updatedPlan);
    savePlanToStorage(updatedPlan);
    setSavedPlans(getSavedPlans());
  };

  // Handle deleting saved plan
  const handleDeletePlan = (id: string) => {
    const remaining = deletePlanFromStorage(id);
    setSavedPlans(remaining);
    if (activePlan?.id === id) {
      setActivePlan(remaining[0] || null);
      if (remaining.length === 0) {
        setView('landing');
      }
    }
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-amber-200">
      {/* Top Navigation */}
      <Navbar
        onNewEvent={() => {
          setView('wizard');
          setErrorMessage(null);
        }}
        onOpenSavedPlans={() => setIsSavedModalOpen(true)}
        onPrint={activePlan ? handlePrint : undefined}
        hasActivePlan={Boolean(activePlan)}
        savedPlansCount={savedPlans.length}
      />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto px-4 mt-4 w-full print:hidden">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Generation Notice</p>
                <p className="mt-0.5 text-rose-800">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-800 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {view === 'landing' && (
          <div>
            <LandingHero
              onStartPlanning={() => {
                setView('wizard');
                setErrorMessage(null);
              }}
              onSelectSample={handleSelectSample}
            />
            {/* If there's an active plan, provide a resume bar */}
            {activePlan && (
              <div className="max-w-2xl mx-auto px-4 pb-12">
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Resume Previous Plan
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm mt-1">
                      {activePlan.eventSummary.title}
                    </h4>
                    <p className="text-xs text-stone-500">
                      â‚¹{activePlan.budget.totalBudget.toLocaleString('en-IN')} â€¢ {activePlan.formData.guests} Guests
                    </p>
                  </div>
                  <button
                    onClick={() => setView('dashboard')}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Open Dashboard â†’
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'wizard' && (
          <EventFormWizard
            initialData={formDataDraft}
            onSubmit={handleGeneratePlan}
            isLoading={isLoading}
          />
        )}

        {view === 'dashboard' && activePlan && (
          <PlanDashboard
            plan={activePlan}
            onUpdatePlan={handleUpdatePlan}
            onModifyRequirements={() => {
              setFormDataDraft(activePlan.formData);
              setView('wizard');
            }}
            onPrint={handlePrint}
            isDemoSimulation={isDemoSimulation}
          />
        )}
      </main>

      {/* Multi-step loading overlay */}
      <LoadingOverlay isVisible={isLoading} />

      {/* Saved plans drawer/modal */}
      <SavedPlansModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        plans={savedPlans}
        onSelectPlan={(plan) => {
          setActivePlan(plan);
          setView('dashboard');
        }}
        onDeletePlan={handleDeletePlan}
      />

      {/* Simple Footer */}
      <footer className="py-6 border-t border-stone-200/80 bg-white text-center text-xs text-stone-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-stone-800">UTSAVPILOT</span>
            <span>â€” Virtual PromptWars 2026 by Hack2Skill</span>
          </div>
          <p className="text-stone-400">
            Powered by Google Gemini â€¢ Built for Indian Celebrations
          </p>
        </div>
      </footer>
    </div>
  );
}

``

---

## src/app/globals.css

``css
@import "tailwindcss";

@layer base {
  body {
    @apply bg-stone-50 text-stone-900;
    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  }
}

/* Print Specific Optimizations */
@media print {
  @page {
    margin: 1.5cm;
    size: auto;
  }

  body {
    background: white !important;
    color: black !important;
  }

  .print\:hidden {
    display: none !important;
  }

  .print\:border-none {
    border: none !important;
  }

  .print\:shadow-none {
    box-shadow: none !important;
  }

  /* Prevent awkward page cuts */
  .p-4, .p-6, .p-8 {
    break-inside: avoid;
  }

  h1, h2, h3, h4 {
    break-after: avoid;
  }
}

``

---

## src/components/Navbar.tsx

``typescript
'use client';

import React from 'react';
import { Sparkles, Printer, FolderOpen, PlusCircle } from 'lucide-react';

interface NavbarProps {
  onNewEvent: () => void;
  onOpenSavedPlans: () => void;
  onPrint?: () => void;
  hasActivePlan: boolean;
  savedPlansCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewEvent,
  onOpenSavedPlans,
  onPrint,
  hasActivePlan,
  savedPlansCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onNewEvent}
          className="flex items-center gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-rose-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-amber-700 via-rose-600 to-amber-600 bg-clip-text text-transparent">
                UTSAVPILOT
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                MVP
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-stone-500 font-medium">
              Plan the celebration. Weâ€™ll handle the complexity.
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Powered by Gemini Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200/60 text-xs font-semibold text-rose-800">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Powered by Gemini</span>
          </div>

          {/* Saved Plans Button */}
          <button
            onClick={onOpenSavedPlans}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100/80 transition-colors"
            title="View saved event plans"
          >
            <FolderOpen className="w-4 h-4 text-stone-500" />
            <span className="hidden sm:inline">Saved Plans</span>
            {savedPlansCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                {savedPlansCount}
              </span>
            )}
          </button>

          {/* Print Button (active when plan exists) */}
          {hasActivePlan && onPrint && (
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100/80 transition-colors"
              title="Print current plan"
            >
              <Printer className="w-4 h-4 text-stone-500" />
              <span className="hidden sm:inline">Print</span>
            </button>
          )}

          {/* New Event Button */}
          <button
            onClick={onNewEvent}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Event</span>
          </button>
        </div>
      </div>
    </header>
  );
};

``

---

## src/components/LandingHero.tsx

``typescript
'use client';

import React from 'react';
import { ArrowRight, IndianRupee, Clock, Sparkles, AlertTriangle } from 'lucide-react';
import { EventFormData } from '@/types/event';

interface LandingHeroProps {
  onStartPlanning: () => void;
  onSelectSample: (sample: EventFormData) => void;
}

interface SamplePreset {
  title: string;
  subtitle: string;
  tag: string;
  badge?: string;
  daysAhead: number;
  data: Omit<EventFormData, 'eventDate'>;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartPlanning,
  onSelectSample,
}) => {
  const samplePresets: SamplePreset[] = [
    {
      title: 'Aaravâ€™s 1st Birthday Party',
      subtitle: '50 Guests â€¢ â‚¹50,000 â€¢ Pure Veg â€¢ Colorful',
      tag: 'â‚¹50k â€¢ 50 Guests',
      badge: 'TEST 1',
      daysAhead: 21,
      data: {
        eventType: 'Birthday',
        location: 'Bengaluru, Karnataka',
        guests: 50,
        budget: 50000,
        vibe: 'Colorful',
        foodPreference: 'Vegetarian',
        notes: 'Balloon arch, magic show, customized cake, and eco-friendly return favors.'
      }
    },
    {
      title: 'Meera & Rohanâ€™s Royal Wedding',
      subtitle: '150 Guests â€¢ â‚¹2,00,000 â€¢ Traditional Rajasthani',
      tag: 'â‚¹2 Lakh â€¢ 150 Guests',
      badge: 'TEST 2',
      daysAhead: 45,
      data: {
        eventType: 'Wedding',
        location: 'Jaipur, Rajasthan',
        guests: 150,
        budget: 200000,
        vibe: 'Traditional',
        foodPreference: 'Vegetarian',
        notes: 'Marigold floral decor, live sitar/shehnai, royal banquet, and candid photography.'
      }
    },
    {
      title: 'Gokuldham Community Diwali Utsav',
      subtitle: '200 Guests â€¢ â‚¹80,000 â€¢ Society Celebration',
      tag: 'â‚¹80k â€¢ 200 Guests',
      badge: 'TEST 3',
      daysAhead: 30,
      data: {
        eventType: 'Community Event',
        location: 'Mumbai, Maharashtra',
        guests: 200,
        budget: 80000,
        vibe: 'Traditional',
        foodPreference: 'Vegetarian',
        notes: 'Clubhouse venue, rangoli competition, lantern lighting, and live snack stalls.'
      }
    },
    {
      title: 'Edge Case: Tight Budget Celebration',
      subtitle: '200 Guests â€¢ â‚¹10,000 (Tests AI Feasibility Alert)',
      tag: 'â‚¹10k â€¢ 200 Guests',
      badge: 'TEST 4 (EDGE CASE)',
      daysAhead: 25,
      data: {
        eventType: 'Wedding',
        location: 'Delhi NCR',
        guests: 200,
        budget: 10000,
        vibe: 'Elegant',
        foodPreference: 'Vegetarian',
        notes: 'Testing Gemini edge-case budget feasibility detection.'
      }
    }
  ];

  const handlePresetClick = (preset: SamplePreset) => {
    const computedDate = new Date(Date.now() + preset.daysAhead * 86400000)
      .toISOString()
      .split('T')[0];
    onSelectSample({
      ...preset.data,
      eventDate: computedDate,
    });
  };

  return (
    <div className="relative overflow-hidden py-10 md:py-16">
      {/* Background celebration glow elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-200/40 via-rose-200/30 to-orange-100/40 blur-3xl -z-10 pointer-events-none rounded-full" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
          <span>GenAI Celebration & Event Planner</span>
          <span className="text-stone-300">â€¢</span>
          <span className="text-amber-700">Powered by Gemini</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.15]">
          Plan the celebration.{' '}
          <span className="bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 bg-clip-text text-transparent">
            Weâ€™ll handle the complexity.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
          UtsavPilot turns your event idea into a personalized, budget-aware plan in seconds.
        </p>

        {/* Primary CTA */}
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartPlanning}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 hover:from-amber-700 hover:to-rose-700 text-white font-extrabold text-base shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/35 transition-all flex items-center justify-center gap-2 group active:scale-95 cursor-pointer"
          >
            <span>Create My Event</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 1-Click Interactive Judge Demos (Unbeatable for a 4-minute demo) */}
        <div className="mt-10 p-5 rounded-2xl bg-white/90 border border-stone-200/90 shadow-sm text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-extrabold tracking-wider text-stone-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>âš¡ 4-Minute Demo Presets (1-Click Fill & Test):</span>
            </span>
            <span className="text-[11px] text-stone-500 font-medium hidden sm:inline">
              Populates full form instantly
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {samplePresets.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetClick(sample)}
                className="p-3 rounded-xl bg-stone-50 hover:bg-amber-50/70 border border-stone-200/80 hover:border-amber-300 text-left transition-all group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-stone-200 text-stone-800">
                      {sample.badge}
                    </span>
                    <span className="text-[10px] font-bold text-amber-700">
                      {sample.tag}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                    {sample.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                    {sample.subtitle}
                  </p>
                </div>
                <div className="mt-2.5 flex items-center text-[11px] font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform">
                  <span>Load scenario</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Three Core Benefits */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          {/* Benefit 1 */}
          <div className="bg-white/80 p-5 rounded-2xl border border-stone-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 mb-3">
              <IndianRupee className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-stone-900">Budget-aware planning</h3>
            <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
              Transparent INR cost breakdowns, realistic per-plate estimates, and intelligent money-saving recommendations.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white/80 p-5 rounded-2xl border border-stone-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-700 mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-stone-900">Smart timelines</h3>
            <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
              Step-by-step milestone checklists scheduled backwards from your celebration date so you never miss a deadline.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white/80 p-5 rounded-2xl border border-stone-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-700 mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-stone-900">Personalized ideas</h3>
            <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
              Tailored cultural themes, decor palettes, curated culinary spreads, and engaging guest activities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

``

---

## src/components/EventFormWizard.tsx

``typescript
'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Utensils,
  Palette,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { EventFormData, EventType, EventVibe, FoodPreference } from '@/types/event';

interface EventFormWizardProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (formData: EventFormData) => void;
  isLoading: boolean;
}

export const EventFormWizard: React.FC<EventFormWizardProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const [eventType, setEventType] = useState<EventType>(initialData?.eventType || 'Birthday');
  const [customEventType, setCustomEventType] = useState<string>(initialData?.customEventType || '');
  const [eventDate, setEventDate] = useState<string>(initialData?.eventDate || '2026-11-20');
  const [location, setLocation] = useState<string>(initialData?.location || 'Bengaluru, Karnataka');

  React.useEffect(() => {
    if (!initialData?.eventDate) {
      setEventDate(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
    }
  }, [initialData?.eventDate]);
  const [guests, setGuests] = useState<number>(initialData?.guests || 50);
  const [budget, setBudget] = useState<number>(initialData?.budget || 60000);
  const [vibe, setVibe] = useState<EventVibe>(initialData?.vibe || 'Fun');
  const [customVibe, setCustomVibe] = useState<string>(initialData?.customVibe || '');
  const [foodPreference, setFoodPreference] = useState<FoodPreference>(
    initialData?.foodPreference || 'Vegetarian'
  );
  const [notes, setNotes] = useState<string>(initialData?.notes || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Quick preset locations
  const popularLocations = ['Mumbai', 'Bengaluru', 'Delhi NCR', 'Jaipur', 'Hyderabad', 'Pune'];

  const eventTypes: EventType[] = ['Birthday', 'Wedding', 'Community Event', 'Other'];
  const vibes: EventVibe[] = ['Elegant', 'Fun', 'Traditional', 'Modern', 'Colorful', 'Minimal', 'Custom'];
  const foodPreferences: FoodPreference[] = ['Vegetarian', 'Non-vegetarian', 'Vegan', 'Mixed'];

  // Calculate per guest metric
  const perGuest = guests > 0 ? Math.round(budget / guests) : 0;
  const isBudgetVeryTight = perGuest < 300;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validations
    if (!location.trim()) {
      setValidationError('Please enter an event location or city.');
      return;
    }
    if (!eventDate) {
      setValidationError('Please select an event date.');
      return;
    }
    if (guests <= 0 || isNaN(guests)) {
      setValidationError('Please enter a valid number of guests (at least 1).');
      return;
    }
    if (budget <= 0 || isNaN(budget)) {
      setValidationError('Please specify a valid budget in INR.');
      return;
    }
    if (eventType === 'Other' && !customEventType.trim()) {
      setValidationError('Please describe the custom event type.');
      return;
    }
    if (vibe === 'Custom' && !customVibe.trim()) {
      setValidationError('Please describe your custom style or vibe preference.');
      return;
    }

    const payload: EventFormData = {
      eventType,
      customEventType: eventType === 'Other' ? customEventType.trim() : undefined,
      eventDate,
      location: location.trim(),
      guests,
      budget,
      vibe,
      customVibe: vibe === 'Custom' ? customVibe.trim() : undefined,
      foodPreference,
      notes: notes.trim() || undefined,
    };

    onSubmit(payload);
  };

  return (
    <div id="event-form" className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-10">
        {/* Form Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Event Planning Wizard
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Step 1 of 1 â€¢ Takes 1 minute
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
            Tell us about your celebration
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Gemini will craft a personalized event concept, dynamic budget, vendor checklist, and timeline.
          </p>

          {/* Quick Competition Scenario Buttons */}
          <div className="mt-4 p-3 rounded-2xl bg-stone-50 border border-stone-200">
            <p className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider mb-2">
              âš¡ 1-Click Competition Scenarios:
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setEventType('Birthday');
                  setGuests(50);
                  setBudget(50000);
                  setFoodPreference('Vegetarian');
                  setVibe('Colorful');
                  setLocation('Bengaluru, Karnataka');
                  setNotes('Balloon arch, customized cake, and eco-friendly return favors.');
                }}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-100 text-stone-800 font-bold border border-stone-200 shadow-2xs transition-colors cursor-pointer"
              >
                ðŸŽ‚ 50k Birthday (Test 1)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEventType('Wedding');
                  setGuests(150);
                  setBudget(200000);
                  setFoodPreference('Vegetarian');
                  setVibe('Traditional');
                  setLocation('Jaipur, Rajasthan');
                  setNotes('Marigold decor, live sitar/shehnai, royal banquet.');
                }}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-100 text-stone-800 font-bold border border-stone-200 shadow-2xs transition-colors cursor-pointer"
              >
                ðŸ’ 2 Lakh Wedding (Test 2)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEventType('Community Event');
                  setGuests(200);
                  setBudget(80000);
                  setFoodPreference('Vegetarian');
                  setVibe('Traditional');
                  setLocation('Mumbai, Maharashtra');
                  setNotes('Clubhouse hall, rangoli, lantern lighting, and snack stalls.');
                }}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-100 text-stone-800 font-bold border border-stone-200 shadow-2xs transition-colors cursor-pointer"
              >
                ðŸª” 80k Community (Test 3)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEventType('Wedding');
                  setGuests(200);
                  setBudget(10000);
                  setFoodPreference('Vegetarian');
                  setVibe('Elegant');
                  setLocation('Delhi NCR');
                  setNotes('Testing Gemini edge case feasibility detection.');
                }}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold border border-rose-200 shadow-2xs transition-colors cursor-pointer"
              >
                âš ï¸ 10k Edge Case (Test 4)
              </button>
            </div>
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Incomplete Information</p>
              <p className="text-rose-700 mt-0.5">{validationError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Event Type */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Event Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {eventTypes.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setEventType(type)}
                  className={`py-3 px-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                    eventType === type
                      ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-700'
                  }`}
                >
                  {type === 'Birthday' && 'ðŸŽ‚ Birthday'}
                  {type === 'Wedding' && 'ðŸ’ Wedding'}
                  {type === 'Community Event' && 'ðŸª” Community'}
                  {type === 'Other' && 'âœ¨ Other'}
                </button>
              ))}
            </div>

            {eventType === 'Other' && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Specify event (e.g. Baby Shower, Retirement, Housewarming)"
                  value={customEventType}
                  onChange={(e) => setCustomEventType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  required
                />
              </div>
            )}
          </div>

          {/* 2. Date & Location Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Event Date */}
            <div>
              <label className="block text-sm font-bold text-stone-900 mb-2">
                Event Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={eventDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-stone-800"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-stone-900 mb-2">
                City / Location <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Maharashtra"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-stone-800"
                  required
                />
              </div>
              {/* Quick location chips */}
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {popularLocations.map((loc) => (
                  <button
                    type="button"
                    key={loc}
                    onClick={() => setLocation(loc)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Guests & Budget in INR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Number of Guests */}
            <div>
              <label className="block text-sm font-bold text-stone-900 mb-2">
                Number of Guests <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={guests || ''}
                  onChange={(e) => setGuests(parseInt(e.target.value, 10) || 0)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold text-stone-800"
                  required
                />
              </div>
              <div className="mt-1.5 flex gap-1.5">
                {[30, 50, 100, 200, 500].map((count) => (
                  <button
                    type="button"
                    key={count}
                    onClick={() => setGuests(count)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget in INR */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-stone-900">
                  Total Budget in INR (â‚¹) <span className="text-rose-500">*</span>
                </label>
                {perGuest > 0 && (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isBudgetVeryTight ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    â‚¹{perGuest.toLocaleString('en-IN')}/guest
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="font-bold text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  â‚¹
                </span>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={budget || ''}
                  onChange={(e) => setBudget(parseInt(e.target.value, 10) || 0)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-bold text-stone-800"
                  required
                />
              </div>
              <div className="mt-1.5 flex gap-1.5">
                {[25000, 50000, 100000, 250000, 500000].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setBudget(amt)}
                    className="text-[11px] px-1.5 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                  >
                    â‚¹{(amt / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Budget Alert Preview (Edge case awareness) */}
          {isBudgetVeryTight && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Tight Budget Detected:</strong> At ~â‚¹{perGuest}/guest, UtsavPilot will automatically inject strategic cost-saving measures and realistic vendor recommendations.
              </span>
            </div>
          )}

          {/* 4. Style / Vibe */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Style / Vibe <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {vibes.map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setVibe(v)}
                  className={`py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    vibe === v
                      ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-700'
                  }`}
                >
                  {v === 'Elegant' && 'âœ¨ Elegant'}
                  {v === 'Fun' && 'ðŸŽ‰ Fun'}
                  {v === 'Traditional' && 'ðŸª” Traditional'}
                  {v === 'Modern' && 'ðŸ™ï¸ Modern'}
                  {v === 'Colorful' && 'ðŸŽ¨ Colorful'}
                  {v === 'Minimal' && 'ðŸŒ¿ Minimal'}
                  {v === 'Custom' && 'âœï¸ Custom'}
                </button>
              ))}
            </div>

            {vibe === 'Custom' && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Describe your custom vibe (e.g. Bollywood Retro, Eco-friendly Rustic, Royal Rajasthani)"
                  value={customVibe}
                  onChange={(e) => setCustomVibe(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  required
                />
              </div>
            )}
          </div>

          {/* 5. Food Preference */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Food Preference <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {foodPreferences.map((pref) => (
                <button
                  type="button"
                  key={pref}
                  onClick={() => setFoodPreference(pref)}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                    foodPreference === pref
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-700'
                  }`}
                >
                  {pref === 'Vegetarian' && 'ðŸ¥— Pure Veg'}
                  {pref === 'Non-vegetarian' && 'ðŸ— Non-Veg'}
                  {pref === 'Vegan' && 'ðŸŒ± Vegan'}
                  {pref === 'Mixed' && 'ðŸ² Mixed Menu'}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Optional Notes */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Special Wishes / Notes <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Senior-friendly venue, acoustic instrumentalist, eco-friendly floral decor, no single-use plastics"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-stone-800 resize-none"
            />
          </div>

          {/* Primary Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 hover:from-amber-700 hover:to-rose-700 text-white font-extrabold text-lg shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/35 transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>âœ¨ Generate My Event Plan</span>
            </button>
            <p className="text-center text-xs text-stone-500 mt-2.5">
              Powered by Google Gemini â€¢ Tailored line items in INR â€¢ Saved locally in your browser
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

``

---

## src/components/LoadingOverlay.tsx

``typescript
'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, BrainCircuit, Calculator, CalendarClock, ClipboardCheck } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
  const steps = [
    { text: 'Understanding your event...', icon: BrainCircuit },
    { text: 'Building your budget in INR...', icon: Calculator },
    { text: 'Creating your milestone timeline...', icon: CalendarClock },
    { text: 'Preparing your vendor checklist...', icon: ClipboardCheck },
    { text: 'Personalizing creative celebration concepts...', icon: Sparkles },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isVisible, steps.length]);

  if (!isVisible) return null;

  const CurrentIcon = steps[currentStepIndex].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl border border-amber-100 text-center relative overflow-hidden">
        {/* Decorative ambient gradient */}
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-rose-400/20 rounded-full blur-2xl" />

        {/* Pulsing AI Icon */}
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 animate-ping opacity-25" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
            <CurrentIcon className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        {/* Gemini Powered Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 text-xs font-bold text-rose-800 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          <span>Gemini Intelligence Active</span>
        </div>

        {/* Primary Step Headline */}
        <h3 className="text-xl font-extrabold text-stone-900 min-h-[32px] transition-all">
          {steps[currentStepIndex].text}
        </h3>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 rounded-full h-2 my-5 overflow-hidden border border-stone-200">
          <div
            className="bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 h-2 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Steps List */}
        <div className="space-y-2 text-left mt-6 pt-4 border-t border-stone-100">
          {steps.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2.5 text-xs font-medium transition-colors ${
                  isCurrent
                    ? 'text-amber-800 font-bold'
                    : isDone
                    ? 'text-emerald-700 line-through opacity-70'
                    : 'text-stone-400'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isCurrent
                      ? 'bg-amber-600 ring-4 ring-amber-200 animate-pulse'
                      : isDone
                      ? 'bg-emerald-500'
                      : 'bg-stone-300'
                  }`}
                />
                <span>{step.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

``

---

## src/components/PlanDashboard.tsx

``typescript
'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Briefcase,
  Lightbulb,
  Printer,
  Edit3,
  Send,
  Loader2,
  PartyPopper,
  ShieldAlert,
  ChevronRight,
  TrendingDown,
  Info,
  Palette,
} from 'lucide-react';
import { EventPlan, VendorStatus } from '@/types/event';

interface PlanDashboardProps {
  plan: EventPlan;
  onUpdatePlan: (updatedPlan: EventPlan) => void;
  onModifyRequirements: () => void;
  onPrint: () => void;
  isDemoSimulation?: boolean;
}

export const PlanDashboard: React.FC<PlanDashboardProps> = ({
  plan,
  onUpdatePlan,
  onModifyRequirements,
  onPrint,
  isDemoSimulation,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'budget' | 'timeline' | 'vendors' | 'ideas'>('overview');
  const [refinementInput, setRefinementInput] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);
  const [latestChangeSummary, setLatestChangeSummary] = useState<string | null>(plan.refinementNotes || null);

  // Quick suggestion chips for refinement
  const refinementPresets = [
    'Actually, reduce budget by 20% and adjust vendors.',
    'Change catering to pure vegan delicacies and eco-friendly decor.',
    'Add a live DJ and photo booth activity.',
    'Shift from indoor hall to an open outdoor lawn setup.'
  ];

  // Helper to convert relative timeframe to calendar date based on eventDate
  const calculateMilestoneDate = (timeframe: string, eventDateStr: string): string | null => {
    try {
      const eventDate = new Date(eventDateStr);
      if (isNaN(eventDate.getTime())) return null;

      const lower = timeframe.toLowerCase();
      let daysBefore = 0;

      if (lower.includes('6 week') || lower.includes('1.5 month')) daysBefore = 42;
      else if (lower.includes('4 week') || lower.includes('1 month')) daysBefore = 28;
      else if (lower.includes('3 week')) daysBefore = 21;
      else if (lower.includes('2 week')) daysBefore = 14;
      else if (lower.includes('1 week')) daysBefore = 7;
      else if (lower.includes('3 day')) daysBefore = 3;
      else if (lower.includes('2 day')) daysBefore = 2;
      else if (lower.includes('1 day') || lower.includes('eve')) daysBefore = 1;
      else if (lower.includes('event day') || lower.includes('day of')) daysBefore = 0;
      else return null;

      const target = new Date(eventDate);
      target.setDate(target.getDate() - daysBefore);

      return target.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return null;
    }
  };

  // Toggle vendor status
  const handleVendorStatusToggle = (index: number) => {
    const statuses: VendorStatus[] = ['Not Started', 'In Contact', 'Booked'];
    const currentStatus = plan.vendors[index].status;
    const nextStatusIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    const nextStatus = statuses[nextStatusIndex];

    const updatedVendors = [...plan.vendors];
    updatedVendors[index] = {
      ...updatedVendors[index],
      status: nextStatus
    };

    const updatedPlan: EventPlan = {
      ...plan,
      vendors: updatedVendors
    };

    onUpdatePlan(updatedPlan);
  };

  // Handle AI Refinement Submission
  const handleRefinementSubmit = async (instructionToUse?: string) => {
    const promptText = (instructionToUse || refinementInput).trim();
    if (!promptText) return;

    setIsRefining(true);
    setRefineError(null);

    try {
      const res = await fetch('/api/refine-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPlan: plan,
          formData: plan.formData,
          instruction: promptText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to refine event plan');
      }

      if (data.plan) {
        onUpdatePlan(data.plan);
        setLatestChangeSummary(data.changeSummary || `Updated according to: "${promptText}"`);
        setRefinementInput('');
      }
    } catch (err: any) {
      console.error('Error during AI refinement:', err);
      setRefineError(err.message || 'Could not refine plan. Please try again.');
    } finally {
      setIsRefining(false);
    }
  };

  const bookedVendorsCount = plan.vendors.filter((v) => v.status === 'Booked').length;
  const inContactVendorsCount = plan.vendors.filter((v) => v.status === 'In Contact').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Visual Demo Workflow Indicator */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white text-xs font-bold border border-stone-700 shadow-sm print:hidden">
        <div className="flex items-center gap-2 overflow-x-auto text-[11px] sm:text-xs">
          <span className="px-2 py-0.5 rounded-md bg-stone-700 text-stone-200">1. User Inputs</span>
          <span className="text-amber-400">âž”</span>
          <span className="px-2 py-0.5 rounded-md bg-rose-600/80 text-white flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" /> 2. Gemini Generated
          </span>
          <span className="text-amber-400">âž”</span>
          <span className="px-2 py-0.5 rounded-md bg-stone-700 text-stone-200">3. Personalized Plan</span>
          <span className="text-amber-400">âž”</span>
          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 font-black">4. AI Refinement Ready</span>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById('ask-utsav-ai-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="ml-3 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-extrabold text-[11px] shrink-0 cursor-pointer shadow-xs active:scale-95 transition-all"
        >
          âœ¨ Refine Plan
        </button>
      </div>

      {/* 1. Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden print:border-none print:shadow-none">
        {/* Decorative banner top */}
        <div className="h-3 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 print:hidden" />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  <span>Powered by Gemini</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
                  {plan.formData.eventType}
                </span>
                <span className="px-3 py-1 rounded-full bg-stone-100 text-xs font-semibold text-stone-700">
                  {plan.formData.vibe} Vibe
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
                {plan.eventSummary.title}
              </h1>
              <p className="text-stone-600 mt-2 text-sm sm:text-base font-medium max-w-3xl">
                {plan.eventSummary.concept}
              </p>
            </div>

            {/* Quick Actions (Modify, Refine, Print) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0 print:hidden">
              <button
                onClick={() => {
                  const el = document.getElementById('ask-utsav-ai-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask Utsav AI</span>
              </button>
              <button
                onClick={onModifyRequirements}
                className="px-3.5 py-2.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-stone-500" />
                <span>Modify</span>
              </button>
              <button
                onClick={onPrint}
                className="px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Key Metrics Strip (Immediate High Impact Financial & Event Visibility) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
            {/* Date */}
            <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-1">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Event Date</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-stone-900">
                {new Date(plan.formData.eventDate).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>

            {/* Location & Guests */}
            <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-1">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Scale & City</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-stone-900 truncate">
                {plan.formData.guests} Guests â€¢ {plan.formData.location.split(',')[0]}
              </div>
            </div>

            {/* Total Budget */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-800 mb-1">
                <span className="flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-amber-700" />
                  <span>Total Budget</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded">
                  â‚¹{Math.round(plan.budget.totalBudget / Math.max(1, plan.formData.guests))}/head
                </span>
              </div>
              <div className="text-base sm:text-lg font-black text-amber-900">
                â‚¹{plan.budget.totalBudget.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Allocated & Remaining Reserve */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 mb-1">
                <span>Estimated Spend</span>
                <span className="text-[10px] font-bold text-emerald-700">
                  Buffer: â‚¹{plan.budget.remaining.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-base sm:text-lg font-black text-emerald-900">
                â‚¹{plan.budget.estimatedTotal.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Unrealistic Budget Edge-Case Alert Banner */}
      {plan.budgetFeasibility?.isUnrealistic && (
        <div className="p-6 rounded-3xl bg-amber-50/90 border-2 border-amber-300 text-amber-950 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-200/80 text-amber-900 shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-800" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-amber-950 flex items-center gap-2">
                <span>Budget Caution: Requirements May Exceed Market Rates</span>
              </h3>
              <p className="mt-1 text-sm text-amber-900 leading-relaxed font-medium">
                {plan.budgetFeasibility.warningMessage ||
                  'Your current requirements may exceed the available budget for standard celebrations in this location.'}
              </p>

              {/* Gemini Suggested Alternatives */}
              {plan.budgetFeasibility.suggestions.length > 0 && (
                <div className="mt-4 pt-3 border-t border-amber-200/70">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
                    ðŸ’¡ Gemini Recommended Strategic Adjustments:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-amber-900">
                    {plan.budgetFeasibility.suggestions.map((sug, i) => (
                      <li key={i} className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-amber-200/60">
                        <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Refinement Change Explanation Banner */}
      {latestChangeSummary && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 shadow-xs flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
              AI Refinement Applied
            </p>
            <p className="text-sm font-semibold text-emerald-900 mt-0.5">
              {latestChangeSummary}
            </p>
          </div>
        </div>
      )}

      {/* 4. Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto print:hidden">
        {[
          { key: 'overview', label: 'OVERVIEW', icon: Lightbulb },
          { key: 'budget', label: 'BUDGET', icon: IndianRupee },
          { key: 'timeline', label: 'TIMELINE', icon: Clock },
          { key: 'vendors', label: 'VENDORS', icon: Briefcase },
          { key: 'ideas', label: 'IDEAS', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.key === 'vendors' && (
                <span className="ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-800">
                  {bookedVendorsCount}/{plan.vendors.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 5. TAB CONTENTS */}

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                <span>Event Concept & Atmosphere</span>
              </h3>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-600" /> Gemini Curated Concept
              </span>
            </div>
            <p className="text-stone-700 text-base leading-relaxed">
              {plan.eventSummary.description}
            </p>

            <div className="mt-6 pt-6 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-1">
                  Why this fits your request
                </h4>
                <p className="text-sm text-stone-800">
                  Designed explicitly for {plan.formData.guests} guests in {plan.formData.location} with a {plan.formData.vibe.toLowerCase()} aesthetic and a {plan.formData.foodPreference.toLowerCase()} menu, maximizing cultural joy within â‚¹{plan.budget.totalBudget.toLocaleString('en-IN')}.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800 mb-1">
                  Core Theme Highlight
                </h4>
                <p className="text-sm font-semibold text-amber-950">
                  {plan.ideas.theme}
                </p>
              </div>
            </div>
          </div>

          {/* Risks & Mitigation */}
          {plan.risks && plan.risks.length > 0 && (
            <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-extrabold text-stone-900 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>Contingency & Risk Management</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plan.risks.map((risk, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-800 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-xs">
                      {idx + 1}
                    </span>
                    <span>{risk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: BUDGET */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          {/* Budget Overview Card */}
          <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-extrabold text-stone-900">Financial Allocation & Estimates</h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" /> Gemini Dynamic Allocation
              </span>
            </div>

            {/* Three key figures */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Budget</p>
                <p className="text-2xl font-black text-stone-900 mt-1">
                  â‚¹{plan.budget.totalBudget.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
                <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Estimated Spending</p>
                <p className="text-2xl font-black text-rose-950 mt-1">
                  â‚¹{plan.budget.estimatedTotal.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Remaining Buffer</p>
                <p className="text-2xl font-black text-emerald-950 mt-1">
                  â‚¹{plan.budget.remaining.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Visual Segmented Bar */}
            <div className="mt-4 mb-8">
              <div className="flex justify-between text-xs font-bold text-stone-600 mb-2">
                <span>Budget Utilization ({Math.min(100, Math.round((plan.budget.estimatedTotal / plan.budget.totalBudget) * 100))}%)</span>
                <span>Buffer Reserve: â‚¹{plan.budget.remaining.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-stone-100 flex overflow-hidden border border-stone-200">
                {plan.budget.categories.map((cat, i) => {
                  const percent = (cat.estimatedAmount / plan.budget.totalBudget) * 100;
                  const colors = [
                    'bg-amber-500',
                    'bg-rose-500',
                    'bg-orange-500',
                    'bg-emerald-500',
                    'bg-indigo-500',
                    'bg-purple-500'
                  ];
                  return (
                    <div
                      key={i}
                      className={`${colors[i % colors.length]} h-full transition-all`}
                      style={{ width: `${percent}%` }}
                      title={`${cat.name}: â‚¹${cat.estimatedAmount.toLocaleString('en-IN')} (${percent.toFixed(1)}%)`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Detailed Categories */}
            <h4 className="text-sm font-bold uppercase tracking-wider text-stone-600 mb-4">
              Category Allocations & Rationale
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.budget.categories.map((cat, i) => {
                const percent = ((cat.estimatedAmount / plan.budget.totalBudget) * 100).toFixed(1);
                return (
                  <div key={i} className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-stone-900 text-sm">{cat.name}</span>
                        <div className="text-right">
                          <span className="font-black text-stone-900 text-base">
                            â‚¹{cat.estimatedAmount.toLocaleString('en-IN')}
                          </span>
                          <span className="ml-1.5 text-xs font-bold text-stone-500">
                            ({percent}%)
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {cat.reason}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Saving Suggestions */}
            {plan.budget.savingSuggestions && plan.budget.savingSuggestions.length > 0 && (
              <div className="mt-8 p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <h4 className="font-extrabold text-sm text-emerald-950 flex items-center gap-2 mb-3">
                  <TrendingDown className="w-4 h-4 text-emerald-700" />
                  <span>Smart Cost-Saving Opportunities</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-emerald-900">
                  {plan.budget.savingSuggestions.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span>Smart Milestone Timeline</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                  Targeted preparation schedule leading up to{' '}
                  {new Date(plan.formData.eventDate).toLocaleDateString('en-IN', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" /> Gemini Milestone Schedule
              </span>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:h-full before:w-0.5 before:bg-stone-200">
              {plan.timeline.map((mile, idx) => {
                const calendarDate = calculateMilestoneDate(mile.timeframe, plan.formData.eventDate);
                return (
                  <div key={idx} className="relative pl-10">
                    {/* Timeline bullet */}
                    <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 -translate-x-1/2 rounded-full border-2 border-white bg-amber-600 ring-4 ring-amber-100" />

                    <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/80 border border-stone-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                        <span className="font-extrabold text-stone-900 text-sm sm:text-base">
                          {mile.timeframe}
                        </span>
                        {calendarDate && (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 self-start sm:self-auto">
                            ðŸ“… {calendarDate}
                          </span>
                        )}
                      </div>

                      <ul className="space-y-2">
                        {mile.tasks.map((task, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                            <input
                              type="checkbox"
                              id={`task_${idx}_${tIdx}`}
                              className="mt-0.5 rounded-md border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                            />
                            <label htmlFor={`task_${idx}_${tIdx}`} className="cursor-pointer select-none">
                              {task}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB: VENDORS */}
      {activeTab === 'vendors' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-amber-600" />
                  <span>Vendor Coordination Checklist</span>
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> AI Checklist
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Click any status badge to toggle between Not Started, In Contact, and Booked.
              </p>
            </div>

            {/* Vendor summary counter */}
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                âœ… {bookedVendorsCount} Booked
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                ðŸ“ž {inContactVendorsCount} In Contact
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.vendors.map((vendor, idx) => {
              const isBooked = vendor.status === 'Booked';
              const isInContact = vendor.status === 'In Contact';

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isBooked
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : isInContact
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-stone-50/60 border-stone-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-stone-900 text-sm">
                          {vendor.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          vendor.priority === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : vendor.priority === 'Low'
                            ? 'bg-stone-200 text-stone-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {vendor.priority} Priority
                        </span>
                      </div>

                      {/* Interactive Status Button */}
                      <button
                        type="button"
                        onClick={() => handleVendorStatusToggle(idx)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
                          isBooked
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : isInContact
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        }`}
                        title="Click to toggle status"
                      >
                        {vendor.status} â†»
                      </button>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed mt-2">
                      <strong className="text-stone-800">What to look for:</strong> {vendor.whatToLookFor}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: IDEAS */}
      {activeTab === 'ideas' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 flex items-center gap-1.5 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>Gemini Curated Aesthetics & Programming</span>
              </span>
              <h3 className="text-xl font-extrabold text-stone-900 mt-2">
                Theme: {plan.ideas.theme}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Decor */}
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200">
                <h4 className="font-extrabold text-sm text-amber-950 flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-amber-700" />
                  <span>Decor & Ambience Palette</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                  {plan.ideas.decor.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">â€¢</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Food */}
              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200">
                <h4 className="font-extrabold text-sm text-rose-950 flex items-center gap-2 mb-3">
                  <PartyPopper className="w-4 h-4 text-rose-700" />
                  <span>Culinary & Beverage Highlights</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                  {plan.ideas.food.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">â€¢</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Entertainment */}
              <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200">
                <h4 className="font-extrabold text-sm text-indigo-950 flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-indigo-700" />
                  <span>Entertainment & Music</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                  {plan.ideas.entertainment.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">â€¢</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Activities */}
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                <h4 className="font-extrabold text-sm text-emerald-950 flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>Interactive Guest Activities</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                  {plan.ideas.activities.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">â€¢</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. AI REFINEMENT AREA ("Ask Utsav AI") â€” CRITICAL COMPETITION FEATURE */}
      <div id="ask-utsav-ai-section" className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-stone-700 print:hidden scroll-mt-20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
                Ask Utsav AI â€” Refine & Adapt Plan
              </h3>
              <p className="text-xs sm:text-sm text-stone-300">
                Instruct Gemini to adjust your budget, rework catering, modify theme, or reallocate funds dynamically.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
            Live Gemini Refinement
          </span>
        </div>

        {/* Refine Error */}
        {refineError && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{refineError}</span>
          </div>
        )}

        {/* Form Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRefinementSubmit();
          }}
          className="mt-4"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. Actually, my budget is only â‚¹40,000. Adjust the plan."
              value={refinementInput}
              onChange={(e) => setRefinementInput(e.target.value)}
              disabled={isRefining}
              className="flex-1 px-4 py-3.5 rounded-2xl bg-stone-800/90 border border-stone-600 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
            <button
              type="submit"
              disabled={isRefining || !refinementInput.trim()}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isRefining ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini Thinking...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Update Plan</span>
                </>
              )}
            </button>
          </div>

          {/* Preset Refinement Quick Chips */}
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <span className="text-[11px] text-stone-400 font-semibold">
              Try quick prompt:
            </span>
            {refinementPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setRefinementInput(preset);
                  handleRefinementSubmit(preset);
                }}
                disabled={isRefining}
                className="text-[11px] px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-all cursor-pointer text-left"
              >
                "{preset}"
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

``

---

## src/components/SavedPlansModal.tsx

``typescript
'use client';

import React from 'react';
import { X, Calendar, IndianRupee, Users, Trash2, ArrowRight, FolderOpen } from 'lucide-react';
import { EventPlan } from '@/types/event';

interface SavedPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: EventPlan[];
  onSelectPlan: (plan: EventPlan) => void;
  onDeletePlan: (id: string) => void;
}

export const SavedPlansModal: React.FC<SavedPlansModalProps> = ({
  isOpen,
  onClose,
  plans,
  onSelectPlan,
  onDeletePlan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-lg">Saved Event Plans</h3>
              <p className="text-xs text-stone-500">
                Stored locally in your browserâ€™s localStorage ({plans.length} total)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Plans List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {plans.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="font-medium text-sm">No saved celebration plans yet.</p>
              <p className="text-xs text-stone-400 mt-1">
                Generate an event plan to have it automatically stored here!
              </p>
            </div>
          ) : (
            plans.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl border border-stone-200 hover:border-amber-300 bg-stone-50/50 hover:bg-amber-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-stone-700 border border-stone-200">
                      {p.formData.eventType}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Created {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                    {p.eventSummary.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 mt-1.5 font-medium">
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                      â‚¹{p.budget.totalBudget.toLocaleString('en-IN')}
                    </span>
                    <span>â€¢</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      {p.formData.guests} Guests
                    </span>
                    <span>â€¢</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-600" />
                      {p.formData.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectPlan(p);
                      onClose();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Open Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeletePlan(p.id)}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

``

---

## test_qa_suite.js

``javascript
// Comprehensive QA Test Suite for UtsavPilot
const BASE_URL = 'http://localhost:3000';

async function runQASuite() {
  console.log('====================================================');
  console.log('       UTSAVPILOT AUTOMATED QA PASS SUITE           ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  âœ… PASS: ${message}`);
      passed++;
    } else {
      console.error(`  âŒ FAIL: ${message}`);
      failed++;
    }
  }

  // --- TEST 1: Birthday, 50 guests, â‚¹50,000, Vegetarian, Colorful ---
  console.log('â–¶ [TEST 1] Birthday (50 guests, â‚¹50,000, Vegetarian, Colorful)');
  try {
    const res1 = await fetch(`${BASE_URL}/api/generate-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formData: {
          eventType: 'Birthday',
          eventDate: '2026-11-15',
          location: 'Bengaluru, Karnataka',
          guests: 50,
          budget: 50000,
          vibe: 'Colorful',
          foodPreference: 'Vegetarian',
          notes: 'Special balloon arch and vegetarian snack platter'
        }
      })
    });
    assert(res1.status === 200, 'HTTP status is 200');
    const data1 = await res1.json();
    assert(data1.plan && data1.plan.eventSummary, 'Event summary is present');
    assert(data1.plan.budget.totalBudget === 50000, 'Budget matches â‚¹50,000');
    
    // Check budget math
    const catSum1 = data1.plan.budget.categories.reduce((acc, c) => acc + c.estimatedAmount, 0);
    assert(catSum1 === data1.plan.budget.estimatedTotal, `Category sum (â‚¹${catSum1}) equals estimatedTotal (â‚¹${data1.plan.budget.estimatedTotal})`);
    assert(data1.plan.budget.totalBudget - data1.plan.budget.estimatedTotal === data1.plan.budget.remaining, `Remaining amount (â‚¹${data1.plan.budget.remaining}) equals totalBudget - estimatedTotal`);
    assert(data1.plan.vendors.length >= 4, `Vendor checklist has ${data1.plan.vendors.length} vendor categories`);
    assert(data1.plan.timeline.length >= 3, `Timeline has ${data1.plan.timeline.length} milestone blocks`);
  } catch (e) {
    assert(false, `Test 1 threw error: ${e.message}`);
  }

  // --- TEST 2: Wedding, 150 guests, â‚¹2,00,000, Traditional ---
  console.log('\nâ–¶ [TEST 2] Wedding (150 guests, â‚¹2,00,000, Traditional)');
  try {
    const res2 = await fetch(`${BASE_URL}/api/generate-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formData: {
          eventType: 'Wedding',
          eventDate: '2026-12-20',
          location: 'Jaipur, Rajasthan',
          guests: 150,
          budget: 200000,
          vibe: 'Traditional',
          foodPreference: 'Vegetarian'
        }
      })
    });
    assert(res2.status === 200, 'HTTP status is 200');
    const data2 = await res2.json();
    assert(data2.plan.formData.eventType === 'Wedding', 'Event type is Wedding');
    assert(data2.plan.budget.totalBudget === 200000, 'Budget matches â‚¹2,00,000');
    assert(data2.plan.formData.guests === 150, 'Guest count is 150');
    const catSum2 = data2.plan.budget.categories.reduce((acc, c) => acc + c.estimatedAmount, 0);
    assert(catSum2 === data2.plan.budget.estimatedTotal, 'Category amounts sum exactly to estimatedTotal');
    assert(data2.plan.budget.remaining >= 0, 'Remaining reserve is non-negative');
  } catch (e) {
    assert(false, `Test 2 threw error: ${e.message}`);
  }

  // --- TEST 3: Community Event, 200 guests, â‚¹80,000 ---
  console.log('\nâ–¶ [TEST 3] Community Event (200 guests, â‚¹80,000)');
  try {
    const res3 = await fetch(`${BASE_URL}/api/generate-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formData: {
          eventType: 'Community Event',
          eventDate: '2026-11-25',
          location: 'Mumbai, Maharashtra',
          guests: 200,
          budget: 80000,
          vibe: 'Traditional',
          foodPreference: 'Vegetarian'
        }
      })
    });
    assert(res3.status === 200, 'HTTP status is 200');
    const data3 = await res3.json();
    assert(data3.plan.formData.eventType === 'Community Event', 'Event type is Community Event');
    assert(data3.plan.budget.totalBudget === 80000, 'Budget is â‚¹80,000');
    assert(data3.plan.formData.guests === 200, 'Guests is 200');
  } catch (e) {
    assert(false, `Test 3 threw error: ${e.message}`);
  }

  // --- TEST 4: Unrealistic: 200 guests, â‚¹10,000 ---
  console.log('\nâ–¶ [TEST 4] Edge Case - Unrealistic Budget (200 guests, â‚¹10,000)');
  try {
    const res4 = await fetch(`${BASE_URL}/api/generate-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formData: {
          eventType: 'Wedding',
          eventDate: '2026-12-10',
          location: 'Delhi NCR',
          guests: 200,
          budget: 10000,
          vibe: 'Elegant',
          foodPreference: 'Vegetarian'
        }
      })
    });
    assert(res4.status === 200, 'HTTP status is 200');
    const data4 = await res4.json();
    assert(data4.plan.budgetFeasibility && data4.plan.budgetFeasibility.isUnrealistic === true, 'Feasibility correctly flags isUnrealistic: true');
    assert(data4.plan.budgetFeasibility.warningMessage.includes('exceed the available budget'), 'Warning message informs user about budget limit');
    assert(Array.isArray(data4.plan.budgetFeasibility.suggestions) && data4.plan.budgetFeasibility.suggestions.length >= 3, 'Suggestions array contains actionable alternatives');
  } catch (e) {
    assert(false, `Test 4 threw error: ${e.message}`);
  }

  // --- TEST 5: Invalid / missing form fields ---
  console.log('\nâ–¶ [TEST 5] Validation of Missing / Invalid Form Fields');
  try {
    // Missing eventType
    const res5a = await fetch(`${BASE_URL}/api/generate-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData: { eventDate: '2026-11-10', location: 'Mumbai', guests: 50, budget: 50000 } })
    });
    assert(res5a.status === 400, 'Missing eventType returns 400 Bad Request');

    // Missing location
    const res5b = await fetch(`${BASE_URL}/api/generate-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData: { eventType: 'Birthday', eventDate: '2026-11-10', location: '', guests: 50, budget: 50000 } })
    });
    assert(res5b.status === 400, 'Empty location returns 400 Bad Request');

    // Invalid budget (<= 0)
    const res5c = await fetch(`${BASE_URL}/api/generate-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData: { eventType: 'Birthday', eventDate: '2026-11-10', location: 'Pune', guests: 50, budget: 0 } })
    });
    assert(res5c.status === 400, 'Zero budget returns 400 Bad Request');

    // Invalid guests (<= 0)
    const res5d = await fetch(`${BASE_URL}/api/generate-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData: { eventType: 'Birthday', eventDate: '2026-11-10', location: 'Pune', guests: -5, budget: 50000 } })
    });
    assert(res5d.status === 400, 'Negative guests returns 400 Bad Request');
  } catch (e) {
    assert(false, `Test 5 threw error: ${e.message}`);
  }

  // --- TEST 6: AI Refinement and API Error / Failure handling ---
  console.log('\nâ–¶ [TEST 6] AI Refinement & Error Handling');
  try {
    // Create base plan
    const genRes = await fetch(`${BASE_URL}/api/generate-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formData: {
          eventType: 'Birthday',
          eventDate: '2026-11-20',
          location: 'Hyderabad, Telangana',
          guests: 60,
          budget: 60000,
          vibe: 'Fun',
          foodPreference: 'Mixed'
        }
      })
    });
    const genData = await genRes.json();
    const currentPlan = genData.plan;

    // Refine plan with user instruction: change budget to â‚¹45,000
    const refineRes = await fetch(`${BASE_URL}/api/refine-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPlan,
        formData: currentPlan.formData,
        instruction: 'Actually, my budget is only â‚¹45,000. Adjust the plan.'
      })
    });
    assert(refineRes.status === 200, 'Refine endpoint returns 200 OK');
    const refineData = await refineRes.json();
    assert(refineData.plan.budget.totalBudget === 45000, 'Revised plan updated total budget to â‚¹45,000');
    assert(typeof refineData.changeSummary === 'string' && refineData.changeSummary.length > 0, 'Returned dynamic changeSummary explanation');
    const refinedCatSum = refineData.plan.budget.categories.reduce((acc, c) => acc + c.estimatedAmount, 0);
    assert(refinedCatSum === refineData.plan.budget.estimatedTotal, 'Refined categories sum equals estimatedTotal');
    assert(refineData.plan.budget.totalBudget - refineData.plan.budget.estimatedTotal === refineData.plan.budget.remaining, 'Refined remaining budget is mathematically exact');

    // Test refine failure when instruction is missing
    const emptyRefineRes = await fetch(`${BASE_URL}/api/refine-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPlan, instruction: '' })
    });
    assert(emptyRefineRes.status === 400, 'Empty instruction in refine-plan returns 400');
  } catch (e) {
    assert(false, `Test 6 threw error: ${e.message}`);
  }

  // --- TEST 7: Page Reload & LocalStorage Structure ---
  console.log('\nâ–¶ [TEST 7] Page Reload & LocalStorage Structure Verification');
  try {
    const resHome = await fetch(`${BASE_URL}/`);
    assert(resHome.status === 200, 'Homepage loaded with 200 OK');
    const html = await resHome.text();
    assert(html.includes('UTSAVPILOT'), 'HTML contains UTSAVPILOT branding');
    assert(html.includes('Plan the celebration. Weâ€™ll handle the complexity.'), 'HTML contains exact tagline');
    assert(html.includes('Budget-aware planning'), 'HTML contains Benefit 1');
    assert(html.includes('Smart timelines'), 'HTML contains Benefit 2');
    assert(html.includes('Personalized ideas'), 'HTML contains Benefit 3');
  } catch (e) {
    assert(false, `Test 7 threw error: ${e.message}`);
  }

  // --- TEST 8: Mobile Viewport & Responsiveness ---
  console.log('\nâ–¶ [TEST 8] Mobile Viewport & Responsive Meta Tags');
  try {
    const resLayout = await fetch(`${BASE_URL}/`);
    const layoutHtml = await resLayout.text();
    assert(layoutHtml.includes('viewport') && layoutHtml.includes('width=device-width'), 'Viewport meta tag is configured for mobile responsiveness');
    assert(layoutHtml.includes('overflow-x-auto') || layoutHtml.includes('grid-cols-1'), 'Responsive grid and scrolling tokens exist');
  } catch (e) {
    assert(false, `Test 8 threw error: ${e.message}`);
  }

  console.log('\n====================================================');
  console.log(`TOTAL PASSES: ${passed} | TOTAL FAILURES: ${failed}`);
  console.log('====================================================');
  process.exit(failed > 0 ? 1 : 0);
}

runQASuite();

``

---

