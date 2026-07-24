'use client';

import React from 'react';
import {
  LayoutDashboard,
  Grid,
  Receipt,
  MessageSquare,
  Utensils,
  BarChart3,
  Settings,
  LogOut,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: string;
  onLogout: () => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  adminName?: string;
  adminAvatar?: string;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  mobileOpen = false,
  setMobileOpen,
  adminName = 'Admin User',
  adminAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvn8h5qEhb1tDXNVQmH_C-7Bf3AF9LFkxb3WKWAvVYmxKc-TcXh1fjMMz-WjPg9zbdjB7Yrhy9eiYGkJBLgHovr8GAsE2ft4v7PT9xcRcGGi3JzCKWBozxxFHni9LfCSubIqySEm5J4TesuWgBjdcdegth7w_Lsgvd39ZpYyq-IgCKk-0lzzWXTvduEcTeXKyNURY3AzLe-YP0InifLRv0R4KmiNUF_JDCpbPVweyINkAPtpA7Rfnc7ZfS2hPyvRu8cJGasIwQyYQ'
}: SidebarProps) {

  const [templeLogo, setTempleLogo] = React.useState('https://lh3.googleusercontent.com/aida-public/AB6AXuANcPfzsfum8zGj2STDpP_Eds0xOoXxtm_OjHwVkP2MZOW3999u6oVf8P-7GeIMQA1hFSnmMM-gxsed4iDD-ruqP0OJKhI0LBMl2OTllKr3RJspedpV9pOsdDyz43dF_teOB1cC39MQgm579_rgeQq4Evh6iDEqE4aFi5LR5E3SLkqyCjsFrlyNnt_YF1ph80p1i-M4ec2yFc2A9oBE9U3sOA8W64XAiqtD-IxdDQLuoEYwwIz6gU1SePMjmWX2QVVSn1bT8aiesII');

  React.useEffect(() => {
    const updateLogo = () => {
      const cached = localStorage.getItem('sankalpvani_temple_details');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.photos && parsed.photos.length > 0) {
            const primaryIndex = parsed.primaryPhotoIndex ?? 0;
            if (parsed.photos[primaryIndex]) {
              setTempleLogo(parsed.photos[primaryIndex]);
              return;
            }
          }
        } catch (e) { }
      }
      setTempleLogo('https://lh3.googleusercontent.com/aida-public/AB6AXuANcPfzsfum8zGj2STDpP_Eds0xOoXxtm_OjHwVkP2MZOW3999u6oVf8P-7GeIMQA1hFSnmMM-gxsed4iDD-ruqP0OJKhI0LBMl2OTllKr3RJspedpV9pOsdDyz43dF_teOB1cC39MQgm579_rgeQq4Evh6iDEqE4aFi5LR5E3SLkqyCjsFrlyNnt_YF1ph80p1i-M4ec2yFc2A9oBE9U3sOA8W64XAiqtD-IxdDQLuoEYwwIz6gU1SePMjmWX2QVVSn1bT8aiesII');
    };

    updateLogo();
    window.addEventListener('sankalpvani_temple_details_updated', updateLogo);
    return () => {
      window.removeEventListener('sankalpvani_temple_details_updated', updateLogo);
    };
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Portal', icon: LayoutDashboard },
    { id: 'masters_hub', label: 'Masters', icon: Grid },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'prasadam', label: 'Prasadam', icon: Utensils },
    { id: 'system_overview', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Sidebar navigation container for desktop */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface-container border-r border-outline-variant/20 py-4 z-20">
        {/* Brand */}
        <div className="px-6 py-6 flex flex-col items-center border-b divider-gold mb-6">
          <img
            alt="SankalpVani Temple Logo"
            className="w-14 h-14 rounded-full shadow-sacred mb-3 object-cover border border-outline-variant/30"
            src={templeLogo}
          />
          <h1 className="font-serif text-2xl text-primary text-center font-bold tracking-tight">SankalpVani</h1>
          <p className="font-sans text-[11px] text-on-surface-variant uppercase mt-1 tracking-widest font-semibold opacity-80">
            Temple Administration
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-1.5 hide-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id ||
              (item.id === 'masters_hub' && ['priest_master', 'seva_master', 'temple_info', 'scheduling'].includes(activeTab));
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl font-sans text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-98 text-left ${isSelected
                    ? 'text-primary bg-primary-container/10 border-r-4 border-primary'
                    : 'text-on-surface-variant hover:bg-primary-container/5 hover:text-primary'
                  }`}
              >
                <Icon size={18} className="mr-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Admin User profile info */}
        <div className="px-4 mt-auto space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant/30 bg-white/70 backdrop-blur-sm">
            <img
              alt="Admin Profile"
              className="w-10 h-10 rounded-full object-cover border border-outline-variant/40"
              src={adminAvatar}
            />
            <div className="min-w-0">
              <p className="font-sans text-xs font-bold text-on-surface truncate">{adminName}</p>
              <p className="font-sans text-[10px] text-on-surface-variant truncate opacity-80">{currentUser}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl border border-outline-variant/40 font-sans text-xs font-bold text-error hover:bg-error-container hover:text-on-error-container hover:border-transparent transition-all duration-150 cursor-pointer"
          >
            <LogOut size={14} className="mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer (overlay) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen && setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer content */}
          <div className="relative flex flex-col w-64 max-w-xs bg-surface-container h-full p-4 shadow-2xl animate-[slideIn_0.3s_ease-out]">
            <div className="flex flex-col items-center border-b divider-gold pb-6 mb-6">
              <img
                alt="SankalpVani Temple Logo"
                className="w-14 h-14 rounded-full shadow-sacred mb-3 object-cover"
                src={templeLogo}
              />
              <h1 className="font-serif text-2xl text-primary text-center font-bold">SankalpVani</h1>
              <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
                Temple Administration
              </p>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id ||
                  (item.id === 'masters_hub' && ['priest_master', 'seva_master', 'temple_info', 'scheduling'].includes(activeTab));
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl font-sans text-sm font-semibold transition-all text-left ${isSelected
                        ? 'text-primary bg-primary-container/10'
                        : 'text-on-surface-variant hover:bg-primary-container/5 hover:text-primary'
                      }`}
                  >
                    <Icon size={18} className="mr-3" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto pt-6 border-t divider-gold space-y-4">
              <div className="flex items-center gap-3">
                <img
                  alt="Admin Profile"
                  className="w-10 h-10 rounded-full object-cover"
                  src={adminAvatar}
                />
                <div className="min-w-0">
                  <p className="font-sans text-xs font-bold text-on-surface truncate">{adminName}</p>
                  <p className="font-sans text-[10px] text-on-surface-variant truncate opacity-80">{currentUser}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl border border-outline-variant/40 font-sans text-xs font-bold text-error hover:bg-error-container hover:text-on-error-container hover:border-transparent transition-all cursor-pointer"
              >
                <LogOut size={14} className="mr-2" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
