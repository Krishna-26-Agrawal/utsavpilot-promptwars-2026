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
    `Consider increasing your budget from ₹${formData.budget.toLocaleString('en-IN')} to around ₹${Math.max(formData.budget * 1.5, formData.guests * minRealisticPerGuest).toLocaleString('en-IN')} for full vendor coverage.`
  ];

  return {
    isUnrealistic,
    warningMessage: isUnrealistic 
      ? `Your current requirements (₹${formData.budget.toLocaleString('en-IN')} for ${formData.guests} guests, ~₹${Math.round(perGuestBudget)}/guest) may exceed the available budget in ${formData.location || 'your area'}.`
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
- Total Budget: ₹${formData.budget} INR
- Style / Vibe: ${formData.vibe} ${formData.customVibe ? `(${formData.customVibe})` : ''}
- Food Preference: ${formData.foodPreference}
- Notes: ${formData.notes || 'None'}

${feasibility.isUnrealistic ? `IMPORTANT CONTEXT: The budget is very tight (₹${formData.budget} for ${formData.guests} guests). Acknowledge this constraint realistically. Allocate funds judiciously to essentials and provide actionable cost-saving strategies.` : ''}

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
- Current Budget: ₹${currentPlan.budget.totalBudget} INR
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
4. Add a top-level string field called "changeSummary" that explicitly describes what you changed in 2-3 concise sentences (e.g. "Budget reduced from ₹50,000 to ₹40,000. Reallocated venue and decor budgets while preserving the live entertainment and dinner menu.").

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
      description: `Designed for ${formData.guests} esteemed guests in ${formData.location || 'your chosen venue'}. The plan balances a ${formData.foodPreference.toLowerCase()} feast, captivating ${formData.vibe.toLowerCase()} aesthetics, and cost-effective vendor arrangements within ₹${formData.budget.toLocaleString('en-IN')}.`
    },
    budget: {
      totalBudget: formData.budget,
      estimatedTotal,
      remaining,
      categories: [
        {
          name: 'Catering & Beverages',
          estimatedAmount: cateringCost,
          reason: `Covers ${formData.foodPreference} menu for ${formData.guests} guests at ~₹${Math.round(cateringCost / Math.max(1, formData.guests))}/plate.`
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
