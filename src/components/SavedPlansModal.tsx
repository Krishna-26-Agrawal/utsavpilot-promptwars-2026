'use client';

import React from 'react';
import { X, Calendar, IndianRupee, Users, Trash2, ArrowRight, FolderOpen } from 'lucide-react';
import { EventPlan } from '@/types/event';

interface SavedPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: EventPlan[];
  onSelectPlan: (plan: EventPlan) => void;
  onDeletePlan: (id: string) => void;
}

export const SavedPlansModal: React.FC<SavedPlansModalProps> = ({
  isOpen,
  onClose,
  plans,
  onSelectPlan,
  onDeletePlan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-lg">Saved Event Plans</h3>
              <p className="text-xs text-stone-500">
                Stored locally in your browser’s localStorage ({plans.length} total)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Plans List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {plans.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="font-medium text-sm">No saved celebration plans yet.</p>
              <p className="text-xs text-stone-400 mt-1">
                Generate an event plan to have it automatically stored here!
              </p>
            </div>
          ) : (
            plans.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl border border-stone-200 hover:border-amber-300 bg-stone-50/50 hover:bg-amber-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-stone-700 border border-stone-200">
                      {p.formData.eventType}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Created {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                    {p.eventSummary.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 mt-1.5 font-medium">
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                      ₹{p.budget.totalBudget.toLocaleString('en-IN')}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      {p.formData.guests} Guests
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-600" />
                      {p.formData.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectPlan(p);
                      onClose();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Open Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeletePlan(p.id)}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
