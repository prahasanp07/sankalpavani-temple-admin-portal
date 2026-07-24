'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clock, Smile } from 'lucide-react';

const HOUR_OPTIONS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const MERIDIAN_OPTIONS = ['AM', 'PM'];

const normalizeTime = (timeStr: string) => {
  if (!timeStr) return '06:00 AM';
  const match = timeStr.trim().match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (match) {
    const hr = String(Number(match[1])).padStart(2, '0');
    const min = match[2];
    const ampm = match[3].toUpperCase();
    return `${hr}:${min} ${ampm}`;
  }
  return timeStr;
};

const parseTimeRange = (range: string) => {
  if (!range || range === 'N/A' || range === 'Closed') {
    return { isClosed: true, start: '06:00 AM', end: '12:30 PM' };
  }
  const parts = range.split('-').map(p => p.trim());
  if (parts.length === 2) {
    return { isClosed: false, start: normalizeTime(parts[0]), end: normalizeTime(parts[1]) };
  }
  return { isClosed: false, start: '06:00 AM', end: '12:30 PM' };
};

const parseTime = (timeStr: string) => {
  const match = timeStr.trim().match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (match) {
    return {
      hour: Number(match[1]),
      minute: Number(match[2]),
      meridian: match[3].toUpperCase() as 'AM' | 'PM'
    };
  }
  return { hour: 6, minute: 0, meridian: 'AM' as const };
};

interface WheelColumnProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
}

