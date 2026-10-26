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
