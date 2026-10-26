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
          <span className="text-amber-400">➔</span>
          <span className="px-2 py-0.5 rounded-md bg-rose-600/80 text-white flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" /> 2. Gemini Generated
          </span>
          <span className="text-amber-400">➔</span>
          <span className="px-2 py-0.5 rounded-md bg-stone-700 text-stone-200">3. Personalized Plan</span>
          <span className="text-amber-400">➔</span>
          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 font-black">4. AI Refinement Ready</span>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById('ask-utsav-ai-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="ml-3 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-extrabold text-[11px] shrink-0 cursor-pointer shadow-xs active:scale-95 transition-all"
        >
          ✨ Refine Plan
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
                {plan.formData.guests} Guests • {plan.formData.location.split(',')[0]}
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
                  ₹{Math.round(plan.budget.totalBudget / Math.max(1, plan.formData.guests))}/head
                </span>
              </div>
              <div className="text-base sm:text-lg font-black text-amber-900">
                ₹{plan.budget.totalBudget.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Allocated & Remaining Reserve */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 mb-1">
                <span>Estimated Spend</span>
                <span className="text-[10px] font-bold text-emerald-700">
                  Buffer: ₹{plan.budget.remaining.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-base sm:text-lg font-black text-emerald-900">
                ₹{plan.budget.estimatedTotal.toLocaleString('en-IN')}
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
                    💡 Gemini Recommended Strategic Adjustments:
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
                  Designed explicitly for {plan.formData.guests} guests in {plan.formData.location} with a {plan.formData.vibe.toLowerCase()} aesthetic and a {plan.formData.foodPreference.toLowerCase()} menu, maximizing cultural joy within ₹{plan.budget.totalBudget.toLocaleString('en-IN')}.
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
                  ₹{plan.budget.totalBudget.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
                <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Estimated Spending</p>
                <p className="text-2xl font-black text-rose-950 mt-1">
                  ₹{plan.budget.estimatedTotal.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Remaining Buffer</p>
                <p className="text-2xl font-black text-emerald-950 mt-1">
                  ₹{plan.budget.remaining.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Visual Segmented Bar */}
            <div className="mt-4 mb-8">
              <div className="flex justify-between text-xs font-bold text-stone-600 mb-2">
                <span>Budget Utilization ({Math.min(100, Math.round((plan.budget.estimatedTotal / plan.budget.totalBudget) * 100))}%)</span>
                <span>Buffer Reserve: ₹{plan.budget.remaining.toLocaleString('en-IN')}</span>
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
                      title={`${cat.name}: ₹${cat.estimatedAmount.toLocaleString('en-IN')} (${percent.toFixed(1)}%)`}
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
                            ₹{cat.estimatedAmount.toLocaleString('en-IN')}
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
                            📅 {calendarDate}
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
                ✅ {bookedVendorsCount} Booked
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                📞 {inContactVendorsCount} In Contact
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
                        {vendor.status} ↻
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
                      <span className="text-amber-600 font-bold">•</span>
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
                      <span className="text-rose-600 font-bold">•</span>
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
                      <span className="text-indigo-600 font-bold">•</span>
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
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. AI REFINEMENT AREA ("Ask Utsav AI") — CRITICAL COMPETITION FEATURE */}
      <div id="ask-utsav-ai-section" className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-stone-700 print:hidden scroll-mt-20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
                Ask Utsav AI — Refine & Adapt Plan
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
              placeholder="e.g. Actually, my budget is only ₹40,000. Adjust the plan."
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
