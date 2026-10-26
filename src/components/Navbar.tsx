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
              Plan the celebration. We’ll handle the complexity.
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
