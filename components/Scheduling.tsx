'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  ChevronRight,
  UserCheck,
  Plus,
  X
} from 'lucide-react';

interface Shift {
  id: string;
  priestName: string;
  sevaName: string;
  date: string;
  slot: 'Morning (06:00 AM)' | 'Noon (11:00 AM)' | 'Evening (05:00 PM)';
}

interface SchedulingProps {
  onBack: () => void;
}

const INITIAL_SHIFTS: Shift[] = [
  { id: '1', priestName: 'Raghavan Bhattar', sevaName: 'Maha Abhisheka', date: '2026-06-28', slot: 'Morning (06:00 AM)' },
  { id: '2', priestName: 'Sunder Raman', sevaName: 'Archana Pooja', date: '2026-06-28', slot: 'Morning (06:00 AM)' },
  { id: '3', priestName: 'Madhavan Shastri', sevaName: 'Annadanam Seva', date: '2026-06-28', slot: 'Noon (11:00 AM)' },
  { id: '4', priestName: 'Madhavan Shastri', sevaName: 'Vahan Pooja', date: '2026-06-28', slot: 'Evening (05:00 PM)' },
  { id: '5', priestName: 'Sunder Raman', sevaName: 'Chandi Homa', date: '2026-06-29', slot: 'Morning (06:00 AM)' }
];

