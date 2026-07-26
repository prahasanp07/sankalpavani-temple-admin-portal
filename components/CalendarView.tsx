'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  List,
  Check,
  X,
  Clock,
  User,
  Users,
  CheckCircle,
  Tag,
  CreditCard
} from 'lucide-react';

interface Pilgrim {
  name: string;
  gotra: string;
  nakshetra: string;
  age?: number | string;
  gender?: string;
  gotram?: string;
  nakshatram?: string;
}

interface Booking {
  receiptNo: string;
  devoteeName: string;
  gotra: string;
  nakshetra: string;
  sevaName: string;
  amount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  bookingDate: string;
  timeSlot: string;
  persons?: number;
  age?: number | string;
  gender?: string;
  pilgrims?: Pilgrim[];
}

interface SevaOption {
  name: string;
  price: number;
  timeRange: string;
  personsPerSeva?: number;
  extraPersonCost?: number;
  aboutSeva?: string;
  instructions?: string;
}

const DEFAULT_SEVAS: SevaOption[] = [
  { name: 'Archana Pooja', price: 101, timeRange: '06:00 AM - 08:30 PM', personsPerSeva: 1, extraPersonCost: 0, aboutSeva: 'Traditional chanting of 108 names of the deity.', instructions: 'Wear traditional attire.' },
  { name: 'Maha Abhisheka', price: 1500, timeRange: '06:00 AM - 08:00 AM', personsPerSeva: 2, extraPersonCost: 500, aboutSeva: 'Sacred bathing ritual performed on the main deity.', instructions: 'Report 15 minutes early.' },
  { name: 'Annadanam Seva', price: 2100, timeRange: '12:00 PM - 02:30 PM', personsPerSeva: 4, extraPersonCost: 300, aboutSeva: 'Serving holy meals to visiting pilgrims.', instructions: 'No specific dress code.' },
  { name: 'Vahan Pooja', price: 1100, timeRange: '09:00 AM - 05:00 PM', personsPerSeva: 1, extraPersonCost: 0, aboutSeva: 'Blessing of new vehicles at the temple temple entrance.', instructions: 'Park vehicle at the gate.' },
  { name: 'Chandi Homa', price: 5001, timeRange: '07:00 AM - 11:30 AM', personsPerSeva: 3, extraPersonCost: 1000, aboutSeva: 'Powerful fire ritual dedicated to Goddess Durga.', instructions: 'Wear clean ethnic clothing.' },
  { name: 'Sahasranama Archana', price: 501, timeRange: '05:30 PM - 07:00 PM', personsPerSeva: 2, extraPersonCost: 200, aboutSeva: 'Recitation of 1000 holy names of the deity.', instructions: 'Traditional ethnic wear required.' }
];