function WheelColumn({ options, value, onChange }: WheelColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const index = options.indexOf(value);
    if (index === -1) return;

    const targetScroll = index * 32;

    if (Math.abs(container.scrollTop - targetScroll) > 1) {
      if (!isScrollingRef.current) {
        container.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      } else {
        container.scrollTop = targetScroll;
      }
    }
  }, [value, options]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    isScrollingRef.current = true;

    const scrollTop = container.scrollTop;
    const index = Math.round(scrollTop / 32);

    if ((container as any).timeoutId) {
      clearTimeout((container as any).timeoutId);
    }

    (container as any).timeoutId = setTimeout(() => {
      if (index >= 0 && index < options.length) {
        const selected = options[index];
        if (selected !== value) {
          onChange(selected);
        }
      }
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 100);
    }, 80);
  };

  return (
    <div className="relative flex-1 h-[160px] flex justify-center">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-auto snap-y snap-mandatory scrollbar-none py-[64px] flex flex-col items-center"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {options.map((opt) => {
          const isSelected = opt === value;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
              }}
              className={`h-8 w-full shrink-0 flex items-center justify-center text-sm font-sans snap-center transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'text-primary font-bold text-base scale-110 z-10'
                  : 'text-on-surface-variant/40 hover:text-on-surface z-10'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface TimeRangePickerProps {
  value: string;
  onChange: (newValue: string) => void;
  label: string;
}

export default function TimeRangePicker({ value, onChange, label }: TimeRangePickerProps) {
  const { isClosed, start, end } = parseTimeRange(value);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSegment, setActiveSegment] = useState<'start' | 'end'>('start');

  const activeTime = activeSegment === 'start' ? start : end;
  const { hour, minute, meridian } = parseTime(activeTime);

  const activeHour = String(hour).padStart(2, '0');
  const activeMinute = String(minute).padStart(2, '0');
  const activeMeridian = meridian;

  const handleTimeChange = (newHour: string, newMin: string, newMerid: string) => {
    const formattedTime = `${newHour}:${newMin} ${newMerid}`;
    if (activeSegment === 'start') {
      onChange(`${formattedTime} - ${end}`);
    } else {
      onChange(`${start} - ${formattedTime}`);
    }
  };

  const handleToggleClosed = () => {
    if (isClosed) {
      onChange(`${start} - ${end}`);
    } else {
      onChange('Closed');
    }
  };

  return (
    <div className="space-y-3 font-sans w-full transition-all duration-300">
      {/* Summary Header Row */}
      <div className="flex justify-between items-center bg-surface-container/60 px-4 py-3 rounded-2xl border border-outline-variant/15 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
          <Clock size={14} className="text-primary" /> {label}
        </span>
        
        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
            isClosed 
              ? 'bg-red-50 text-red-700 border-red-200/50' 
              : 'bg-primary-container/20 text-primary border-primary/20'
          }`}>
            {isClosed ? 'Closed' : value}
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              isOpen 
                ? 'bg-primary text-on-primary border-primary shadow-sm' 
                : 'bg-white hover:bg-surface-container-low border-outline-variant text-on-surface-variant'
            }`}
          >
            {isOpen ? 'Close' : 'Configure'}
          </button>
        </div>
      </div>

      {/* Collapsible Edit Container */}
      {isOpen && (
        <div className="bg-surface-container/30 border border-outline-variant/20 p-4 rounded-2xl space-y-4 animate-[scaleIn_0.15s_ease-out]">
          {/* Active/Closed Switch */}
          <div className="flex justify-between items-center pb-3 border-b border-outline-variant/10">
            <span className="text-xs font-bold text-on-surface-variant">Timing Status:</span>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={!isClosed}
                onChange={handleToggleClosed}
                className="w-4 h-4 text-primary border-outline rounded cursor-pointer accent-primary"
              />
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                {!isClosed ? 'Active' : 'Closed'}
              </span>
            </label>
          </div>

          {!isClosed ? (
            <div className="space-y-3">
              {/* Segmented start/end tab picker */}
              <div className="bg-outline-variant/10 p-1 rounded-xl flex gap-1 border border-outline-variant/5">
                <button
                  type="button"
                  onClick={() => setActiveSegment('start')}
                  className={`flex-grow flex flex-col items-center py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer ${
                    activeSegment === 'start'
                      ? 'bg-white text-primary shadow-md font-bold'
                      : 'text-on-surface-variant hover:bg-white/40 font-medium'
                  }`}
                >
                  <span>Start</span>
                  <span className="text-[10px] opacity-80 mt-0.5 font-mono">{start}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSegment('end')}
                  className={`flex-grow flex flex-col items-center py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer ${
                    activeSegment === 'end'
                      ? 'bg-white text-primary shadow-md font-bold'
                      : 'text-on-surface-variant hover:bg-white/40 font-medium'
                  }`}
                >
                  <span>End</span>
                  <span className="text-[10px] opacity-80 mt-0.5 font-mono">{end}</span>
                </button>
              </div>

              {/* Scrolling Columns Wrapper */}
              <div className="relative bg-surface-container-lowest rounded-2xl px-4 border border-outline-variant/35 shadow-inner overflow-hidden">
                <div className="absolute left-2 right-2 top-[64px] h-[32px] bg-primary/10 border-y border-primary/20 pointer-events-none rounded-lg z-0" />
                
                <div className="relative w-full flex items-center z-10">
                  <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-surface-container-lowest to-transparent pointer-events-none z-20" />
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-surface-container-lowest to-transparent pointer-events-none z-20" />

                  <WheelColumn 
                    options={HOUR_OPTIONS} 
                    value={activeHour} 
                    onChange={(val) => handleTimeChange(val, activeMinute, activeMeridian)} 
                  />
                  <div className="text-primary font-bold z-10 shrink-0 select-none pb-0.5">:</div>
                  <WheelColumn 
                    options={MINUTE_OPTIONS} 
                    value={activeMinute} 
                    onChange={(val) => handleTimeChange(activeHour, val, activeMeridian)} 
                  />
                  <WheelColumn 
                    options={MERIDIAN_OPTIONS} 
                    value={activeMeridian} 
                    onChange={(val) => handleTimeChange(activeHour, activeMinute, val)} 
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[180px] rounded-2xl bg-surface-container-lowest border border-dashed border-outline-variant/30 flex flex-col items-center justify-center p-4 text-center">
              <Smile className="text-outline-variant/40 w-8 h-8 mb-2" />
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Session is Closed</p>
              <p className="text-[10px] text-on-surface-variant/75 mt-1 leading-relaxed max-w-[200px]">
                This timing slot is currently inactive. Toggle "Active" to enable slot configuration.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
