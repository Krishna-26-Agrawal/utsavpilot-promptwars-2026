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
                      ₹{activePlan.budget.totalBudget.toLocaleString('en-IN')} • {activePlan.formData.guests} Guests
                    </p>
                  </div>
                  <button
                    onClick={() => setView('dashboard')}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Open Dashboard →
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
            <span>— Virtual PromptWars 2026 by Hack2Skill</span>
          </div>
          <p className="text-stone-400">
            Powered by Google Gemini • Built for Indian Celebrations
          </p>
        </div>
      </footer>
    </div>
  );
}