const DEFAULT_BOOKINGS: Booking[] = [
  { receiptNo: 'SV-2026-0612', devoteeName: 'Raghavendran Iyer', gotra: 'Bharadwaja', nakshetra: 'Krittika', sevaName: 'Maha Abhisheka', amount: 1500, paymentStatus: 'Paid', bookingDate: '2026-06-28', timeSlot: '07:30 AM', persons: 2 },
  { receiptNo: 'SV-2026-0613', devoteeName: 'Venkatesh Prasad', gotra: 'Kashyapa', nakshetra: 'Rohini', sevaName: 'Archana Pooja', amount: 101, paymentStatus: 'Paid', bookingDate: '2026-06-28', timeSlot: '09:00 AM', persons: 1 },
  { receiptNo: 'SV-2026-0614', devoteeName: 'Deepika Rao', gotra: 'Vasishta', nakshetra: 'Ashwini', sevaName: 'Annadanam Seva', amount: 2100, paymentStatus: 'Paid', bookingDate: '2026-06-28', timeSlot: '12:00 PM', persons: 4 },
  { receiptNo: 'SV-2026-0615', devoteeName: 'Suresh Kumar', gotra: 'Srivatsa', nakshetra: 'Revati', sevaName: 'Vahan Pooja', amount: 1100, paymentStatus: 'Pending', bookingDate: '2026-06-27', timeSlot: '04:30 PM', persons: 1 },
  { receiptNo: 'SV-2026-0616', devoteeName: 'Meenakshi Sundaram', gotra: 'Atri', nakshetra: 'Anuradha', sevaName: 'Archana Pooja', amount: 101, paymentStatus: 'Paid', bookingDate: '2026-06-27', timeSlot: '10:00 AM', persons: 1 },
  { receiptNo: 'SV-2026-0617', devoteeName: 'Vikram Hegde', gotra: 'Viswamitra', nakshetra: 'Sravana', sevaName: 'Chandi Homa', amount: 5001, paymentStatus: 'Paid', bookingDate: '2026-06-26', timeSlot: '06:00 AM', persons: 3 },
  { receiptNo: 'SV-2026-0618', devoteeName: 'Anantha Padmanabha', gotra: 'Kaushika', nakshetra: 'Uttara Phalguni', sevaName: 'Sahasranama Archana', amount: 501, paymentStatus: 'Paid', bookingDate: '2026-06-25', timeSlot: '08:30 AM', persons: 2 },
  { receiptNo: 'SV-2026-0619', devoteeName: 'Shruthi Vishwanath', gotra: 'Gautama', nakshetra: 'Punarvasu', sevaName: 'Maha Abhisheka', amount: 1500, paymentStatus: 'Refunded', bookingDate: '2026-06-25', timeSlot: '07:30 AM', persons: 2 },
  { receiptNo: 'SV-2026-0620', devoteeName: 'Hari Prasad Bhat', gotra: 'Angirasa', nakshetra: 'Jyeshtha', sevaName: 'Archana Pooja', amount: 101, paymentStatus: 'Paid', bookingDate: '2026-06-24', timeSlot: '11:00 AM', persons: 1 },
  { receiptNo: 'SV-2026-0621', devoteeName: 'Narayana Murthy', gotra: 'Shandilya', nakshetra: 'Pushya', sevaName: 'Chandi Homa', amount: 5001, paymentStatus: 'Pending', bookingDate: '2026-06-23', timeSlot: '06:00 AM', persons: 3 },
  { receiptNo: 'SV-2026-0622', devoteeName: 'Vijayalakshmi R.', gotra: 'Kashyapa', nakshetra: 'Hasta', sevaName: 'Sahasranama Archana', amount: 501, paymentStatus: 'Paid', bookingDate: '2026-06-22', timeSlot: '09:30 AM', persons: 2 },
  { receiptNo: 'SV-2026-0623', devoteeName: 'Srinivasa Raghavan', gotra: 'Bharadwaja', nakshetra: 'Swati', sevaName: 'Annadanam Seva', amount: 2100, paymentStatus: 'Paid', bookingDate: '2026-06-21', timeSlot: '12:30 PM', persons: 4 },
  { receiptNo: 'SV-2026-0624', devoteeName: 'Kalyani Deshpande', gotra: 'Vasishta', nakshetra: 'Chitra', sevaName: 'Vahan Pooja', amount: 1100, paymentStatus: 'Paid', bookingDate: '2026-06-20', timeSlot: '03:00 PM', persons: 1 }
];

const gotramsList = [
  'Bharadwaja',
  'Kashyapa',
  'Vashishta',
  'Gautama',
  'Atri',
  'Vishwamitra',
  'Jamadagni',
  'Angirasa',
  'Shandilya',
  'Haritasa',
  'Kaundinya',
  'Srivatsa'
];

const nakshatramsList = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Poorva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Moola', 'Poorvashadha', 'Uttarashadha', 'Shravana', 'Dhanishta',
  'Shatabhisha', 'Poorvabhadra', 'Uttarabhadra', 'Revati'
];

