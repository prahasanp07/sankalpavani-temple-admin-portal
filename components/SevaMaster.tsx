'use client';

import React, { useState, useEffect } from 'react';
import TimeRangePicker from './TimeRangePicker';
import {
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  ArrowLeft,
  Sparkles,
  BookOpen,
  ChevronRight,
  Info,
  Clock
} from 'lucide-react';

interface Seva {
  id: string;
  name: string;
  price: number;
  capacity: number;
  type: 'Daily' | 'Weekly' | 'Monthly' | 'Dhanur Masa' | 'Special';
  isActive: boolean;
  personsPerSeva?: number;
  extraPersonCost?: number;
  aboutSeva?: string;
  instructions?: string;
  timeRange?: string;
}

interface SevaMasterProps {
  onBack: () => void;
}

const DEFAULT_SEVAS: Seva[] = [
  { id: '1', name: 'Archana Pooja', price: 101, capacity: 200, type: 'Daily', isActive: true, timeRange: '06:00 AM - 08:30 PM' },
  { id: '2', name: 'Maha Abhisheka', price: 1500, capacity: 5, type: 'Weekly', isActive: true, timeRange: '06:00 AM - 08:00 AM' },
  { id: '3', name: 'Annadanam Seva', price: 2100, capacity: 10, type: 'Daily', isActive: true, timeRange: '12:00 PM - 02:30 PM' },
  { id: '4', name: 'Vahan Pooja', price: 1100, capacity: 15, type: 'Daily', isActive: true, timeRange: '09:00 AM - 05:00 PM' },
  { id: '5', name: 'Chandi Homa', price: 5001, capacity: 1, type: 'Special', isActive: true, timeRange: '07:00 AM - 11:30 AM' },
  { id: '6', name: 'Sahasranama Archana', price: 501, capacity: 50, type: 'Monthly', isActive: true, timeRange: '05:30 PM - 07:00 PM' }
];

