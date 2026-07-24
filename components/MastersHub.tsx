'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Users,
  BookOpen,
  Settings,
  Calendar,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Database
} from 'lucide-react';

interface MastersHubProps {
  onNavigate: (tabId: string) => void;
}

export default function MastersHub({ onNavigate }: MastersHubProps) {
  const masters = [
    {
      id: 'temple_info',
      title: 'Temple Core Information',
      desc: 'Edit public portal data, main office addresses, darshan slot capacities, festival calendars, and temple contact channels.',
      icon: 'temple_hindu',
      badge: 'Verified Info',
      badgeColor: 'bg-secondary-container/20 text-on-secondary-container border-secondary-container/30',
      actionText: 'Edit Core Timings'
    },
    {
      id: 'seva_master',
      title: 'Seva & Pooja Master',
      desc: 'Set up poojas, pricing matrices, material logistics, and daily seva frequencies. Dynamically update timings and booking options.',
      icon: 'menu_book',
      badge: '18 Offerings',
      badgeColor: 'bg-primary-container/10 text-primary border-primary/20',
      actionText: 'Configure Sevas'
    },
    {
      id: 'temple_facilities',
      title: 'Temple Facilities Master',
      desc: 'Manage guest amenities and support services such as function halls, rest rooms, accommodation, dining, private poojas, drinking water, prasadam counters, and devotional merchandise.',
      icon: 'room_service',
      badge: 'Guest Amenities',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      actionText: 'Manage Facilities'
    },
    {
      id: 'priest_master',
      title: 'Priest Master Registry',
      desc: 'Create, update, or audit the official database of temple priests, on-duty roles, contact numbers, and specialized rituals.',
      icon: 'account_box',
      badge: '6 Active Priests',
      badgeColor: 'bg-green-100 text-green-800 border-green-200',
      actionText: 'Manage Priests'
    },
    {
      id: 'scheduling',
      title: 'Priest Roster & Scheduling',
      desc: 'Resolve scheduling conflicts, assign daily duty slots, monitor check-in compliance, and organize special festival shifts.',
      icon: 'calendar_month',
      badge: 'Roster Set',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      actionText: 'Open Scheduler'
    }
  ];

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
          <Database size={14} />
          <span>System Masters</span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl text-primary font-semibold tracking-tight">
          Masters Hub
        </h2>
        <p className="font-sans text-sm text-on-surface-variant font-medium mt-1">
          Select a structural master index to review, edit, or authorize vital temple records.
        </p>
      </div>

      {/* Grid of Masters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {masters.map((m, idx) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            onClick={() => onNavigate(m.id)}
            className="group relative bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant/30 hover:border-primary/40 rounded-2xl p-6 shadow-sacred transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            {/* Top row */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary-container/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 shadow-sm">
                  <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>{m.icon}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${m.badgeColor}`}>
                  {m.badge}
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                {m.title}
              </h3>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-6">
                {m.desc}
              </p>
            </div>

            {/* Bottom Button link */}
            <div className="flex items-center text-sm font-bold text-primary group-hover:text-on-primary-container transition-colors pt-4 border-t border-outline-variant/10">
              <span className="mr-2">{m.actionText}</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-1.5 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Database Status Info panel */}
      <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 border border-green-200">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="font-sans text-sm font-bold text-on-surface">Data Sync Engine Online</h4>
            <p className="font-sans text-xs text-on-surface-variant font-medium mt-0.5">
              All master lists are synchronized with offline-cached schemas and encrypted local secure storage.
            </p>
          </div>
        </div>
        <div className="text-xs font-mono bg-white/60 px-3 py-1.5 rounded-lg border border-outline-variant/30 text-on-surface-variant">
          Durable-Sync ID: <span className="font-bold text-primary">SV-60882-SYS</span>
        </div>
      </div>
    </div>
  );
}