// Safe manual formatting
const formatDateString = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const shiftMockBookingsToToday = (bookingsList: Booking[]): Booking[] => {
  if (bookingsList.length === 0) return bookingsList;
  const dates = bookingsList.map(b => b.bookingDate);
  const latestDateStr = dates.reduce((max, d) => d > max ? d : max, dates[0]);
  const [ly, lm, ld] = latestDateStr.split('-').map(Number);
  const latestDate = new Date(ly, lm - 1, ld);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - latestDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  return bookingsList.map(b => {
    const [by, bm, bd] = b.bookingDate.split('-').map(Number);
    const bDate = new Date(by, bm - 1, bd);
    const shiftedDate = new Date(bDate.getTime() + diffDays * 24 * 60 * 60 * 1000);
    const yyyy = shiftedDate.getFullYear();
    const mm = String(shiftedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(shiftedDate.getDate()).padStart(2, '0');
    return {
      ...b,
      bookingDate: `${yyyy}-${mm}-${dd}`
    };
  });
};

export default function CalendarView() {
  // Calendar Navigation
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => formatDateString(new Date()));
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sevas, setSevas] = useState<SevaOption[]>(DEFAULT_SEVAS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modal controls
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  // New Booking Form State
  const [newBookingForm, setNewBookingForm] = useState(() => {
    const todayStr = formatDateString(new Date());
    return {
      devoteeName: '',
      gotra: gotramsList[0],
      nakshetra: nakshatramsList[0],
      sevaName: DEFAULT_SEVAS[0].name,
      amount: DEFAULT_SEVAS[0].price,
      bookingDate: todayStr,
      timeSlot: '09:00 AM',
      paymentStatus: 'Paid' as Booking['paymentStatus'],
      persons: 1,
      age: '',
      gender: 'Male'
    };
  });

  // Sync / Load Bookings and Sevas
  const loadData = () => {
    if (typeof window !== 'undefined') {
      const cachedB = localStorage.getItem('sankalpvani_bookings');
      if (cachedB) {
        try {
          setBookings(JSON.parse(cachedB));
        } catch (e) {
          const shifted = shiftMockBookingsToToday(DEFAULT_BOOKINGS);
          setBookings(shifted);
        }
      } else {
        const shifted = shiftMockBookingsToToday(DEFAULT_BOOKINGS);
        localStorage.setItem('sankalpvani_bookings', JSON.stringify(shifted));
        setBookings(shifted);
      }

      // Sync Seva Master list if available
      const cachedS = localStorage.getItem('sankalpvani_sevas');
      if (cachedS) {
        try {
          const parsedSevas = JSON.parse(cachedS);
          if (Array.isArray(parsedSevas)) {
            const mapped = parsedSevas.map((s: any) => ({
              name: s.name,
              price: s.price,
              timeRange: s.timeRange || '09:00 AM - 12:00 PM',
              personsPerSeva: s.personsPerSeva || 1,
              extraPersonCost: s.extraPersonCost || 0,
              aboutSeva: s.aboutSeva || '',
              instructions: s.instructions || ''
            }));
            setSevas(mapped);
            // Default first item to state form
            if (mapped.length > 0) {
              setNewBookingForm(prev => ({
                ...prev,
                sevaName: mapped[0].name,
                amount: mapped[0].price
              }));
            }
          }
        } catch (e) { }
      }
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('sankalpvani_bookings_updated', loadData);
    return () => {
      window.removeEventListener('sankalpvani_bookings_updated', loadData);
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const notifyUpdate = (updated: Booking[]) => {
    localStorage.setItem('sankalpvani_bookings', JSON.stringify(updated));
    setBookings(updated);
    window.dispatchEvent(new Event('sankalpvani_bookings_updated'));
  };

  // Handle month switches
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const snapToToday = () => {
    // Fall back to June 28, 2026 if actual today is empty, or snap to actual today
    const realToday = new Date();
    setCurrentDate(new Date(realToday.getFullYear(), realToday.getMonth(), realToday.getDate()));
    setSelectedDateStr(formatDateString(realToday));
  };

  // Grid Calculation
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const cells: { date: Date; isCurrentMonth: boolean; dateStr: string }[] = [];

  // Trailing previous month days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - 1, prevMonthDays - i);
    cells.push({
      date: d,
      isCurrentMonth: false,
      dateStr: formatDateString(d)
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(currentYear, currentMonth, i);
    cells.push({
      date: d,
      isCurrentMonth: true,
      dateStr: formatDateString(d)
    });
  }

  // Next month leading days (pad to 35 or 42 grid cells)
  const totalCellsNeeded = cells.length > 35 ? 42 : 35;
  const nextMonthDaysNeeded = totalCellsNeeded - cells.length;
  for (let i = 1; i <= nextMonthDaysNeeded; i++) {
    const d = new Date(currentYear, currentMonth + 1, i);
    cells.push({
      date: d,
      isCurrentMonth: false,
      dateStr: formatDateString(d)
    });
  }

  // Dynamic Cost Calculation helper
  const calculateBookingCost = (sevaName: string, personsCount: number): number => {
    const selectedSeva = sevas.find(s => s.name === sevaName);
    if (!selectedSeva) return 0;
    const basePrice = selectedSeva.price;
    const basePersons = selectedSeva.personsPerSeva || 1;
    const extraCost = selectedSeva.extraPersonCost || 0;
    const extraPersons = Math.max(0, personsCount - basePersons);
    return basePrice + (extraPersons * extraCost);
  };

  // Seva Select Change Handler
  const handleSevaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSeva = sevas.find(s => s.name === e.target.value);
    if (selectedSeva) {
      setNewBookingForm(prev => ({
        ...prev,
        sevaName: selectedSeva.name,
        amount: calculateBookingCost(selectedSeva.name, prev.persons)
      }));
    }
  };

  // Submit Booking Form
  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newBookingForm.devoteeName.trim()) {
      alert('Please enter devotee name');
      return;
    }

    const uniqueId = `SV-${newDateYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      receiptNo: uniqueId,
      devoteeName: newBookingForm.devoteeName,
      gotra: newBookingForm.gotra || gotramsList[0],
      nakshetra: newBookingForm.nakshetra || nakshatramsList[0],
      sevaName: newBookingForm.sevaName,
      amount: newBookingForm.amount,
      paymentStatus: newBookingForm.paymentStatus,
      bookingDate: newBookingForm.bookingDate,
      timeSlot: newBookingForm.timeSlot,
      persons: newBookingForm.persons,
      age: newBookingForm.age,
      gender: newBookingForm.gender
    };

    const updated = [newBooking, ...bookings];
    notifyUpdate(updated);

    // Reset Form
    setNewBookingForm({
      devoteeName: '',
      gotra: gotramsList[0],
      nakshetra: nakshatramsList[0],
      sevaName: sevas[0]?.name || '',
      amount: sevas[0]?.price || 0,
      bookingDate: selectedDateStr,
      timeSlot: '09:00 AM',
      paymentStatus: 'Paid',
      persons: 1,
      age: '',
      gender: 'Male'
    });

    setShowAddModal(false);
    triggerToast(`Booking registration generated: ${uniqueId}`);
  };

  const newDateYear = () => {
    try {
      return newBookingForm.bookingDate.split('-')[0];
    } catch (e) {
      return '2026';
    }
  };

  // Change Booking Status
  const handleUpdateStatus = (receiptNo: string, newStatus: Booking['paymentStatus']) => {
    const updated = bookings.map(b => {
      if (b.receiptNo === receiptNo) {
        return { ...b, paymentStatus: newStatus };
      }
      return b;
    });
    notifyUpdate(updated);
    if (activeBooking && activeBooking.receiptNo === receiptNo) {
      setActiveBooking({ ...activeBooking, paymentStatus: newStatus });
    }
    triggerToast(`Transaction status updated to ${newStatus}`);
  };

  // Get color for payment status
  const getStatusColor = (status: Booking['paymentStatus']) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-500/10 text-green-700 border-green-600/20';
      case 'Pending':
        return 'bg-amber-500/10 text-amber-700 border-amber-600/20';
      case 'Refunded':
        return 'bg-red-500/10 text-red-700 border-red-600/20';
      default:
        return 'bg-surface-variant text-on-surface-variant border-outline-variant/30';
    }
  };

  // Month Display Name
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Bookings filtered for active date selection
  const activeDayBookings = bookings.filter(b => b.bookingDate === selectedDateStr);

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-primary-container text-on-primary-container border border-primary/20 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3">
          <CheckCircle size={18} className="text-primary animate-bounce" />
          <span className="font-sans text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-1 text-xs font-bold text-primary tracking-wider uppercase mb-1">
            <span>Home</span>
            <span className="text-on-surface-variant/40">/</span>
            <span>Roster calendar</span>
          </div>
          <h2 className="font-serif text-3xl font-semibold text-primary">{monthName}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Snap Today / Navigation */}
          <div className="flex items-center bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={prevMonth}
              className="p-2.5 hover:bg-primary-container/5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={snapToToday}
              className="px-4 py-2 text-xs font-bold text-primary hover:bg-primary-container/5 transition-colors cursor-pointer border-x border-outline-variant/20"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-2.5 hover:bg-primary-container/5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* View switcher */}
          <div className="flex bg-surface-container-low border border-outline-variant/30 p-1 rounded-xl shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === 'grid'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
                }`}
              title="Month Grid"
            >
              <Calendar size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === 'list'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
                }`}
              title="Agenda List"
            >
              <List size={15} />
            </button>
          </div>

          {/* Register new Seva */}
          <button
            onClick={() => {
              setNewBookingForm(prev => ({
                ...prev,
                bookingDate: selectedDateStr
              }));
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 bg-primary hover:bg-on-primary-container text-on-primary font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm hover:shadow-md transition-all cursor-pointer w-full sm:w-auto justify-center"
          >
            <Plus size={14} />
            <span>Add Booking</span>
          </button>
        </div>
      </div>

      {/* Main Content Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column: Calendar Grid / List Agenda */}
        <div className="lg:col-span-8 space-y-6">

          {viewMode === 'grid' ? (
            <div className="bg-surface-container-lowest rounded-2xl shadow-sacred border border-outline-variant/30 p-4">

              {/* Day Labels */}
              <div className="grid grid-cols-7 text-center font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 border-b divider-gold pb-3">
                <span className="text-error/90">Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span className="text-primary">Sat</span>
              </div>

              {/* Grid Cells */}
              <div className="grid grid-cols-7 gap-1.5">
                {cells.map((cell, idx) => {
                  const dayBookings = bookings.filter(b => b.bookingDate === cell.dateStr);
                  const isSelected = selectedDateStr === cell.dateStr;
                  const todayStr = formatDateString(new Date());
                  const isToday = todayStr === cell.dateStr;

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedDateStr(cell.dateStr)}
                      className={`min-h-[90px] md:min-h-[110px] p-2 rounded-xl border flex flex-col justify-between transition-all select-none cursor-pointer ${cell.isCurrentMonth
                          ? isSelected
                            ? 'bg-primary-container/10 border-primary ring-1 ring-primary'
                            : 'bg-surface-container-low/50 border-outline-variant/20 hover:bg-surface-container-low hover:border-primary/30'
                          : 'bg-surface-container-lowest/20 border-outline-variant/10 text-on-surface-variant/40 hover:bg-surface-container-lowest/50'
                        }`}
                    >
                      {/* Date Indicator Header */}
                      <div className="flex justify-between items-center">
                        <span
                          className={`font-mono text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${isToday
                              ? 'bg-primary text-on-primary shadow-sm font-extrabold'
                              : isSelected
                                ? 'text-primary font-bold'
                                : 'text-on-surface font-semibold'
                            }`}
                        >
                          {cell.date.getDate()}
                        </span>

                        {/* Dot indicator for mobile */}
                        {dayBookings.length > 0 && (
                          <div className="flex gap-0.5 md:hidden">
                            {dayBookings.slice(0, 3).map((b, bIdx) => (
                              <span
                                key={bIdx}
                                className={`w-1 h-1 rounded-full ${b.paymentStatus === 'Paid'
                                    ? 'bg-green-500'
                                    : b.paymentStatus === 'Pending'
                                      ? 'bg-amber-500'
                                      : 'bg-red-500'
                                  }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bookings events stack on desktop */}
                      <div className="hidden md:flex flex-col gap-1 mt-1.5 overflow-hidden flex-1 justify-end">
                        {dayBookings.slice(0, 2).map((b) => (
                          <div
                            key={b.receiptNo}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveBooking(b);
                              setShowDetailModal(true);
                            }}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold border truncate hover:scale-[1.02] transition-transform ${b.paymentStatus === 'Paid'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : b.paymentStatus === 'Pending'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-red-50 text-red-700 border-red-200'
                              }`}
                            title={`${b.devoteeName} - ${b.sevaName}`}
                          >
                            {b.devoteeName.split(' ')[0]}: {b.sevaName}
                          </div>
                        ))}
                        {dayBookings.length > 2 && (
                          <span className="text-[9px] font-bold text-primary pl-1">
                            +{dayBookings.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            /* Agenda List view */
            <div className="bg-surface-container-lowest rounded-2xl shadow-sacred border border-outline-variant/30 p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-primary border-b divider-gold pb-3 flex items-center gap-1.5">
                <Calendar size={18} /> Month Schedule Bookings List
              </h3>

              {bookings.filter(b => {
                const parts = b.bookingDate.split('-');
                return parseInt(parts[0]) === currentYear && parseInt(parts[1]) - 1 === currentMonth;
              }).length === 0 ? (
                <div className="text-center py-10 text-on-surface-variant/60 font-sans text-xs">
                  No bookings scheduled for this month.
                </div>
              ) : (
                <div className="border border-outline-variant/20 rounded-xl overflow-hidden shadow-inner divide-y divide-outline-variant/15">
                  {[...bookings]
                    .filter(b => {
                      const parts = b.bookingDate.split('-');
                      return parseInt(parts[0]) === currentYear && parseInt(parts[1]) - 1 === currentMonth;
                    })
                    .sort((a, b) => b.bookingDate.localeCompare(a.bookingDate) || b.timeSlot.localeCompare(a.timeSlot))
                    .map((b) => (
                      <div
                        key={b.receiptNo}
                        onClick={() => {
                          setActiveBooking(b);
                          setShowDetailModal(true);
                        }}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 hover:bg-surface-container-low/30 transition-colors cursor-pointer gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                            {b.devoteeName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-on-surface">{b.devoteeName}</span>
                              <span className="font-mono text-[9px] font-bold text-primary bg-primary-container/10 px-1.5 py-0.5 rounded-full border border-primary/10">
                                {b.receiptNo}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 font-sans text-xs text-on-surface-variant font-medium mt-1">
                              <span className="text-primary font-bold">{b.sevaName}</span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5"><Clock size={11} /> {b.bookingDate} at {b.timeSlot}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                          <span className="font-bold text-sm">₹{b.amount}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(b.paymentStatus)}`}>
                            {b.paymentStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Selected Day Agenda details / sidebar preview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sacred border border-outline-variant/30 p-6 space-y-4">

            {/* Header selection info */}
            <div className="border-b divider-gold pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-lg font-bold text-primary">Agenda Overview</h3>
                <p className="font-sans text-xs text-on-surface-variant font-medium mt-0.5">
                  Selected date: <span className="font-mono font-bold text-primary">{selectedDateStr}</span>
                </p>
              </div>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-container/20 border border-primary/20 text-xs font-bold text-primary">
                {activeDayBookings.length}
              </span>
            </div>

            {/* List Agenda for active selection */}
            {activeDayBookings.length === 0 ? (
              <div className="text-center py-8 text-on-surface-variant/60 font-sans text-xs flex flex-col items-center gap-2">
                <span>No bookings scheduled for this date.</span>
                <button
                  onClick={() => {
                    setNewBookingForm(prev => ({
                      ...prev,
                      bookingDate: selectedDateStr
                    }));
                    setShowAddModal(true);
                  }}
                  className="text-primary hover:text-on-primary-container text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} /> Add Booking
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 hide-scrollbar">
                {activeDayBookings.map((b) => (
                  <div
                    key={b.receiptNo}
                    onClick={() => {
                      setActiveBooking(b);
                      setShowDetailModal(true);
                    }}
                    className="p-3.5 bg-surface-container-low/40 border border-outline-variant/20 rounded-xl hover:bg-surface-container-low hover:border-primary/30 transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-xs text-on-surface truncate pr-1">{b.devoteeName}</h4>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border shrink-0 ${getStatusColor(b.paymentStatus)}`}>
                          {b.paymentStatus}
                        </span>
                        <span className="font-mono text-[9px] font-bold text-primary shrink-0">{b.receiptNo}</span>
                      </div>
                    </div>
                    <div className="text-primary text-[10px] font-bold mt-0.5">{b.sevaName}</div>

                    <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-outline-variant/10 text-[10px] text-on-surface-variant font-medium">
                      <span className="flex items-center gap-0.5"><Clock size={9} /> {b.timeSlot}</span>
                      <span className="font-bold text-on-surface">₹{b.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Actions Footer */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setNewBookingForm(prev => ({
                    ...prev,
                    bookingDate: selectedDateStr
                  }));
                  setShowAddModal(true);
                }}
                className="w-full border border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>Register Seva Booking</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* MODAL: Register New Seva Booking */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] p-4">
          <div className="absolute inset-0" onClick={() => setShowAddModal(false)} />

          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col relative z-10 animate-[scaleIn_0.2s_ease-out]">
            {/* Header */}
            <div className="px-6 py-4 border-b divider-gold flex justify-between items-center bg-surface-container-low">
              <div>
                <h3 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
                  <Calendar size={18} />
                  New Devotee Seva Booking
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-outline-variant/15 text-on-surface-variant hover:text-on-surface rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleAddBooking} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Devotee Name */}
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Devotee Full Name</label>
                  <div className="relative">
                    <User size={13} className="absolute left-3 top-3.5 text-primary" />
                    <input
                      type="text"
                      required
                      value={newBookingForm.devoteeName}
                      onChange={(e) => setNewBookingForm({ ...newBookingForm, devoteeName: e.target.value })}
                      placeholder="e.g. Ramesh Hegde"
                      className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low border border-outline rounded-xl text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Age */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Age</label>
                  <input
                    type="number"
                    value={newBookingForm.age}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, age: e.target.value })}
                    placeholder="Age"
                    className="w-full px-3 py-2.5 bg-surface-container-low border border-outline rounded-xl text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Gender</label>
                  <select
                    value={newBookingForm.gender}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, gender: e.target.value })}
                    className="w-full px-3 py-2.5 bg-surface-container-low border border-outline rounded-xl text-xs focus:outline-none appearance-none cursor-pointer text-on-surface font-semibold text-on-surface-variant"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Gotra */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Gotra</label>
                  <select
                    value={newBookingForm.gotra}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, gotra: e.target.value })}
                    className="w-full px-3 py-2.5 bg-surface-container-low border border-outline rounded-xl text-xs focus:outline-none appearance-none cursor-pointer text-on-surface font-semibold text-on-surface-variant"
                  >
                    {gotramsList.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                {/* Nakshatra */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Nakshatra / Rashi</label>
                  <select
                    value={newBookingForm.nakshetra}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, nakshetra: e.target.value })}
                    className="w-full px-3 py-2.5 bg-surface-container-low border border-outline rounded-xl text-xs focus:outline-none appearance-none cursor-pointer text-on-surface font-semibold text-on-surface-variant"
                  >
                    {nakshatramsList.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                {/* Seva Offering Type */}
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Seva Offering</label>
                  <div className="relative">
                    <Tag size={13} className="absolute left-3 top-3.5 text-primary" />
                    <select
                      value={newBookingForm.sevaName}
                      onChange={handleSevaChange}
                      className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low border border-outline rounded-xl text-xs focus:outline-none appearance-none cursor-pointer font-semibold text-primary"
                    >
                      {sevas.map(s => (
                        <option key={s.name} value={s.name}>
                          {s.name} (Base Price: ₹{s.price})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* No. of Persons */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">No. of Persons</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newBookingForm.persons}
                    onChange={(e) => {
                      const p = Math.max(1, Number(e.target.value));
                      setNewBookingForm(prev => ({
                        ...prev,
                        persons: p,
                        amount: calculateBookingCost(prev.sevaName, p)
                      }));
                    }}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline rounded-xl text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Booking Date */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Schedule Date</label>
                  <input
                    type="date"
                    required
                    value={newBookingForm.bookingDate}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, bookingDate: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline rounded-xl text-xs focus:outline-none"
                  />
                </div>

                {/* Time slot picker */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Selected Slot / Timing</label>
                  <div className="relative">
                    <Clock size={13} className="absolute left-3 top-3.5 text-primary" />
                    <input
                      type="text"
                      required
                      value={newBookingForm.timeSlot}
                      onChange={(e) => setNewBookingForm({ ...newBookingForm, timeSlot: e.target.value })}
                      placeholder="e.g. 09:00 AM"
                      className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low border border-outline rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Amount */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Ticket Cost (Amount)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-primary font-bold">₹</span>
                    <input
                      type="number"
                      required
                      disabled
                      value={newBookingForm.amount}
                      className="w-full pl-7 pr-4 py-2 bg-surface-container-low border border-outline rounded-xl text-xs font-bold text-on-surface opacity-75 select-none"
                    />
                  </div>
                </div>

                {/* Status Selection */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Payment Gateway Status</label>
                  <div className="relative">
                    <CreditCard size={13} className="absolute left-3 top-3.5 text-primary" />
                    <select
                      value={newBookingForm.paymentStatus}
                      onChange={(e) => setNewBookingForm({ ...newBookingForm, paymentStatus: e.target.value as Booking['paymentStatus'] })}
                      className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low border border-outline rounded-xl text-xs focus:outline-none appearance-none cursor-pointer font-bold text-on-surface-variant"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                {/* Dynamic Info Cards from Selected Seva */}
                {sevas.find(s => s.name === newBookingForm.sevaName)?.aboutSeva && (
                  <div className="flex flex-col gap-1 sm:col-span-2 bg-primary/5 p-3 rounded-xl border border-primary/10">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-primary">About Seva</span>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      {sevas.find(s => s.name === newBookingForm.sevaName)?.aboutSeva}
                    </p>
                  </div>
                )}

                {sevas.find(s => s.name === newBookingForm.sevaName)?.instructions && (
                  <div className="flex flex-col gap-1 sm:col-span-2 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700">Instructions / Guidelines</span>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      {sevas.find(s => s.name === newBookingForm.sevaName)?.instructions}
                    </p>
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="border-t divider-gold pt-4 flex justify-end gap-3 bg-surface-container-lowest">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-outline-variant/40 hover:bg-surface-container text-xs font-bold text-on-surface-variant rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-on-primary-container text-on-primary text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1"
                >
                  <Check size={14} />
                  <span>Generate Booking Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Booking Event details & Status update */}
      {showDetailModal && activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] p-4">
          <div className="absolute inset-0" onClick={() => setShowDetailModal(false)} />

          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col relative z-10 animate-[scaleIn_0.2s_ease-out]">
            {/* Header */}
            <div className="px-6 py-4 border-b divider-gold flex justify-between items-center bg-surface-container-low">
              <div>
                <h3 className="font-serif text-lg font-bold text-primary">Booking Event details</h3>
                <span className="font-mono text-[9px] font-bold text-primary mt-1 inline-block">{activeBooking.receiptNo}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="p-1 hover:bg-outline-variant/15 text-on-surface-variant hover:text-on-surface rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Info Body */}
            <div className="p-6 space-y-4">
              <div className="space-y-3 font-sans text-xs">

                {/* Devotee Info */}
                <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                  <span className="text-on-surface-variant font-medium">Devotee Name</span>
                  <span className="font-bold text-on-surface">
                    {activeBooking.devoteeName} {activeBooking.age ? `(Age: ${activeBooking.age}, ${activeBooking.gender || 'Male'})` : ''}
                  </span>
                </div>

                {/* Gotra / Nakshetra */}
                <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                  <span className="text-on-surface-variant font-medium">Gotra / Nakshatra</span>
                  <span className="font-bold text-on-surface font-mono">{activeBooking.gotra} / {activeBooking.nakshetra}</span>
                </div>

                {/* Pilgrims List if available */}
                {activeBooking.pilgrims && activeBooking.pilgrims.length > 0 && (
                  <div className="border-b border-outline-variant/10 pb-2">
                    <span className="text-on-surface-variant font-medium block mb-1">Pilgrims Roster ({activeBooking.pilgrims.length})</span>
                    <div className="space-y-1 pl-2">
                      {activeBooking.pilgrims.map((p, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] font-sans">
                          <span className="text-on-surface-variant">• {p.name} {p.age ? `(Age: ${p.age}, ${p.gender})` : ''}</span>
                          <span className="font-mono text-on-surface-variant">{p.gotra || p.gotram} / {p.nakshetra || p.nakshatram}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seva name */}
                <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                  <span className="text-on-surface-variant font-medium">Booked Seva offering</span>
                  <span className="font-bold text-primary">{activeBooking.sevaName}</span>
                </div>

                {/* Date / Time */}
                <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                  <span className="text-on-surface-variant font-medium">Timing & Date</span>
                  <span className="font-bold text-on-surface font-mono">{activeBooking.bookingDate} at {activeBooking.timeSlot}</span>
                </div>

                {/* Cost */}
                <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                  <span className="text-on-surface-variant font-medium">Pooja cost</span>
                  <span className="font-bold text-on-surface text-sm">₹{activeBooking.amount}</span>
                </div>

                {/* Status Updater */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-on-surface-variant font-medium">Edit status</span>

                  <div className="relative">
                    <select
                      value={activeBooking.paymentStatus}
                      onChange={(e) => handleUpdateStatus(activeBooking.receiptNo, e.target.value as Booking['paymentStatus'])}
                      className={`pl-3 pr-8 py-1.5 border rounded-xl text-xs font-bold cursor-pointer focus:outline-none appearance-none ${getStatusColor(activeBooking.paymentStatus)}`}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                    <ChevronRight size={12} className="absolute right-2.5 top-2.5 rotate-90 text-current pointer-events-none" />
                  </div>
                </div>

              </div>

              {/* Actions */}
              <div className="border-t divider-gold pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowDetailModal(false)}
                  className="px-5 py-2 bg-primary hover:bg-on-primary-container text-on-primary text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
