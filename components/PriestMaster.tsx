'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Check, 
  Phone, 
  ArrowLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface Priest {
  id: string;
  name: string;
  role: string;
  specialization: string;
  mobile: string;
  status: 'Active' | 'On Leave' | 'Duty-Assign';
  avatarColor: string;
}

interface PriestMasterProps {
  onBack: () => void;
}

const DEFAULT_PRIESTS: Priest[] = [
  { id: '1', name: 'Raghavan Bhattar', role: 'Chief Priest', specialization: 'Maha Rudrabhishek, Chandi Homa', mobile: '+91 98450 12345', status: 'Active', avatarColor: 'bg-primary text-on-primary' },
  { id: '2', name: 'Sunder Raman', role: 'Senior Pujari', specialization: 'Sathyanarayana Puja, Vivaha', mobile: '+91 98450 67890', status: 'Active', avatarColor: 'bg-secondary text-on-secondary' },
  { id: '3', name: 'Madhavan Shastri', role: 'Archaka', specialization: 'Archana, Upanayana, Vahan Puja', mobile: '+91 97321 44556', status: 'Duty-Assign', avatarColor: 'bg-tertiary text-on-tertiary' },
  { id: '4', name: 'Vasudevan Swamy', role: 'Pujari', specialization: 'Daily Alankara, Abhisheka', mobile: '+91 99001 22334', status: 'On Leave', avatarColor: 'bg-[#735c00] text-white' },
  { id: '5', name: 'Ganesha Dikshidar', role: 'Rigveda specialist', specialization: 'Veda Parayana, Homam', mobile: '+91 98888 77766', status: 'Active', avatarColor: 'bg-secondary-fixed-dim text-on-secondary-fixed' }
];

