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

      const budgetMatch = instruction.match(/(?:budget|₹|rs\.?)\s*(\d[\d,]*)/i) || instruction.match(/(\d[\d,]*)\s*(?:budget|inr|rupees)/i);
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
          changeExplanation = `Budget re-calibrated from ₹${oldBudget.toLocaleString('en-IN')} to ₹${rawNum.toLocaleString('en-IN')}. Proportional category expenses adjusted while preserving core celebration vendor slots.`;
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
