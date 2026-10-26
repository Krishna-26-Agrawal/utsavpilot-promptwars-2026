'use client';

import React from 'react';
import { ArrowRight, IndianRupee, Clock, Sparkles, AlertTriangle } from 'lucide-react';
import { EventFormData } from '@/types/event';

interface LandingHeroProps {
  onStartPlanning: () => void;
  onSelectSample: (sample: EventFormData) => void;
}

interface SamplePreset {
  title: string;
  subtitle: string;
  tag: string;
  badge?: string;
  daysAhead: number;
  data: Omit<EventFormData, 'eventDate'>;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartPlanning,
  onSelectSample,
}) => {
  const samplePresets: SamplePreset[] = [
    {
      title: 'Aarav’s 1st Birthday Party',
      subtitle: '50 Guests • ₹50,000 • Pure Veg • Colorful',
      tag: '₹50k • 50 Guests',
      badge: 'TEST 1',
      daysAhead: 21,
      data: {
        eventType: 'Birthday',
        location: 'Bengaluru, Karnataka',
        guests: 50,
        budget: 50000,
        vibe: 'Colorful',
        foodPreference: 'Vegetarian',
        notes: 'Balloon arch, magic show, customized cake, and eco-friendly return favors.'
      }
    },
    {
      title: 'Meera & Rohan’s Royal Wedding',
      subtitle: '150 Guests • ₹2,00,000 • Traditional Rajasthani',
      tag: '₹2 Lakh • 150 Guests',
      badge: 'TEST 2',
      daysAhead: 45,
      data: {
        eventType: 'Wedding',
        location: 'Jaipur, Rajasthan',
        guests: 150,
        budget: 200000,
        vibe: 'Traditional',
        foodPreference: 'Vegetarian',
        notes: 'Marigold floral decor, live sitar/shehnai, royal banquet, and candid photography.'
      }
    },
    {
      title: 'Gokuldham Community Diwali Utsav',
      subtitle: '200 Guests • ₹80,000 • Society Celebration',
      tag: '₹80k • 200 Guests',
      badge: 'TEST 3',
      daysAhead: 30,
      data: {
        eventType: 'Community Event',
        location: 'Mumbai, Maharashtra',
        guests: 200,
        budget: 80000,
        vibe: 'Traditional',
        foodPreference: 'Vegetarian',
        notes: 'Clubhouse venue, rangoli competition, lantern lighting, and live snack stalls.'
      }
    },
    {
      title: 'Edge Case: Tight Budget Celebration',
      subtitle: '200 Guests • ₹10,000 (Tests AI Feasibility Alert)',
      tag: '₹10k • 200 Guests',
      badge: 'TEST 4 (EDGE CASE)',
      daysAhead: 25,
      data: {
        eventType: 'Wedding',
        location: 'Delhi NCR',
        guests: 200,
        budget: 10000,
        vibe: 'Elegant',
        foodPreference: 'Vegetarian',
        notes: 'Testing Gemini edge-case budget feasibility detection.'
      }
    }
  ];

  const handlePresetClick = (preset: SamplePreset) => {
    const computedDate = new Date(Date.now() + preset.daysAhead * 86400000)
      .toISOString()
      .split('T')[0];
    onSelectSample({
      ...preset.data,
      eventDate: computedDate,
    });
  };

  return (
    <div className="relative overflow-hidden py-10 md:py-16">
      {/* Background celebration glow elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-200/40 via-rose-200/30 to-orange-100/40 blur-3xl -z-10 pointer-events-none rounded-full" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
          <span>GenAI Celebration & Event Planner</span>
          <span className="text-stone-300">•</span>
          <span className="text-amber-700">Powered by Gemini</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.15]">
          Plan the celebration.{' '}
          <span className="bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 bg-clip-text text-transparent">
            We’ll handle the complexity.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
          UtsavPilot turns your event idea into a personalized, budget-aware plan in seconds.
        </p>

        {/* Primary CTA */}
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartPlanning}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 hover:from-amber-700 hover:to-rose-700 text-white font-extrabold text-base shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/35 transition-all flex items-center justify-center gap-2 group active:scale-95 cursor-pointer"
          >
            <span>Create My Event</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 1-Click Interactive Judge Demos (Unbeatable for a 4-minute demo) */}
        <div className="mt-10 p-5 rounded-2xl bg-white/90 border border-stone-200/90 shadow-sm text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-extrabold tracking-wider text-stone-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>⚡ 4-Minute Demo Presets (1-Click Fill & Test):</span>
            </span>
            <span className="text-[11px] text-stone-500 font-medium hidden sm:inline">
              Populates full form instantly
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {samplePresets.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetClick(sample)}
                className="p-3 rounded-xl bg-stone-50 hover:bg-amber-50/70 border border-stone-200/80 hover:border-amber-300 text-left transition-all group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-stone-200 text-stone-800">
                      {sample.badge}
                    </span>
                    <span className="text-[10px] font-bold text-amber-700">
                      {sample.tag}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                    {sample.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                    {sample.subtitle}
                  </p>
                </div>
                <div className="mt-2.5 flex items-center text-[11px] font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform">
                  <span>Load scenario</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Three Core Benefits */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          {/* Benefit 1 */}
          <div className="bg-white/80 p-5 rounded-2xl border border-stone-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 mb-3">
              <IndianRupee className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-stone-900">Budget-aware planning</h3>
            <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
              Transparent INR cost breakdowns, realistic per-plate estimates, and intelligent money-saving recommendations.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white/80 p-5 rounded-2xl border border-stone-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-700 mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-stone-900">Smart timelines</h3>
            <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
              Step-by-step milestone checklists scheduled backwards from your celebration date so you never miss a deadline.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white/80 p-5 rounded-2xl border border-stone-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-700 mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-stone-900">Personalized ideas</h3>
            <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
              Tailored cultural themes, decor palettes, curated culinary spreads, and engaging guest activities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