export default function PriestMaster({ onBack }: PriestMasterProps) {
  const [priests, setPriests] = useState<Priest[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('sankalpvani_priests');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {}
      }
    }
    return DEFAULT_PRIESTS;
  });
  
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New priest form state
  const [newPriest, setNewPriest] = useState({
    name: '',
    role: 'Pujari',
    specialization: '',
    mobile: '',
    status: 'Active' as const
  });

  // Load from LocalStorage or fallback
  useEffect(() => {
    const cached = localStorage.getItem('sankalpvani_priests');
    if (!cached) {
      localStorage.setItem('sankalpvani_priests', JSON.stringify(DEFAULT_PRIESTS));
    }
  }, []);

  const saveToStorage = (updatedList: Priest[]) => {
    setPriests(updatedList);
    localStorage.setItem('sankalpvani_priests', JSON.stringify(updatedList));
  };

  const handleAddPriest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPriest.name.trim()) return;

    const colors = ['bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-[#735c00]', 'bg-secondary-fixed-dim'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const added: Priest = {
      id: Date.now().toString(),
      name: newPriest.name,
      role: newPriest.role,
      specialization: newPriest.specialization || 'General Rituals',
      mobile: newPriest.mobile || '+91 99000 00000',
      status: newPriest.status,
      avatarColor: `${randomColor} text-white`
    };

    const updated = [...priests, added];
    saveToStorage(updated);
    
    // Reset state & close modal
    setNewPriest({
      name: '',
      role: 'Pujari',
      specialization: '',
      mobile: '',
      status: 'Active'
    });
    setShowAddModal(false);
  };

  const handleDeletePriest = (id: string) => {
    if (confirm('Are you sure you want to remove this priest from the official registry?')) {
      const updated = priests.filter(p => p.id !== id);
      saveToStorage(updated);
    }
  };

  const toggleStatus = (id: string) => {
    const updated = priests.map(p => {
      if (p.id === id) {
        const nextStatus: Priest['status'] = p.status === 'Active' ? 'Duty-Assign' : p.status === 'Duty-Assign' ? 'On Leave' : 'Active';
        return { ...p, status: nextStatus };
      }
      return p;
    });
    saveToStorage(updated);
  };

  // Filter Logic
  const filteredPriests = priests.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.specialization.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === 'All' || p.role.toLowerCase() === selectedRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      {/* Navigation header */}
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
              <span>Priests Registry</span>
            </div>
            <h2 className="font-serif text-3xl font-semibold text-primary">Priest Master</h2>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-on-primary-container text-on-primary text-sm font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Priest</span>
        </button>
      </div>

      {/* Search & Filter bar */}
      <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
          <input
            type="text"
            placeholder="Search name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/75 border border-outline rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        {/* Custom tabs based styling */}
        <div className="flex gap-2 p-1 bg-white/60 rounded-xl border border-outline-variant/30 w-full md:w-auto overflow-x-auto hide-scrollbar">
          {['All', 'Chief Priest', 'Pujari', 'Archaka'].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedRole === role 
                  ? 'bg-primary text-on-primary shadow-sm' 
                  : 'text-on-surface-variant hover:text-primary hover:bg-primary-container/5'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Priest Table Grid list */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sacred border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b divider-gold text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                <th className="py-4 px-6">Priest / Acharya</th>
                <th className="py-4 px-6">Official Role</th>
                <th className="py-4 px-6">Specialized Rituals</th>
                <th className="py-4 px-6">Contact Details</th>
                <th className="py-4 px-6 text-center">Duty Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-on-surface divide-y divide-outline-variant/10">
              {filteredPriests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-on-surface-variant font-sans text-sm">
                    No active priests matching your selected filters.
                  </td>
                </tr>
              ) : (
                filteredPriests.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${p.avatarColor} flex items-center justify-center font-bold text-sm shadow-inner`}>
                          {p.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{p.name}</p>
                          <span className="font-mono text-[9px] text-primary font-semibold uppercase tracking-wider flex items-center gap-1">
                            <Sparkles size={8} /> SV-ID: {p.id.padStart(3, '0')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-surface-container-high border border-outline-variant/30 text-on-surface-variant text-xs font-bold rounded-lg">
                        {p.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant text-xs font-semibold leading-relaxed max-w-xs truncate">
                      {p.specialization}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-xs text-on-surface font-semibold">
                        <Phone size={12} className="text-primary" />
                        <span>{p.mobile}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => toggleStatus(p.id)}
                        title="Click to cycle status"
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
                          p.status === 'Active'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : p.status === 'Duty-Assign'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {p.status}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => alert(`Edit details of Acharya ${p.name}`)}
                          className="p-1.5 hover:bg-primary-container/10 text-primary rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeletePriest(p.id)}
                          className="p-1.5 hover:bg-error-container text-error rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Priest Modal Popup */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setShowAddModal(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border-t-4 border-primary p-6 animate-[scaleIn_0.2s_ease-out]">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 p-2 hover:bg-surface-container-low text-on-surface-variant rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="font-serif text-2xl text-primary font-bold mb-4">Add Official Priest</h3>

            <form onSubmit={handleAddPriest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Priest Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Madhava Dikshidar"
                  value={newPriest.name}
                  onChange={(e) => setNewPriest({...newPriest, name: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline rounded-xl text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Official Role</label>
                  <select
                    value={newPriest.role}
                    onChange={(e) => setNewPriest({...newPriest, role: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline rounded-xl text-sm focus:outline-none"
                  >
                    <option value="Chief Priest">Chief Priest</option>
                    <option value="Senior Pujari">Senior Pujari</option>
                    <option value="Pujari">Pujari</option>
                    <option value="Archaka">Archaka</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Contact Mobile</label>
                  <input
                    type="text"
                    placeholder="+91 XXXXX XXXXX"
                    value={newPriest.mobile}
                    onChange={(e) => setNewPriest({...newPriest, mobile: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline rounded-xl text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Ritual Specializations</label>
                <input
                  type="text"
                  placeholder="e.g. Homam rituals, Alankara expert"
                  value={newPriest.specialization}
                  onChange={(e) => setNewPriest({...newPriest, specialization: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t divider-gold flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-outline-variant/60 hover:bg-surface-container-low text-on-surface-variant rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-on-primary-container text-on-primary rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                >
                  Save Acharya Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
