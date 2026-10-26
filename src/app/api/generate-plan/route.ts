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

    // Evaluate budget feasibility (Edge case handling: e.g. ₹10,000 for 200 guests)
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
