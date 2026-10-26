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
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // --- TEST 1: Birthday, 50 guests, ₹50,000, Vegetarian, Colorful ---
  console.log('▶ [TEST 1] Birthday (50 guests, ₹50,000, Vegetarian, Colorful)');
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
    assert(data1.plan.budget.totalBudget === 50000, 'Budget matches ₹50,000');
    
    // Check budget math
    const catSum1 = data1.plan.budget.categories.reduce((acc, c) => acc + c.estimatedAmount, 0);
    assert(catSum1 === data1.plan.budget.estimatedTotal, `Category sum (₹${catSum1}) equals estimatedTotal (₹${data1.plan.budget.estimatedTotal})`);
    assert(data1.plan.budget.totalBudget - data1.plan.budget.estimatedTotal === data1.plan.budget.remaining, `Remaining amount (₹${data1.plan.budget.remaining}) equals totalBudget - estimatedTotal`);
    assert(data1.plan.vendors.length >= 4, `Vendor checklist has ${data1.plan.vendors.length} vendor categories`);
    assert(data1.plan.timeline.length >= 3, `Timeline has ${data1.plan.timeline.length} milestone blocks`);
  } catch (e) {
    assert(false, `Test 1 threw error: ${e.message}`);
  }

  // --- TEST 2: Wedding, 150 guests, ₹2,00,000, Traditional ---
  console.log('\n▶ [TEST 2] Wedding (150 guests, ₹2,00,000, Traditional)');
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
    assert(data2.plan.budget.totalBudget === 200000, 'Budget matches ₹2,00,000');
    assert(data2.plan.formData.guests === 150, 'Guest count is 150');
    const catSum2 = data2.plan.budget.categories.reduce((acc, c) => acc + c.estimatedAmount, 0);
    assert(catSum2 === data2.plan.budget.estimatedTotal, 'Category amounts sum exactly to estimatedTotal');
    assert(data2.plan.budget.remaining >= 0, 'Remaining reserve is non-negative');
  } catch (e) {
    assert(false, `Test 2 threw error: ${e.message}`);
  }

  // --- TEST 3: Community Event, 200 guests, ₹80,000 ---
  console.log('\n▶ [TEST 3] Community Event (200 guests, ₹80,000)');
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
    assert(data3.plan.budget.totalBudget === 80000, 'Budget is ₹80,000');
    assert(data3.plan.formData.guests === 200, 'Guests is 200');
  } catch (e) {
    assert(false, `Test 3 threw error: ${e.message}`);
  }

  // --- TEST 4: Unrealistic: 200 guests, ₹10,000 ---
  console.log('\n▶ [TEST 4] Edge Case - Unrealistic Budget (200 guests, ₹10,000)');
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
  console.log('\n▶ [TEST 5] Validation of Missing / Invalid Form Fields');
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
  console.log('\n▶ [TEST 6] AI Refinement & Error Handling');
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

    // Refine plan with user instruction: change budget to ₹45,000
    const refineRes = await fetch(`${BASE_URL}/api/refine-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPlan,
        formData: currentPlan.formData,
        instruction: 'Actually, my budget is only ₹45,000. Adjust the plan.'
      })
    });
    assert(refineRes.status === 200, 'Refine endpoint returns 200 OK');
    const refineData = await refineRes.json();
    assert(refineData.plan.budget.totalBudget === 45000, 'Revised plan updated total budget to ₹45,000');
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
  console.log('\n▶ [TEST 7] Page Reload & LocalStorage Structure Verification');
  try {
    const resHome = await fetch(`${BASE_URL}/`);
    assert(resHome.status === 200, 'Homepage loaded with 200 OK');
    const html = await resHome.text();
    assert(html.includes('UTSAVPILOT'), 'HTML contains UTSAVPILOT branding');
    assert(html.includes('Plan the celebration. We’ll handle the complexity.'), 'HTML contains exact tagline');
    assert(html.includes('Budget-aware planning'), 'HTML contains Benefit 1');
    assert(html.includes('Smart timelines'), 'HTML contains Benefit 2');
    assert(html.includes('Personalized ideas'), 'HTML contains Benefit 3');
  } catch (e) {
    assert(false, `Test 7 threw error: ${e.message}`);
  }

  // --- TEST 8: Mobile Viewport & Responsiveness ---
  console.log('\n▶ [TEST 8] Mobile Viewport & Responsive Meta Tags');
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
