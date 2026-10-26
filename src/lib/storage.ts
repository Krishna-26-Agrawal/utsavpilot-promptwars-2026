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