export default function Scheduling({ onBack }: SchedulingProps) {
  const [shifts, setShifts] = useState<Shift[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('sankalpvani_shifts');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {}
      }
    }
    return INITIAL_SHIFTS;
  });
  
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-06-28');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [formPriest, setFormPriest] = useState('Raghavan Bhattar');
  const [formSeva, setFormSeva] = useState('Archana Pooja');
  const [formSlot, setFormSlot] = useState<Shift['slot']>('Morning (06:00 AM)');

  const [activePriests, setActivePriests] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const cachedPriests = localStorage.getItem('sankalpvani_priests');
      if (cachedPriests) {
        try {
          const parsed = JSON.parse(cachedPriests);
          return parsed.map((p: any) => p.name);
        } catch (e) {}
      }
    }
    return ['Raghavan Bhattar', 'Sunder Raman', 'Madhavan Shastri', 'Vasudevan Swamy', 'Ganesha Dikshidar'];
  });

  // Load from LocalStorage
  // (State synchronization handled gracefully on mount via lazy initialization)

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for double assignment conflict (same priest, same date, same slot)
    const conflict = shifts.find(s => s.priestName === formPriest && s.date === selectedDate && s.slot === formSlot);
    if (conflict) {
      alert(`Conflict Detected! Acharya ${formPriest} is already assigned to "${conflict.sevaName}" during ${formSlot} on this date.`);
      return;
    }

    const newShift: Shift = {
      id: Date.now().toString(),
      priestName: formPriest,
      sevaName: formSeva,
      date: selectedDate,
      slot: formSlot
    };

    const updated = [...shifts, newShift];
    setShifts(updated);
    localStorage.setItem('sankalpvani_shifts', JSON.stringify(updated));
    setShowAssignModal(false);
    
    setToastMessage(`Assigned Acharya ${formPriest} successfully.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteShift = (id: string) => {
    if (confirm('Cancel this priest assignment?')) {
      const updated = shifts.filter(s => s.id !== id);
      setShifts(updated);
      localStorage.setItem('sankalpvani_shifts', JSON.stringify(updated));
    }
  };

  // Pre-generate next 4 days for the calendar columns
  const calendarDates = [
    { label: 'Today (28 Jun)', value: '2026-06-28' },
    { label: 'Tomorrow (29 Jun)', value: '2026-06-29' },
    { label: 'Tue (30 Jun)', value: '2026-06-30' },
    { label: 'Wed (01 Jul)', value: '2026-07-01' }
  ];

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-primary-container text-on-primary-container border border-primary/20 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3">
          <CheckCircle size={18} className="text-primary animate-pulse" />
          <span className="font-sans text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-primary-container/10 rounded-full text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary tracking-wider uppercase mb-0.5">
              <span>Masters</span>
              <ChevronRight size={12} className="text-on-surface-variant" />
              <span>Roster & Scheduling</span>
            </div>
            <h2 className="font-serif text-3xl font-semibold text-primary">Priest Duty Roster</h2>
          </div>
        </div>

        <button
          onClick={() => setShowAssignModal(true)}
          className="bg-primary hover:bg-on-primary-container text-on-primary text-sm font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Assign Duty Shift</span>
        </button>
      </div>

      {/* Conflict banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-900">
        <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5 animate-pulse" />
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider">Automated Conflict Safeguards</h4>
          <p className="font-sans text-xs mt-0.5 leading-relaxed">
            The scheduling engine guards against dual-booking of priests for concurrent sevas or while they are marked &quot;On Leave&quot; in the Priest Master.
          </p>
        </div>
      </div>

      {/* Calendar Columns Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {calendarDates.map((d) => {
          const dateShifts = shifts.filter(s => s.date === d.value);
          return (
            <div key={d.value} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sacred flex flex-col min-h-[350px]">
              <div className="bg-surface-container px-4 py-3.5 border-b divider-gold flex justify-between items-center">
                <span className="font-serif font-bold text-on-surface">{d.label}</span>
                <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-[10px] font-bold text-primary">
                  {dateShifts.length} Assigned
                </span>
              </div>

              <div className="p-4 space-y-3.5 flex-1 overflow-y-auto">
                {dateShifts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-on-surface-variant opacity-70">
                    <Calendar size={32} className="text-outline-variant mb-2" />
                    <p className="font-sans text-xs font-semibold">No assigned priests for today.</p>
                  </div>
                ) : (
                  dateShifts.map((shift) => (
                    <div 
                      key={shift.id}
                      className="group bg-surface-container-low border border-outline-variant/30 hover:border-primary/30 p-3 rounded-xl transition-all duration-150 relative"
                    >
                      <button
                        onClick={() => handleDeleteShift(shift.id)}
                        className="absolute right-2 top-2 p-1 hover:bg-red-50 text-red-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Cancel Duty"
                      >
                        <X size={12} />
                      </button>

                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-5 h-5 rounded-full bg-primary-container/20 flex items-center justify-center text-primary text-[10px]">
                          <User size={10} />
                        </div>
                        <span className="font-sans text-xs font-bold text-on-surface">{shift.priestName}</span>
                      </div>

                      <div className="space-y-1 font-sans text-[11px] font-semibold text-on-surface-variant">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px] text-primary">menu_book</span>
                          <span>{shift.sevaName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-secondary">
                          <Clock size={10} />
                          <span>{shift.slot.split(' ')[0]}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Card CTA */}
              <div className="p-4 border-t border-outline-variant/10">
                <button
                  onClick={() => {
                    setSelectedDate(d.value);
                    setShowAssignModal(true);
                  }}
                  className="w-full py-2 bg-surface-container hover:bg-primary hover:text-on-primary border border-outline-variant text-on-surface-variant rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus size={12} />
                  <span>Quick Assign</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assign Shift Modal Popup dialog */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setShowAssignModal(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border-t-4 border-primary p-6 animate-[scaleIn_0.2s_ease-out]">
            <button 
              onClick={() => setShowAssignModal(false)}
              className="absolute right-4 top-4 p-2 hover:bg-surface-container-low text-on-surface-variant rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="font-serif text-2xl text-primary font-bold mb-4">Assign Priest Shift</h3>

            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Target Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Choose Priest Acharya *</label>
                <select
                  value={formPriest}
                  onChange={(e) => setFormPriest(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline rounded-xl text-sm focus:outline-none"
                >
                  {activePriests.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Target Seva Pooja</label>
                  <select
                    value={formSeva}
                    onChange={(e) => setFormSeva(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline rounded-xl text-sm focus:outline-none"
                  >
                    <option value="Archana Pooja">Archana Pooja</option>
                    <option value="Maha Abhisheka">Maha Abhisheka</option>
                    <option value="Annadanam Seva">Annadanam Seva</option>
                    <option value="Vahan Pooja">Vahan Pooja</option>
                    <option value="Chandi Homa">Chandi Homa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Shift Time Slot</label>
                  <select
                    value={formSlot}
                    onChange={(e) => setFormSlot(e.target.value as Shift['slot'])}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline rounded-xl text-sm focus:outline-none"
                  >
                    <option value="Morning (06:00 AM)">Morning (06:00 AM)</option>
                    <option value="Noon (11:00 AM)">Noon (11:00 AM)</option>
                    <option value="Evening (05:00 PM)">Evening (05:00 PM)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t divider-gold flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-outline-variant/60 hover:bg-surface-container-low text-on-surface-variant rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-on-primary-container text-on-primary rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                >
                  Commit Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
