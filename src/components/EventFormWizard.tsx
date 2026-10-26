'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Utensils,
  Palette,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { EventFormData, EventType, EventVibe, FoodPreference } from '@/types/event';

interface EventFormWizardProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (formData: EventFormData) => void;
  isLoading: boolean;
}

export const EventFormWizard: React.FC<EventFormWizardProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const [eventType, setEventType] = useState<EventType>(initialData?.eventType || 'Birthday');
  const [customEventType, setCustomEventType] = useState<string>(initialData?.customEventType || '');
  const [eventDate, setEventDate] = useState<string>(initialData?.eventDate || '2026-11-20');
  const [location, setLocation] = useState<string>(initialData?.location || 'Bengaluru, Karnataka');

  React.useEffect(() => {
    if (!initialData?.eventDate) {
      setEventDate(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
    }
  }, [initialData?.eventDate]);
  const [guests, setGuests] = useState<number>(initialData?.guests || 50);
  const [budget, setBudget] = useState<number>(initialData?.budget || 60000);
  const [vibe, setVibe] = useState<EventVibe>(initialData?.vibe || 'Fun');
  const [customVibe, setCustomVibe] = useState<string>(initialData?.customVibe || '');
  const [foodPreference, setFoodPreference] = useState<FoodPreference>(
    initialData?.foodPreference || 'Vegetarian'
  );
  const [notes, setNotes] = useState<string>(initialData?.notes || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Quick preset locations
  const popularLocations = ['Mumbai', 'Bengaluru', 'Delhi NCR', 'Jaipur', 'Hyderabad', 'Pune'];

  const eventTypes: EventType[] = ['Birthday', 'Wedding', 'Community Event', 'Other'];
  const vibes: EventVibe[] = ['Elegant', 'Fun', 'Traditional', 'Modern', 'Colorful', 'Minimal', 'Custom'];
  const foodPreferences: FoodPreference[] = ['Vegetarian', 'Non-vegetarian', 'Vegan', 'Mixed'];

  // Calculate per guest metric
  const perGuest = guests > 0 ? Math.round(budget / guests) : 0;
  const isBudgetVeryTight = perGuest < 300;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validations
    if (!location.trim()) {
      setValidationError('Please enter an event location or city.');
      return;
    }
    if (!eventDate) {
      setValidationError('Please select an event date.');
      return;
    }
    if (guests <= 0 || isNaN(guests)) {
      setValidationError('Please enter a valid number of guests (at least 1).');
      return;
    }
    if (budget <= 0 || isNaN(budget)) {
      setValidationError('Please specify a valid budget in INR.');
      return;
    }
    if (eventType === 'Other' && !customEventType.trim()) {
      setValidationError('Please describe the custom event type.');
      return;
    }
    if (vibe === 'Custom' && !customVibe.trim()) {
      setValidationError('Please describe your custom style or vibe preference.');
      return;
    }

    const payload: EventFormData = {
      eventType,
      customEventType: eventType === 'Other' ? customEventType.trim() : undefined,
      eventDate,
      location: location.trim(),
      guests,
      budget,
      vibe,
      customVibe: vibe === 'Custom' ? customVibe.trim() : undefined,
      foodPreference,
      notes: notes.trim() || undefined,
    };

    onSubmit(payload);
  };

  return (
    <div id="event-form" className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-10">
        {/* Form Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Event Planning Wizard
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Step 1 of 1 • Takes 1 minute
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
            Tell us about your celebration
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Gemini will craft a personalized event concept, dynamic budget, vendor checklist, and timeline.
          </p>

          {/* Quick Competition Scenario Buttons */}
          <div className="mt-4 p-3 rounded-2xl bg-stone-50 border border-stone-200">
            <p className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider mb-2">
              ⚡ 1-Click Competition Scenarios:
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setEventType('Birthday');
                  setGuests(50);
                  setBudget(50000);
                  setFoodPreference('Vegetarian');
                  setVibe('Colorful');
                  setLocation('Bengaluru, Karnataka');
                  setNotes('Balloon arch, customized cake, and eco-friendly return favors.');
                }}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-100 text-stone-800 font-bold border border-stone-200 shadow-2xs transition-colors cursor-pointer"
              >
                🎂 50k Birthday (Test 1)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEventType('Wedding');
                  setGuests(150);
                  setBudget(200000);
                  setFoodPreference('Vegetarian');
                  setVibe('Traditional');
                  setLocation('Jaipur, Rajasthan');
                  setNotes('Marigold decor, live sitar/shehnai, royal banquet.');
                }}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-100 text-stone-800 font-bold border border-stone-200 shadow-2xs transition-colors cursor-pointer"
              >
                💍 2 Lakh Wedding (Test 2)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEventType('Community Event');
                  setGuests(200);
                  setBudget(80000);
                  setFoodPreference('Vegetarian');
                  setVibe('Traditional');
                  setLocation('Mumbai, Maharashtra');
                  setNotes('Clubhouse hall, rangoli, lantern lighting, and snack stalls.');
                }}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-100 text-stone-800 font-bold border border-stone-200 shadow-2xs transition-colors cursor-pointer"
              >
                🪔 80k Community (Test 3)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEventType('Wedding');
                  setGuests(200);
                  setBudget(10000);
                  setFoodPreference('Vegetarian');
                  setVibe('Elegant');
                  setLocation('Delhi NCR');
                  setNotes('Testing Gemini edge case feasibility detection.');
                }}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold border border-rose-200 shadow-2xs transition-colors cursor-pointer"
              >
                ⚠️ 10k Edge Case (Test 4)
              </button>
            </div>
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Incomplete Information</p>
              <p className="text-rose-700 mt-0.5">{validationError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Event Type */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Event Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {eventTypes.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setEventType(type)}
                  className={`py-3 px-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                    eventType === type
                      ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-700'
                  }`}
                >
                  {type === 'Birthday' && '🎂 Birthday'}
                  {type === 'Wedding' && '💍 Wedding'}
                  {type === 'Community Event' && '🪔 Community'}
                  {type === 'Other' && '✨ Other'}
                </button>
              ))}
            </div>

            {eventType === 'Other' && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Specify event (e.g. Baby Shower, Retirement, Housewarming)"
                  value={customEventType}
                  onChange={(e) => setCustomEventType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  required
                />
              </div>
            )}
          </div>

          {/* 2. Date & Location Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Event Date */}
            <div>
              <label className="block text-sm font-bold text-stone-900 mb-2">
                Event Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={eventDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-stone-800"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-stone-900 mb-2">
                City / Location <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Maharashtra"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-stone-800"
                  required
                />
              </div>
              {/* Quick location chips */}
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {popularLocations.map((loc) => (
                  <button
                    type="button"
                    key={loc}
                    onClick={() => setLocation(loc)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Guests & Budget in INR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Number of Guests */}
            <div>
              <label className="block text-sm font-bold text-stone-900 mb-2">
                Number of Guests <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={guests || ''}
                  onChange={(e) => setGuests(parseInt(e.target.value, 10) || 0)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold text-stone-800"
                  required
                />
              </div>
              <div className="mt-1.5 flex gap-1.5">
                {[30, 50, 100, 200, 500].map((count) => (
                  <button
                    type="button"
                    key={count}
                    onClick={() => setGuests(count)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget in INR */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-stone-900">
                  Total Budget in INR (₹) <span className="text-rose-500">*</span>
                </label>
                {perGuest > 0 && (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isBudgetVeryTight ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    ₹{perGuest.toLocaleString('en-IN')}/guest
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="font-bold text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  ₹
                </span>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={budget || ''}
                  onChange={(e) => setBudget(parseInt(e.target.value, 10) || 0)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-bold text-stone-800"
                  required
                />
              </div>
              <div className="mt-1.5 flex gap-1.5">
                {[25000, 50000, 100000, 250000, 500000].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setBudget(amt)}
                    className="text-[11px] px-1.5 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                  >
                    ₹{(amt / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Budget Alert Preview (Edge case awareness) */}
          {isBudgetVeryTight && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Tight Budget Detected:</strong> At ~₹{perGuest}/guest, UtsavPilot will automatically inject strategic cost-saving measures and realistic vendor recommendations.
              </span>
            </div>
          )}

          {/* 4. Style / Vibe */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Style / Vibe <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {vibes.map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setVibe(v)}
                  className={`py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    vibe === v
                      ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-700'
                  }`}
                >
                  {v === 'Elegant' && '✨ Elegant'}
                  {v === 'Fun' && '🎉 Fun'}
                  {v === 'Traditional' && '🪔 Traditional'}
                  {v === 'Modern' && '🏙️ Modern'}
                  {v === 'Colorful' && '🎨 Colorful'}
                  {v === 'Minimal' && '🌿 Minimal'}
                  {v === 'Custom' && '✏️ Custom'}
                </button>
              ))}
            </div>

            {vibe === 'Custom' && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Describe your custom vibe (e.g. Bollywood Retro, Eco-friendly Rustic, Royal Rajasthani)"
                  value={customVibe}
                  onChange={(e) => setCustomVibe(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  required
                />
              </div>
            )}
          </div>

          {/* 5. Food Preference */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Food Preference <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {foodPreferences.map((pref) => (
                <button
                  type="button"
                  key={pref}
                  onClick={() => setFoodPreference(pref)}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                    foodPreference === pref
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-700'
                  }`}
                >
                  {pref === 'Vegetarian' && '🥗 Pure Veg'}
                  {pref === 'Non-vegetarian' && '🍗 Non-Veg'}
                  {pref === 'Vegan' && '🌱 Vegan'}
                  {pref === 'Mixed' && '🍲 Mixed Menu'}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Optional Notes */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Special Wishes / Notes <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Senior-friendly venue, acoustic instrumentalist, eco-friendly floral decor, no single-use plastics"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-stone-800 resize-none"
            />
          </div>

          {/* Primary Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 hover:from-amber-700 hover:to-rose-700 text-white font-extrabold text-lg shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/35 transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>✨ Generate My Event Plan</span>
            </button>
            <p className="text-center text-xs text-stone-500 mt-2.5">
              Powered by Google Gemini • Tailored line items in INR • Saved locally in your browser
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
