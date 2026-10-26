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
