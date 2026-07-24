'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Save,
  ChevronRight,
  CheckCircle,
  Home,
  Bath,
  Hotel,
  UtensilsCrossed,
  Sparkles,
  Droplets,
  Gift,
  Building2,
  ShieldCheck
} from 'lucide-react';

interface TempleFacilitiesProps {
  onBack: () => void;
}

interface FacilityItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
}

type FacilityIconName = 'building2' | 'bath' | 'hotel' | 'utensils' | 'sparkles' | 'droplets' | 'gift' | 'home';

const DEFAULT_FACILITIES: FacilityItem[] = [
  {
    id: 'function-hall',
    name: 'Function Hall / Choultry',
    description: 'Availability for weddings, ceremonies, and community events.',
    enabled: true,
    icon: 'building2'
  },
  {
    id: 'rest-rooms',
    name: 'Rest Rooms',
    description: 'Clean and accessible washroom facilities for devotees.',
    enabled: true,
    icon: 'bath'
  },
  {
    id: 'accommodation',
    name: 'Accommodation',
    description: 'Guest rooms and stay arrangements for pilgrims.',
    enabled: true,
    icon: 'hotel'
  },
  {
    id: 'dining-hall',
    name: 'Dining Hall',
    description: 'Meal service areas for visitors and volunteers.',
    enabled: true,
    icon: 'utensils'
  },
  {
    id: 'private-poojas',
    name: 'Private Poojas',
    description: 'Dedicated booking support for personal rituals and ceremonies.',
    enabled: true,
    icon: 'sparkles'
  },
  {
    id: 'drinking-water',
    name: 'Drinking Water Facility',
    description: 'Filtered water stations across the temple premises.',
    enabled: true,
    icon: 'droplets'
  },
  {
    id: 'prasadam',
    name: 'Prasadam Counter',
    description: 'Distribution of eatables, non-eatables, and devotional items.',
    enabled: true,
    icon: 'gift'
  }
];

const iconMap: Record<FacilityIconName, React.ElementType> = {
  building2: Building2,
  bath: Bath,
  hotel: Hotel,
  utensils: UtensilsCrossed,
  sparkles: Sparkles,
  droplets: Droplets,
  gift: Gift,
  home: Home
};

const normalizeFacility = (facility: Partial<FacilityItem> & { icon?: unknown }, fallbackId?: string): FacilityItem => {
  const id = facility.id || fallbackId || 'facility';
  const defaultFacility = DEFAULT_FACILITIES.find((item) => item.id === id) || DEFAULT_FACILITIES[0];
  const iconValue = typeof facility.icon === 'string' ? facility.icon : defaultFacility.icon;

  return {
    id,
    name: facility.name || defaultFacility.name,
    description: facility.description || defaultFacility.description,
    enabled: typeof facility.enabled === 'boolean' ? facility.enabled : defaultFacility.enabled,
    icon: iconValue as FacilityIconName
  };
};

export default function TempleFacilities({ onBack }: TempleFacilitiesProps) {
  const [facilities, setFacilities] = useState<FacilityItem[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('sankalpvani_temple_facilities');
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as Array<Partial<FacilityItem>>;
          if (Array.isArray(parsed) && parsed.length) {
            return parsed.map((facility, index) => normalizeFacility(facility, facility.id || `facility-${index}`));
          }
        } catch (e) {
          console.error('Failed to parse temple facilities', e);
        }
      }
    }
    return DEFAULT_FACILITIES;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleFacility = (id: string) => {
    setFacilities(prev => prev.map(facility =>
      facility.id === id ? { ...facility, enabled: !facility.enabled } : facility
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    setTimeout(() => {
      localStorage.setItem('sankalpvani_temple_facilities', JSON.stringify(facilities));
      setIsSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    }, 700);
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      {success && (
        <div className="fixed top-6 right-6 z-50 bg-green-100 text-green-800 border border-green-200 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3">
          <CheckCircle size={18} className="text-green-600 animate-bounce" />
          <span className="font-sans text-sm font-semibold">Temple facilities updated successfully!</span>
        </div>
      )}

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
            <span>Temple Facilities Master</span>
          </div>
          <h2 className="font-serif text-3xl font-semibold text-primary">Temple Facilities Setup</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface-container-lowest rounded-2xl shadow-sacred border border-outline-variant/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Home size={18} className="text-primary" />
            <h3 className="font-serif text-xl font-bold text-primary">Available Guest Facilities</h3>
          </div>
          <p className="text-sm text-on-surface-variant mb-6">
            Enable or disable temple amenities available to devotees and guests.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilities.map((facility) => (
              <div
                key={facility.id}
                className={`rounded-2xl border p-4 transition-all ${
                  facility.enabled
                    ? 'border-primary/30 bg-primary-container/10'
                    : 'border-outline-variant/40 bg-surface-container-low'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl ${facility.enabled ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      {React.createElement(iconMap[facility.icon as FacilityIconName] || iconMap.home, { size: 16 })}
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-bold text-on-surface">{facility.name}</h4>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{facility.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFacility(facility.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${facility.enabled ? 'bg-primary' : 'bg-outline-variant'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${facility.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-high rounded-2xl p-6 border border-outline-variant/30 text-center flex flex-col items-center">
          <ShieldCheck size={20} className="text-primary mb-2" />
          <p className="font-sans text-xs text-on-surface-variant leading-relaxed mb-4">
            These facility settings will be reflected in temple visitor-facing modules and admin summaries.
          </p>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full md:w-auto bg-primary hover:bg-on-primary-container text-on-primary py-3 px-6 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving Facilities...' : 'Save Facilities'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
