'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  CalendarCheck,
  Truck,
  IndianRupee,
  ArrowRight,
  MoreVertical,
  CheckCircle,
  Clock,
  Printer,
  Send,
  Timer,
  RefreshCw,
  X,
  Users
} from 'lucide-react';

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
}

const DEFAULT_BOOKINGS: Booking[] = [
  { receiptNo: 'SV-2026-0612', devoteeName: 'Raghavendran Iyer', gotra: 'Bharadwaja', nakshetra: 'Krittika', sevaName: 'Maha Abhisheka', amount: 1500, paymentStatus: 'Paid', bookingDate: '2026-06-28', timeSlot: '07:30 AM' },
  { receiptNo: 'SV-2026-0613', devoteeName: 'Venkatesh Prasad', gotra: 'Kashyapa', nakshetra: 'Rohini', sevaName: 'Archana Pooja', amount: 101, paymentStatus: 'Paid', bookingDate: '2026-06-28', timeSlot: '09:00 AM' },
  { receiptNo: 'SV-2026-0614', devoteeName: 'Deepika Rao', gotra: 'Vasishta', nakshetra: 'Ashwini', sevaName: 'Annadanam Seva', amount: 2100, paymentStatus: 'Paid', bookingDate: '2026-06-28', timeSlot: '12:00 PM' },
  { receiptNo: 'SV-2026-0615', devoteeName: 'Suresh Kumar', gotra: 'Srivatsa', nakshetra: 'Revati', sevaName: 'Vahan Pooja', amount: 1100, paymentStatus: 'Pending', bookingDate: '2026-06-27', timeSlot: '04:30 PM' },
  { receiptNo: 'SV-2026-0616', devoteeName: 'Meenakshi Sundaram', gotra: 'Atri', nakshetra: 'Anuradha', sevaName: 'Archana Pooja', amount: 101, paymentStatus: 'Paid', bookingDate: '2026-06-27', timeSlot: '10:00 AM' },
  { receiptNo: 'SV-2026-0617', devoteeName: 'Vikram Hegde', gotra: 'Viswamitra', nakshetra: 'Sravana', sevaName: 'Chandi Homa', amount: 5001, paymentStatus: 'Paid', bookingDate: '2026-06-26', timeSlot: '06:00 AM' },
  { receiptNo: 'SV-2026-0618', devoteeName: 'Anantha Padmanabha', gotra: 'Kaushika', nakshetra: 'Uttara Phalguni', sevaName: 'Sahasranama Archana', amount: 501, paymentStatus: 'Paid', bookingDate: '2026-06-25', timeSlot: '08:30 AM' },
  { receiptNo: 'SV-2026-0619', devoteeName: 'Shruthi Vishwanath', gotra: 'Gautama', nakshetra: 'Punarvasu', sevaName: 'Maha Abhisheka', amount: 1500, paymentStatus: 'Refunded', bookingDate: '2026-06-25', timeSlot: '07:30 AM' },
  { receiptNo: 'SV-2026-0620', devoteeName: 'Hari Prasad Bhat', gotra: 'Angirasa', nakshetra: 'Jyeshtha', sevaName: 'Archana Pooja', amount: 101, paymentStatus: 'Paid', bookingDate: '2026-06-24', timeSlot: '11:00 AM' },
  { receiptNo: 'SV-2026-0621', devoteeName: 'Narayana Murthy', gotra: 'Shandilya', nakshetra: 'Pushya', sevaName: 'Chandi Homa', amount: 5001, paymentStatus: 'Pending', bookingDate: '2026-06-23', timeSlot: '06:00 AM' },
  { receiptNo: 'SV-2026-0622', devoteeName: 'Vijayalakshmi R.', gotra: 'Kashyapa', nakshetra: 'Hasta', sevaName: 'Sahasranama Archana', amount: 501, paymentStatus: 'Paid', bookingDate: '2026-06-22', timeSlot: '09:30 AM' },
  { receiptNo: 'SV-2026-0623', devoteeName: 'Srinivasa Raghavan', gotra: 'Bharadwaja', nakshetra: 'Swati', sevaName: 'Annadanam Seva', amount: 2100, paymentStatus: 'Paid', bookingDate: '2026-06-21', timeSlot: '12:30 PM' },
  { receiptNo: 'SV-2026-0624', devoteeName: 'Kalyani Deshpande', gotra: 'Vasishta', nakshetra: 'Chitra', sevaName: 'Vahan Pooja', amount: 1100, paymentStatus: 'Paid', bookingDate: '2026-06-20', timeSlot: '03:00 PM' }
];