export default function SevaMaster({ onBack }: SevaMasterProps) {
  const [sevas, setSevas] = useState<Seva[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('sankalpvani_sevas');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) { }
      }
    }
    return DEFAULT_SEVAS;
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Seva | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New Seva Form State
  const [newSeva, setNewSeva] = useState({
    name: '',
    price: 150,
    capacity: 20,
    type: 'Daily' as Seva['type'],
    isActive: true,
    personsPerSeva: 1,
    extraPersonCost: 0,
    aboutSeva: '',
    instructions: '',
    timeRange: '06:00 AM - 12:30 PM'
  });

  // Load from LocalStorage
  useEffect(() => {
    const cached = localStorage.getItem('sankalpvani_sevas');
    if (!cached) {
      localStorage.setItem('sankalpvani_sevas', JSON.stringify(DEFAULT_SEVAS));
    }
  }, []);

  const saveToStorage = (updated: Seva[]) => {
    setSevas(updated);
    localStorage.setItem('sankalpvani_sevas', JSON.stringify(updated));
  };

  const handleStartEdit = (seva: Seva) => {
    setEditingId(seva.id);
    setEditForm({ ...seva });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSaveEdit = () => {
    if (!editForm) return;
    const updated = sevas.map(s => s.id === editForm.id ? editForm : s);
    saveToStorage(updated);
    setEditingId(null);
    setEditForm(null);
  };

  const handleAddSeva = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeva.name.trim()) return;

    const added: Seva = {
      id: Date.now().toString(),
      name: newSeva.name,
      price: Number(newSeva.price) || 0,
      capacity: Number(newSeva.capacity) || 1,
      type: newSeva.type,
      isActive: true,
      personsPerSeva: Number(newSeva.personsPerSeva) || 1,
      extraPersonCost: Number(newSeva.extraPersonCost) || 0,
      aboutSeva: newSeva.aboutSeva || '',
      instructions: newSeva.instructions || '',
      timeRange: newSeva.timeRange || '06:00 AM - 12:30 PM'
    };

    const updated = [...sevas, added];
    saveToStorage(updated);

    setNewSeva({
      name: '',
      price: 150,
      capacity: 20,
      type: 'Daily',
      isActive: true,
      personsPerSeva: 1,
      extraPersonCost: 0,
      aboutSeva: '',
      instructions: '',
      timeRange: '06:00 AM - 12:30 PM'
    });
    setShowAddForm(false);
  };

  const handleDeleteSeva = (id: string) => {
    if (confirm('Are you sure you want to retire this seva offering? Existing bookings remain in history.')) {
      const updated = sevas.filter(s => s.id !== id);
      saveToStorage(updated);
    }
  };

  const toggleActive = (id: string) => {
    const updated = sevas.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s);
    saveToStorage(updated);
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
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
              <span>Seva/Pooja Master</span>
            </div>
            <h2 className="font-serif text-3xl font-semibold text-primary">Seva offerings Setup</h2>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary hover:bg-on-primary-container text-on-primary text-sm font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>{showAddForm ? 'Close Setup Form' : 'Register New Seva'}</span>
        </button>
      </div>

      {/* Inline Registration Form */}
      {showAddForm && (
        <form onSubmit={handleAddSeva} className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 shadow-sm space-y-4 animate-[scaleIn_0.15s_ease-out]">
          <h3 className="font-serif text-xl font-bold text-primary flex items-center gap-2">
            <BookOpen size={18} />
            New Seva Booking Definition
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Seva Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Swarna Pushpa Archana"
                value={newSeva.name}
                onChange={(e) => setNewSeva({ ...newSeva, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-outline rounded-xl text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">No. of Persons per Seva *</label>
              <input
                type="number"
                required
                min={1}
                value={newSeva.personsPerSeva}
                onChange={(e) => setNewSeva({ ...newSeva, personsPerSeva: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-white border border-outline rounded-xl text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Price (₹) *</label>
              <input
                type="number"
                required
                min={1}
                value={newSeva.price}
                onChange={(e) => setNewSeva({ ...newSeva, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-white border border-outline rounded-xl text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Extra Person Cost (₹)</label>
              <input
                type="number"
                min={0}
                value={newSeva.extraPersonCost}
                onChange={(e) => setNewSeva({ ...newSeva, extraPersonCost: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-white border border-outline rounded-xl text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Daily Slot Capacity</label>
              <input
                type="number"
                required
                min={1}
                value={newSeva.capacity}
                onChange={(e) => setNewSeva({ ...newSeva, capacity: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-white border border-outline rounded-xl text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">About Seva</label>
              <textarea
                rows={3}
                placeholder="Describe the significance and process of this seva..."
                value={newSeva.aboutSeva}
                onChange={(e) => setNewSeva({ ...newSeva, aboutSeva: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-outline rounded-xl text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Instructions</label>
              <textarea
                rows={3}
                placeholder="Dress code, report time guidelines, items to bring..."
                value={newSeva.instructions}
                onChange={(e) => setNewSeva({ ...newSeva, instructions: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-outline rounded-xl text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Time Range Selector for Seva Perform Timing */}
          <div className="border-t divider-gold pt-4">
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Pooja Performance Timings</h4>
            <div className="max-w-md bg-white p-4 rounded-2xl border border-outline-variant/35 shadow-sm">
              <TimeRangePicker
                value={newSeva.timeRange}
                onChange={(val) => setNewSeva({ ...newSeva, timeRange: val })}
                label="Seva Duration / Performance Timing"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t divider-gold">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Seva Type:</span>
              <div className="flex gap-2 flex-wrap">
                {(['Daily', 'Weekly', 'Monthly', 'Special', 'Dhanur Masa'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setNewSeva({ ...newSeva, type: t })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${newSeva.type === t
                        ? 'bg-primary-container/20 text-primary border-primary'
                        : 'bg-white border-outline-variant text-on-surface-variant hover:border-primary'
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-primary hover:bg-on-primary-container text-on-primary text-xs font-bold rounded-xl shadow-sm cursor-pointer animate-[scaleIn_0.15s_ease-out]"
            >
              Add Definition
            </button>
          </div>
        </form>
      )}

      {/* Main Seva offerings list */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sacred border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b divider-gold text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                <th className="py-4 px-6">Offering ID</th>
                <th className="py-4 px-6">Ritual Offering Name</th>
                <th className="py-4 px-6">Category Type</th>
                <th className="py-4 px-6">Price Ticket (₹)</th>
                <th className="py-4 px-6 text-center">Daily Limit Capacity</th>
                <th className="py-4 px-6 text-center">Status Offer</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-on-surface divide-y divide-outline-variant/10">
              {sevas.map((s) => {
                const isEditing = editingId === s.id;
                return (
                  <tr key={s.id} className="hover:bg-surface-container-low/20 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-primary font-bold">
                      #SV-SV-{s.id.padStart(3, '0')}
                    </td>

                    <td className="py-4 px-6 min-w-[200px]">
                      {isEditing && editForm ? (
                        <div className="space-y-2 py-1">
                          <div>
                            <label className="text-[10px] text-on-surface-variant font-bold block mb-0.5">Seva Name</label>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full px-2.5 py-1 bg-white border border-outline rounded-lg text-sm font-bold focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-on-surface-variant font-bold block mb-0.5">Perform Timings</label>
                            <input
                              type="text"
                              value={editForm.timeRange ?? ''}
                              onChange={(e) => setEditForm({ ...editForm, timeRange: e.target.value })}
                              className="w-full px-2.5 py-1 bg-white border border-outline rounded-lg text-xs font-semibold focus:outline-none focus:border-primary font-mono"
                              placeholder="e.g. 06:00 AM - 12:30 PM"
                            />
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            <div>
                              <label className="text-[10px] text-on-surface-variant font-bold block mb-0.5">No. of Persons</label>
                              <input
                                type="number"
                                min={1}
                                value={editForm.personsPerSeva ?? 1}
                                onChange={(e) => setEditForm({ ...editForm, personsPerSeva: Number(e.target.value) })}
                                className="w-full px-2.5 py-1 bg-white border border-outline rounded-lg text-xs focus:outline-none focus:border-primary"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] text-on-surface-variant font-bold block mb-0.5">About Seva</label>
                            <textarea
                              value={editForm.aboutSeva ?? ''}
                              onChange={(e) => setEditForm({ ...editForm, aboutSeva: e.target.value })}
                              className="w-full px-2.5 py-1 bg-white border border-outline rounded-lg text-xs focus:outline-none focus:border-primary"
                              rows={1}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-on-surface-variant font-bold block mb-0.5">Instructions</label>
                            <textarea
                              value={editForm.instructions ?? ''}
                              onChange={(e) => setEditForm({ ...editForm, instructions: e.target.value })}
                              className="w-full px-2.5 py-1 bg-white border border-outline rounded-lg text-xs focus:outline-none focus:border-primary"
                              rows={1}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5 py-1">
                          <span className="font-bold text-on-surface block text-sm">{s.name}</span>
                          {s.timeRange && (
                            <span className="text-[10px] text-primary bg-primary-container/20 px-2 py-0.5 border border-primary/10 rounded-full font-semibold flex items-center gap-1.5 w-fit">
                              <Clock size={11} className="text-primary shrink-0" /> {s.timeRange}
                            </span>
                          )}
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {s.personsPerSeva && (
                              <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">
                                {s.personsPerSeva} {s.personsPerSeva === 1 ? 'person' : 'persons'} max
                              </span>
                            )}
                          </div>
                          {s.aboutSeva && (
                            <p className="text-xs text-on-surface-variant/80 font-normal leading-relaxed max-w-sm">
                              {s.aboutSeva}
                            </p>
                          )}
                          {s.instructions && (
                            <p className="text-[11px] text-on-surface-variant/65 italic leading-relaxed max-w-sm">
                              <span className="font-bold not-italic text-[10px] text-on-surface-variant/85 uppercase">Instr:</span> {s.instructions}
                            </p>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {isEditing && editForm ? (
                        <select
                          value={editForm.type}
                          onChange={(e) => setEditForm({ ...editForm, type: e.target.value as Seva['type'] })}
                          className="px-2 py-1 bg-white border border-outline rounded-lg text-sm focus:outline-none focus:border-primary"
                        >
                          <option value="Daily">Daily</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Special">Special</option>
                          <option value="Dhanur Masa">Dhanur Masa</option>
                        </select>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-surface-container-high border border-outline-variant/20 text-xs font-semibold text-on-surface-variant">
                          {s.type}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {isEditing && editForm ? (
                        <div className="space-y-2 py-1">
                          <div>
                            <label className="text-[10px] text-on-surface-variant font-bold block mb-0.5">Base Price</label>
                            <input
                              type="number"
                              min={0}
                              value={editForm.price}
                              onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                              className="w-24 px-2 py-1 bg-white border border-outline rounded-lg text-sm focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-on-surface-variant font-bold block mb-0.5">Extra Person</label>
                            <input
                              type="number"
                              min={0}
                              value={editForm.extraPersonCost ?? 0}
                              onChange={(e) => setEditForm({ ...editForm, extraPersonCost: Number(e.target.value) })}
                              className="w-24 px-2 py-1 bg-white border border-outline rounded-lg text-sm focus:outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="font-bold text-on-surface block text-sm">₹{s.price.toLocaleString()}</span>
                          {s.extraPersonCost && s.extraPersonCost > 0 ? (
                            <span className="text-[10px] text-on-surface-variant/75 font-medium block whitespace-nowrap">
                              +₹{s.extraPersonCost.toLocaleString()}/extra person
                            </span>
                          ) : null}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6 text-center">
                      {isEditing && editForm ? (
                        <input
                          type="number"
                          value={editForm.capacity}
                          onChange={(e) => setEditForm({ ...editForm, capacity: Number(e.target.value) })}
                          className="w-16 px-2 py-1 bg-white border border-outline rounded-lg text-sm text-center"
                        />
                      ) : (
                        <span className="font-mono text-xs font-bold text-on-surface-variant">
                          {s.capacity} bookings/day
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => toggleActive(s.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border cursor-pointer ${s.isActive
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                      >
                        {s.isActive ? 'Active' : 'Suspended'}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={handleSaveEdit}
                            className="p-1 hover:bg-green-100 text-green-700 rounded-lg transition-colors cursor-pointer"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 hover:bg-red-100 text-red-700 rounded-lg transition-colors cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleStartEdit(s)}
                            className="p-1.5 hover:bg-primary-container/10 text-primary rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteSeva(s.id)}
                            className="p-1.5 hover:bg-error-container text-error rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seva guidelines alert info banner */}
      <div className="bg-primary-container/10 border border-primary/20 p-4 rounded-xl flex gap-3">
        <Info className="text-primary shrink-0" size={18} />
        <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
          <strong>Setup Compliance:</strong> Changing the ticket price of any seva will instantly propagate to the live online booking terminal. Existing pre-booked receipts will remain valid at their purchase values. Daily slot capacity limit resets automatically at midnight IST.
        </p>
      </div>
    </div>
  );
}