const getTodayDateString = (bookingsList: Booking[]) => {
  const actualToday = new Date().toISOString().split('T')[0];
  const hasTodayBookings = bookingsList.some(b => b.bookingDate === actualToday);
  if (hasTodayBookings) return actualToday;

  if (bookingsList.length === 0) return actualToday;
  const dates = bookingsList.map(b => b.bookingDate);
  return dates.reduce((max, d) => d > max ? d : max, dates[0]);
};

interface DashboardPortalProps {
  onNavigate: (tabId: string) => void;
}

export default function DashboardPortal({ onNavigate }: DashboardPortalProps) {
  const [hoveredTrend, setHoveredTrend] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDevoteeModal, setShowDevoteeModal] = useState(false);
  const [showRecentBookingsModal, setShowRecentBookingsModal] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [kpiValues, setKpiValues] = useState({
    sevas: 0,
    bookings: 0,
    dispatch: 8,
    collections: 0
  });

  const loadBookings = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('sankalpvani_bookings');
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as Booking[];
          setBookings(parsed);
          
          const todayStr = getTodayDateString(parsed);
          const todayDevotees = parsed.filter(b => b.bookingDate === todayStr).length;
          const recentBookingsCount = parsed.length;
          const totalColl = parsed
            .filter(b => b.paymentStatus === 'Paid')
            .reduce((sum, b) => sum + b.amount, 0);

          setKpiValues({
            sevas: todayDevotees,
            bookings: recentBookingsCount,
            dispatch: 8,
            collections: totalColl
          });
        } catch (e) {}
      } else {
        localStorage.setItem('sankalpvani_bookings', JSON.stringify(DEFAULT_BOOKINGS));
        setBookings(DEFAULT_BOOKINGS);
        
        const todayStr = getTodayDateString(DEFAULT_BOOKINGS);
        const todayDevotees = DEFAULT_BOOKINGS.filter(b => b.bookingDate === todayStr).length;
        const recentBookingsCount = DEFAULT_BOOKINGS.length;
        const totalColl = DEFAULT_BOOKINGS
          .filter(b => b.paymentStatus === 'Paid')
          .reduce((sum, b) => sum + b.amount, 0);

        setKpiValues({
          sevas: todayDevotees,
          bookings: recentBookingsCount,
          dispatch: 8,
          collections: totalColl
        });
      }
    }
  }, []);

  React.useEffect(() => {
    loadBookings();
    
    window.addEventListener('sankalpvani_bookings_updated', loadBookings);
    return () => {
      window.removeEventListener('sankalpvani_bookings_updated', loadBookings);
    };
  }, [loadBookings]);

  const [trends, setTrends] = useState([
    { day: "Mon", amount: 12000, height: "40%" },
    { day: "Tue", amount: 15500, height: "55%" },
    { day: "Wed", amount: 14500, height: "45%" },
    { day: "Thu", amount: 19000, height: "70%" },
    { day: "Fri", amount: 24500, height: "85%" },
    { day: "Sat", amount: 18000, height: "60%" },
    { day: "Sun", amount: 21000, height: "75%" }
  ]);

  const [transactions, setTransactions] = useState([
    { name: "Rahul Sharma", initial: "R", type: "Archana", amount: "₹501", status: "Completed", date: "Today", bg: "bg-secondary-container text-on-secondary-container" },
    { name: "Priya Patel", initial: "P", type: "Annadanam", amount: "₹2,100", status: "Completed", date: "Today", bg: "bg-primary-container text-on-primary-container" },
    { name: "Amit Kumar", initial: "A", type: "Vahan Puja", amount: "₹1,100", status: "Pending", date: "Yesterday", bg: "bg-tertiary-container text-on-tertiary-container" }
  ]);

  const kpis = [
    {
      title: "Today's Sevas",
      value: String(kpiValues.sevas),
      change: "+12%",
      changeText: "vs yesterday",
      isPositive: true,
      color: "border-primary",
      bgColor: "bg-primary-container/20",
      textColor: "text-primary",
      icon: Heart
    },
    {
      title: "Recent Bookings",
      value: String(kpiValues.bookings),
      change: "Last 4 hours",
      changeText: "",
      isPositive: null,
      color: "border-secondary",
      bgColor: "bg-secondary-container/20",
      textColor: "text-secondary",
      icon: CalendarCheck
    },
    {
      title: "Prasadam to Dispatch",
      value: String(kpiValues.dispatch),
      progress: 65,
      isProgress: true,
      color: "border-tertiary",
      bgColor: "bg-tertiary-container/20",
      textColor: "text-tertiary",
      icon: Truck
    },
    {
      title: "Total Collections",
      value: `₹${kpiValues.collections.toLocaleString('en-IN')}`,
      change: "+5%",
      changeText: "vs yesterday",
      isPositive: true,
      color: "border-secondary-fixed",
      bgColor: "bg-secondary-fixed/50",
      textColor: "text-secondary-fixed-dim",
      icon: IndianRupee
    }
  ];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    // Simulate real database fetching delay
    setTimeout(() => {
      // Perturb KPI values slightly within realistic ranges
      setKpiValues(prev => {
        const deltaSevas = Math.floor(prev.sevas * (0.95 + Math.random() * 0.1));
        const deltaBookings = Math.floor(prev.bookings * (0.85 + Math.random() * 0.3));
        const deltaDispatch = Math.floor(prev.dispatch * (0.75 + Math.random() * 0.5));
        const deltaCollections = Math.floor(prev.collections * (0.98 + Math.random() * 0.05));
        return {
          sevas: Math.max(10, deltaSevas),
          bookings: Math.max(5, deltaBookings),
          dispatch: Math.max(2, deltaDispatch),
          collections: Math.max(5000, deltaCollections)
        };
      });

      // Perturb Trends heights and amounts slightly
      setTrends(prev => prev.map(t => {
        const randomFactor = 0.85 + Math.random() * 0.3;
        const newAmount = Math.floor(t.amount * randomFactor);
        const newHeightPercent = Math.min(100, Math.max(15, Math.floor(parseInt(t.height) * randomFactor)));
        return {
          ...t,
          amount: newAmount,
          height: `${newHeightPercent}%`
        };
      }));

      // Update transactions lists
      const names = ["Raghavan S.", "Sunita Krishnan", "Mohan Rao", "Gita Pillai", "Vikram Sen", "Ramesh Hegde"];
      const initials = ["R", "S", "M", "G", "V", "R"];
      const sevasList = ["Archana", "Annadanam", "Vahan Puja", "Maha Abhisheka", "Chandi Homa"];
      const amountsList = ["₹501", "₹2,100", "₹1,100", "₹1,500", "₹5,001"];
      const statusesList = ["Completed", "Completed", "Pending", "Completed"];
      const bgsList = [
        "bg-secondary-container text-on-secondary-container",
        "bg-primary-container text-on-primary-container",
        "bg-tertiary-container text-on-tertiary-container"
      ];

      setTransactions(prev => [
        {
          name: names[Math.floor(Math.random() * names.length)],
          initial: initials[Math.floor(Math.random() * initials.length)],
          type: sevasList[Math.floor(Math.random() * sevasList.length)],
          amount: amountsList[Math.floor(Math.random() * amountsList.length)],
          status: statusesList[Math.floor(Math.random() * statusesList.length)],
          date: "Today",
          bg: bgsList[Math.floor(Math.random() * bgsList.length)]
        },
        ...prev.slice(0, 2)
      ]);

      setIsRefreshing(false);
      triggerToast("All temple datasets synchronized with primary database!");
    }, 900);
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-primary-container text-on-primary-container border border-primary/20 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3">
          <CheckCircle size={18} className="text-primary animate-pulse" />
          <span className="font-sans text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl text-primary font-semibold tracking-tight">
            Namaste, Admin.
          </h2>
          <p className="font-sans text-sm text-on-surface-variant font-medium mt-1">
            Here&apos;s what&apos;s happening today at the Temple.
          </p>
        </div>
      </div>

      {/* Stats Cards Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div
          id="stat-card-today-devotees"
          onClick={() => setShowDevoteeModal(true)}
          className="bg-surface-container-lowest rounded-xl shadow-sacred border-t-4 border-primary p-6 hover:-translate-y-1 transition-all duration-300 border border-outline-variant/20 cursor-pointer hover:shadow-md hover:bg-surface-container-low active:scale-[0.98]"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Today&apos;s Devotees</p>
              <h3 className="font-display-lg text-3xl text-on-surface mt-1 font-bold">{kpiValues.sevas}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
              <Users size={18} />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="material-symbols-outlined text-[16px] text-green-600 mr-1">trending_up</span>
            <span className="text-green-600 font-semibold">+12%</span>
            <span className="text-on-surface-variant ml-2">Click to view roster</span>
          </div>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => setShowRecentBookingsModal(true)}
          className="bg-surface-container-lowest rounded-xl shadow-sacred border-t-4 border-secondary p-6 hover:-translate-y-1 transition-all duration-300 border border-outline-variant/20 cursor-pointer hover:shadow-md hover:bg-surface-container-low active:scale-[0.98]"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">Recent Bookings</p>
              <h3 className="font-display-lg text-3xl text-on-surface mt-1 font-bold">{kpiValues.bookings}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">event_available</span>
            </div>
          </div>
          <div className="flex items-center text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] mr-1">schedule</span>
            <span>Last 4 hours</span>
            <span className="text-on-surface-variant/70 ml-2">• Click to view list</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sacred border-t-4 border-tertiary p-6 hover:-translate-y-1 transition-transform duration-300 border border-outline-variant/20">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">Prasadam to Dispatch</p>
              <h3 className="font-display-lg text-3xl text-on-surface mt-1 font-bold">8</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-tertiary-container/30 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined">local_shipping</span>
            </div>
          </div>
          <div className="w-full bg-surface-variant rounded-full h-2 mt-4 overflow-hidden">
            <div className="bg-tertiary h-2 rounded-full progress-animate w-[65%]" style={{ '--progress-width': '65%' } as React.CSSProperties}></div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sacred border-t-4 border-outline p-6 hover:-translate-y-1 transition-transform duration-300 border border-outline-variant/20">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">Total Collections</p>
              <h3 className="font-display-lg text-3xl text-on-surface mt-1 font-bold">₹{(kpiValues.collections / 1000).toFixed(1)}k</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-on-secondary-fixed-variant">
              <span className="material-symbols-outlined">currency_rupee</span>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="material-symbols-outlined text-[16px] text-green-600 mr-1">trending_up</span>
            <span className="text-green-600 font-semibold">+5%</span>
            <span className="text-on-surface-variant ml-2">vs yesterday</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left column (Charts & Table) */}
        <div className="lg:col-span-8 space-y-8">

          {/* Donation Area-Bar Chart */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sacred p-6 border border-outline-variant/30">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-sans text-lg font-bold text-on-surface">Donation Trends (Last 7 Days)</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className={`text-primary hover:bg-primary-container/10 p-2 rounded-full transition-all cursor-pointer ${isRefreshing ? 'opacity-50' : ''}`}
                  title="Refresh Datasets"
                >
                  <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                </button>
                <button
                  onClick={() => triggerToast('Generating specialized trends analysis reports...')}
                  className="text-primary hover:bg-primary-container/10 p-2 rounded-full transition-all cursor-pointer"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Custom SVG Shaded Bar Chart */}
            <div className="w-full h-64 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-end px-4 pt-6 pb-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>

              {/* Floating Tooltip Indicator */}
              {hoveredTrend !== null && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs font-bold py-1.5 px-3 rounded-lg shadow-md z-10">
                  {trends[hoveredTrend].day}: ₹{(trends[hoveredTrend].amount / 1000).toFixed(1)}k
                </div>
              )}

              {/* Faux Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 py-8 pointer-events-none">
                <div className="border-b border-outline-variant/10 w-full h-0"></div>
                <div className="border-b border-outline-variant/10 w-full h-0"></div>
                <div className="border-b border-outline-variant/10 w-full h-0"></div>
              </div>

              {/* Trend Bars */}
              <div className="w-full flex justify-between items-end h-full px-4 gap-3 relative z-10">
                {trends.map((t, idx) => (
                  <div
                    key={t.day}
                    className="w-1/7 flex flex-col items-center h-full justify-end cursor-pointer group"
                    onMouseEnter={() => setHoveredTrend(idx)}
                    onMouseLeave={() => setHoveredTrend(null)}
                  >
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${hoveredTrend === idx
                        ? 'bg-primary shadow-[0_0_15px_rgba(143,78,0,0.3)] scale-x-105'
                        : 'bg-primary/50 group-hover:bg-primary/80'
                        }`}
                      style={{ height: t.height }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            {/* X-Axis labels */}
            <div className="flex justify-between text-xs font-bold text-on-surface-variant mt-3 px-8">
              {trends.map((t) => (
                <span key={t.day} className="w-1/7 text-center">{t.day}</span>
              ))}
            </div>
          </div>

          {/* Activity Table */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sacred overflow-hidden border border-outline-variant/30">
            <div className="px-6 py-5 border-b divider-gold flex justify-between items-center">
              <h3 className="font-sans text-lg font-bold text-on-surface">Recent Transactions</h3>
              <button
                onClick={() => onNavigate('transactions')}
                className="text-primary text-xs font-bold uppercase tracking-wider hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b divider-gold text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    <th className="py-4 px-6">Devotee Name</th>
                    <th className="py-4 px-6">Seva Type</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-on-surface divide-y divide-outline-variant/10">
                  {transactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-4 px-6 flex items-center">
                        <div className={`w-8 h-8 rounded-full ${tx.bg} flex items-center justify-center font-bold text-xs mr-3`}>
                          {tx.initial}
                        </div>
                        <span className="font-semibold text-on-surface">{tx.name}</span>
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant">{tx.type}</td>
                      <td className="py-4 px-6 font-semibold">{tx.amount}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${tx.status === 'Completed'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-secondary-container/20 text-on-secondary-container border border-secondary-container/30'
                          }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right column (Donut & Quick Actions) */}
        <div className="lg:col-span-4 space-y-8">

          {/* Quick Actions Bento Box */}
          <div className="bg-surface-container-high rounded-2xl p-6 border border-outline-variant/30 shadow-sm relative overflow-hidden">
            {/* Decorative bindu/temple curves */}
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full border-4 border-primary/10 pointer-events-none"></div>
            <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full border-2 border-primary/20 pointer-events-none"></div>

            <h3 className="font-sans text-lg font-bold text-on-surface mb-4 relative z-10">Quick Actions</h3>

            <div className="space-y-3 relative z-10">
              <button
                onClick={() => onNavigate('prasadam')}
                className="w-full flex items-center justify-between px-4 py-3 bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface border border-outline-variant/50 rounded-xl transition-all duration-200 group shadow-sm cursor-pointer"
              >
                <div className="flex items-center">
                  <Printer className="mr-3 text-primary group-hover:text-on-primary" size={18} />
                  <span className="font-semibold text-sm">Generate Prasadam Slips</span>
                </div>
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => triggerToast('Successfully dispatched temple schedules via SMS & Email gateway!')}
                className="w-full flex items-center justify-between px-4 py-3 bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface border border-outline-variant/50 rounded-xl transition-all duration-200 group shadow-sm cursor-pointer"
              >
                <div className="flex items-center">
                  <Send className="mr-3 text-primary group-hover:text-on-primary" size={18} />
                  <span className="font-semibold text-sm">Send Daily Schedule</span>
                </div>
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => onNavigate('temple_info')}
                className="w-full flex items-center justify-between px-4 py-3 bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface border border-outline-variant/50 rounded-xl transition-all duration-200 group shadow-sm cursor-pointer"
              >
                <div className="flex items-center">
                  <Timer className="mr-3 text-primary group-hover:text-on-primary" size={18} />
                  <span className="font-semibold text-sm">Update Darshan Timings</span>
                </div>
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>

          {/* Seva Popularity Donut Chart */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sacred p-6 border border-outline-variant/20 flex flex-col">
            <h3 className="font-sans text-lg font-bold text-on-surface mb-6">Seva Popularity</h3>
            <div className="flex-grow flex flex-col items-center justify-center">

              {/* CSS/SVG based actual donut chart */}
              <div className="relative w-44 h-44 flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Segment 1: Archana (45%) -> Stroke Dasharray = 45 55 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#8f4e00"
                    strokeWidth="12"
                    strokeDasharray="45 100"
                    strokeDashoffset="0"
                  />
                  {/* Segment 2: Annadanam (30%) -> Stroke Dasharray = 30 70 offset -45 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#fed65b"
                    strokeWidth="12"
                    strokeDasharray="30 100"
                    strokeDashoffset="-45"
                  />
                  {/* Segment 3: Vahan Puja (25%) -> Stroke Dasharray = 25 75 offset -75 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#b22b1d"
                    strokeWidth="12"
                    strokeDasharray="25 100"
                    strokeDashoffset="-75"
                  />
                </svg>

                {/* Center hole with total text */}
                <div className="absolute w-28 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                  <span className="text-2xl font-bold text-on-surface font-sans">124</span>
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Total Sevas</span>
                </div>
              </div>

              {/* Legend with matching colors */}
              <div className="w-full space-y-3 font-sans text-sm font-semibold">
                <div className="flex justify-between items-center p-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center">
                    <span className="w-3.5 h-3.5 rounded-full bg-primary mr-3 shadow-sm"></span>
                    <span className="text-on-surface-variant">Archana</span>
                  </div>
                  <span className="text-primary">45%</span>
                </div>

                <div className="flex justify-between items-center p-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#fed65b] mr-3 shadow-sm"></span>
                    <span className="text-on-surface-variant">Annadanam</span>
                  </div>
                  <span className="text-secondary-container">30%</span>
                </div>

                <div className="flex justify-between items-center p-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center">
                    <span className="w-3.5 h-3.5 rounded-full bg-tertiary mr-3 shadow-sm"></span>
                    <span className="text-on-surface-variant">Vahan Puja</span>
                  </div>
                  <span className="text-tertiary">25%</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {showDevoteeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] p-4">
          <div className="bg-surface-container-lowest w-full max-w-3xl rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[90vh] animate-[scaleIn_0.2s_ease-out]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b divider-gold flex justify-between items-center bg-surface-container-low">
              <div>
                <h3 className="font-serif text-xl font-bold text-primary">Today&apos;s Devotees & Seva Roster</h3>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                  Live registry of pilgrims scheduled for pooja performance today ({getTodayDateString(bookings)}).
                </p>
              </div>
              <button
                onClick={() => setShowDevoteeModal(false)}
                className="p-1.5 hover:bg-outline-variant/10 text-on-surface-variant hover:text-on-surface rounded-xl transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content - Table */}
            <div className="overflow-y-auto p-6 space-y-4">
              <div className="border border-outline-variant/20 rounded-xl overflow-hidden shadow-inner">
                <table className="w-full text-left border-collapse font-sans">
                  <thead>
                    <tr className="bg-surface-container-low border-b divider-gold text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      <th className="py-3 px-4">Receipt #</th>
                      <th className="py-3 px-4">Devotee Name</th>
                      <th className="py-3 px-4">Gotra / Nakshatra</th>
                      <th className="py-3 px-4">Booked Seva Offering</th>
                      <th className="py-3 px-4 text-center">Timings</th>
                      <th className="py-3 px-4 text-center">Persons</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-on-surface divide-y divide-outline-variant/10">
                    {bookings
                      .filter(b => b.bookingDate === getTodayDateString(bookings))
                      .map((d, i) => (
                        <tr key={i} className="hover:bg-surface-container-low/30 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-primary">{d.receiptNo}</td>
                          <td className="py-3 px-4 font-bold">{d.devoteeName}</td>
                          <td className="py-3 px-4 text-on-surface-variant font-mono text-[11px]">{d.gotra} / {d.nakshetra}</td>
                          <td className="py-3 px-4 text-primary font-bold">{d.sevaName}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 bg-primary-container/20 text-primary px-2 py-0.5 border border-primary/10 rounded-full font-mono text-[10px]">
                              {d.timeSlot}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-on-surface-variant">1</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-on-surface-variant text-center leading-relaxed">
                * Timings represent the designated ritual slots. Ask pilgrims to report at the queue check-point 15 minutes before the start time with official photo ID.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant/10 flex justify-end gap-3">
              <button
                onClick={() => setShowDevoteeModal(false)}
                className="px-4 py-2 bg-primary hover:bg-on-primary-container text-on-primary text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {showRecentBookingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] p-4">
          <div className="bg-surface-container-lowest w-full max-w-3xl rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[90vh] animate-[scaleIn_0.2s_ease-out]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b divider-gold flex justify-between items-center bg-surface-container-low">
              <div>
                <h3 className="font-serif text-xl font-bold text-primary">Recent Bookings Registry</h3>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                  Real-time list of pooja tickets purchased within the last 4 hours.
                </p>
              </div>
              <button
                onClick={() => setShowRecentBookingsModal(false)}
                className="p-1.5 hover:bg-outline-variant/10 text-on-surface-variant hover:text-on-surface rounded-xl transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content - Table */}
            <div className="overflow-y-auto p-6 space-y-4">
              <div className="border border-outline-variant/20 rounded-xl overflow-hidden shadow-inner">
                <table className="w-full text-left border-collapse font-sans">
                  <thead>
                    <tr className="bg-surface-container-low border-b divider-gold text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      <th className="py-3 px-4">Receipt #</th>
                      <th className="py-3 px-4">Devotee Name</th>
                      <th className="py-3 px-4">Booked Seva</th>
                      <th className="py-3 px-4 text-center">Date</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-on-surface divide-y divide-outline-variant/10">
                    {[...bookings]
                      .sort((a, b) => b.bookingDate.localeCompare(a.bookingDate) || b.receiptNo.localeCompare(a.receiptNo))
                      .slice(0, 10)
                      .map((tx, idx) => (
                        <tr key={idx} className="hover:bg-surface-container-low/30 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-primary">{tx.receiptNo}</td>
                          <td className="py-3 px-4 font-bold">{tx.devoteeName}</td>
                          <td className="py-3 px-4 text-primary font-bold">{tx.sevaName}</td>
                          <td className="py-3 px-4 text-center text-on-surface-variant">{tx.bookingDate}</td>
                          <td className="py-3 px-4 font-bold text-on-surface">₹{tx.amount}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${tx.paymentStatus === 'Paid'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : tx.paymentStatus === 'Pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                              }`}>
                              {tx.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-on-surface-variant text-center leading-relaxed">
                * View full receipt logs and print temple darshan check-in receipts from the <strong>Transactions Ledger</strong> tab.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant/10 flex justify-end gap-3">
              <button
                onClick={() => setShowRecentBookingsModal(false)}
                className="px-4 py-2 bg-primary hover:bg-on-primary-container text-on-primary text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
