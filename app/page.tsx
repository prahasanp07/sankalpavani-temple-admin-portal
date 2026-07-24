'use client';

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  User, 
  Clock, 
  Settings as SettingsIcon, 
  LogOut, 
  ChevronDown, 
  Check, 
  X, 
  Key, 
  Phone, 
  Shield, 
  Camera, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import LoginScreen from '../components/LoginScreen';
import Sidebar from '../components/Sidebar';
import DashboardPortal from '../components/DashboardPortal';
import MastersHub from '../components/MastersHub';
import PriestMaster from '../components/PriestMaster';
import SevaMaster from '../components/SevaMaster';
import TempleInfo from '../components/TempleInfo';
import TempleFacilities from '../components/TempleFacilities';
import Transactions from '../components/Transactions';
import Scheduling from '../components/Scheduling';
import Prasadam from '../components/Prasadam';
import SystemOverview from '../components/SystemOverview';
import Settings from '../components/Settings';

interface NavigationState {
  activeTab: string;
  parentTab: string | null;
}

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [navigationState, setNavigationState] = useState<NavigationState>(() => {
    if (typeof window !== 'undefined') {
      const storedState = localStorage.getItem('sankalpvani_navigation_state');
      if (storedState) {
        try {
          const parsed = JSON.parse(storedState) as Partial<NavigationState>;
          return {
            activeTab: parsed.activeTab || 'dashboard',
            parentTab: parsed.parentTab || null
          };
        } catch (e) {
          console.error('Failed to parse navigation state', e);
        }
      }
    }
    return { activeTab: 'dashboard', parentTab: null };
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Admin Profile States
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [adminProfile, setAdminProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('sankalpvani_admin_profile');
      if (storedProfile) {
        try {
          return JSON.parse(storedProfile);
        } catch (e) {}
      }
      const session = localStorage.getItem('sankalpvani_session');
      if (session) {
        return {
          name: 'Admin User',
          email: session,
          phone: '+91 98765 43210',
          role: 'Chief Administrator',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvn8h5qEhb1tDXNVQmH_C-7Bf3AF9LFkxb3WKWAvVYmxKc-TcXh1fjMMz-WjPg9zbdjB7Yrhy9eiYGkJBLgHovr8GAsE2ft4v7PT9xcRcGGi3JzCKWBozxxFHni9LfCSubIqySEm5J4TesuWgBjdcdegth7w_Lsgvd39ZpYyq-IgCKk-0lzzWXTvduEcTeXKyNURY3AzLe-YP0InifLRv0R4KmiNUF_JDCpbPVweyINkAPtpA7Rfnc7ZfS2hPyvRu8cJGasIwQyYQ'
        };
      }
    }
    return {
      name: 'Admin User',
      email: 'admin@temple1.com',
      phone: '+91 98765 43210',
      role: 'Chief Administrator',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvn8h5qEhb1tDXNVQmH_C-7Bf3AF9LFkxb3WKWAvVYmxKc-TcXh1fjMMz-WjPg9zbdjB7Yrhy9eiYGkJBLgHovr8GAsE2ft4v7PT9xcRcGGi3JzCKWBozxxFHni9LfCSubIqySEm5J4TesuWgBjdcdegth7w_Lsgvd39ZpYyq-IgCKk-0lzzWXTvduEcTeXKyNURY3AzLe-YP0InifLRv0R4KmiNUF_JDCpbPVweyINkAPtpA7Rfnc7ZfS2hPyvRu8cJGasIwQyYQ'
    };
  });

  // Profile Editor Form States
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  
  // Password Change States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sankalpvani_navigation_state', JSON.stringify(navigationState));
    }
  }, [navigationState]);

  // Persist session across refreshes
  useEffect(() => {
    const session = localStorage.getItem('sankalpvani_session');
    
    setTimeout(() => {
      if (session) {
        setIsLoggedIn(true);
        setCurrentUser(session);
      }
      setIsMounted(true);
    }, 0);

    // Dynamic Clock update
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
      };
      setCurrentTime(now.toLocaleString('en-IN', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    setCurrentUser(email);
    localStorage.setItem('sankalpvani_session', email);
  };

  const handleNavigate = (tab: string, parentTabOverride?: string | null) => {
    setNavigationState(prev => ({
      activeTab: tab,
      parentTab: parentTabOverride ?? (
        ['priest_master', 'seva_master', 'temple_info', 'temple_facilities', 'scheduling'].includes(tab) ? 'masters_hub' : null
      )
    }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
    localStorage.removeItem('sankalpvani_session');
    setNavigationState({ activeTab: 'dashboard', parentTab: null });
  };

  // Guard: Avoid hydration mismatches by returning a consistent loader on initial mount pass
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-primary">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="font-serif text-sm font-bold tracking-widest uppercase">Sankalpvani</span>
        </div>
      </div>
    );
  }

  // Guard: If not logged in, render the login card screen
  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLogin} />;
  }

  const activeTab = navigationState.activeTab;
  const parentTab = navigationState.parentTab;

  // Get human-friendly tab names
  const getPageHeaderTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Temple-1 Administrative Dashboard';
      case 'masters_hub': return 'Structural Masters Hub';
      case 'priest_master': return 'Acharyas & Priests Registry';
      case 'seva_master': return 'Seva offerings Setup';
      case 'temple_info': return 'Temple Parameters';
      case 'temple_facilities': return 'Temple Facilities';
      case 'transactions': return 'Transactions Ledger';
      case 'scheduling': return 'Duty Shift Roster';
      case 'prasadam': return 'Prasadam Logistics';
      case 'system_overview': return 'System Overview Reports';
      case 'settings': return 'System Configurations';
      default: return 'Temple Administration';
    }
  };

  return (
    <div className="min-h-screen bg-background flex text-on-surface">
      {/* Sidebar - Desktop and Mobile Drawer */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleNavigate} 
        currentUser={currentUser} 
        onLogout={handleLogout}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        adminName={adminProfile.name}
        adminAvatar={adminProfile.avatar}
      />

      {/* Main Content Area Container */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="bg-surface-container/40 backdrop-blur-md border-b border-outline-variant/20 h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 md:hidden hover:bg-primary-container/10 text-primary rounded-xl transition-all cursor-pointer"
            >
              <Menu size={20} />
            </button>
            
            <h2 className="font-serif text-sm md:text-lg font-bold text-primary truncate">
              {getPageHeaderTitle()}
            </h2>
          </div>

          {/* Clock, Profile info & Notifications */}
          <div className="flex items-center gap-4">
            {/* Live UTC/IST Clock */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono font-bold text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/30">
              <Clock size={12} className="text-primary" />
              <span>{currentTime}</span>
            </div>

            {/* Profile trigger with interactive dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 hover:bg-primary-container/5 p-1.5 rounded-xl transition-all duration-150 cursor-pointer border border-transparent hover:border-outline-variant/30"
                id="profile-dropdown-trigger"
              >
                <img 
                  alt="User Profile" 
                  className="w-8 h-8 rounded-full object-cover border border-outline-variant/40"
                  src={adminProfile.avatar}
                />
                <span className="hidden sm:inline font-sans text-xs font-bold text-on-surface-variant truncate max-w-[120px]">
                  {adminProfile.name}
                </span>
                <ChevronDown size={14} className={`text-on-surface-variant transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 py-2 z-40 animate-[slideDown_0.2s_ease-out]">
                    <div className="px-4 py-2.5 border-b divider-gold mb-1.5">
                      <p className="font-sans text-xs font-bold text-on-surface truncate">{adminProfile.name}</p>
                      <p className="font-sans text-[10px] text-on-surface-variant truncate opacity-85">{adminProfile.role}</p>
                    </div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setFormName(adminProfile.name);
                        setFormEmail(adminProfile.email);
                        setFormPhone(adminProfile.phone);
                        setFormRole(adminProfile.role);
                        setFormAvatar(adminProfile.avatar);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                        setPasswordError('');
                        setProfileModalOpen(true);
                      }}
                      className="w-full flex items-center px-4 py-2.5 font-sans text-xs font-semibold text-on-surface-variant hover:bg-primary-container/5 hover:text-primary transition-all text-left cursor-pointer"
                    >
                      <User size={14} className="mr-2.5 text-primary" />
                      <span>Update Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleNavigate('settings');
                      }}
                      className="w-full flex items-center px-4 py-2.5 font-sans text-xs font-semibold text-on-surface-variant hover:bg-primary-container/5 hover:text-primary transition-all text-left cursor-pointer"
                    >
                      <SettingsIcon size={14} className="mr-2.5 text-primary" />
                      <span>System Settings</span>
                    </button>

                    <div className="border-t divider-gold my-1.5" />

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center px-4 py-2.5 font-sans text-xs font-bold text-error hover:bg-error-container hover:text-on-error-container transition-all text-left cursor-pointer"
                    >
                      <LogOut size={14} className="mr-2.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Core Screen Display Switcher */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardPortal onNavigate={handleNavigate} />
          )}

          {activeTab === 'masters_hub' && (
            <MastersHub onNavigate={handleNavigate} />
          )}

          {activeTab === 'priest_master' && (
            <PriestMaster onBack={() => handleNavigate(parentTab || 'masters_hub')} />
          )}

          {activeTab === 'seva_master' && (
            <SevaMaster onBack={() => handleNavigate(parentTab || 'masters_hub')} />
          )}

          {activeTab === 'temple_info' && (
            <TempleInfo onBack={() => handleNavigate(parentTab || 'masters_hub')} />
          )}

          {activeTab === 'temple_facilities' && (
            <TempleFacilities onBack={() => handleNavigate(parentTab || 'masters_hub')} />
          )}

          {activeTab === 'transactions' && (
            <Transactions />
          )}

          {activeTab === 'scheduling' && (
            <Scheduling onBack={() => handleNavigate(parentTab || 'masters_hub')} />
          )}

          {activeTab === 'prasadam' && (
            <Prasadam />
          )}

          {activeTab === 'system_overview' && (
            <SystemOverview />
          )}

          {activeTab === 'settings' && (
            <Settings />
          )}
        </main>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-on-primary-container border border-primary/20 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-[slideIn_0.3s_ease-out]">
            <CheckCircle size={20} className="text-primary animate-pulse" />
            <span className="font-sans text-sm font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Admin Profile Updation Screen Modal */}
        {profileModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            {/* Click outside backdrop to close */}
            <div className="absolute inset-0" onClick={() => setProfileModalOpen(false)} />

            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-[scaleUp_0.3s_ease-out]">
              {/* Header */}
              <div className="px-6 py-5 border-b divider-gold flex justify-between items-center bg-surface-container/20">
                <div>
                  <h3 className="font-serif text-xl font-bold text-primary flex items-center gap-2">
                    <User size={20} className="text-primary" />
                    Modify Administrator Profile
                  </h3>
                  <p className="font-sans text-xs text-on-surface-variant font-medium mt-1">
                    Update your system access credentials, administrative persona, and contact defaults.
                  </p>
                </div>
                <button
                  onClick={() => setProfileModalOpen(false)}
                  className="p-1.5 hover:bg-primary-container/10 text-on-surface-variant hover:text-primary rounded-full transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={(e) => {
                e.preventDefault();
                
                // Password validation logic
                if (newPassword || confirmPassword || currentPassword) {
                  if (!currentPassword) {
                    setPasswordError('Current password is required to set a new password');
                    return;
                  }
                  if (newPassword.length < 6) {
                    setPasswordError('New password must be at least 6 characters long');
                    return;
                  }
                  if (newPassword !== confirmPassword) {
                    setPasswordError('New password and confirmation password do not match');
                    return;
                  }
                }

                const updatedProfile = {
                  name: formName || adminProfile.name,
                  email: formEmail || adminProfile.email,
                  phone: formPhone || adminProfile.phone,
                  role: formRole || adminProfile.role,
                  avatar: formAvatar || adminProfile.avatar
                };

                // Save profile
                setAdminProfile(updatedProfile);
                localStorage.setItem('sankalpvani_admin_profile', JSON.stringify(updatedProfile));

                // Sync session state if email was changed
                if (formEmail && formEmail !== currentUser) {
                  setCurrentUser(formEmail);
                  localStorage.setItem('sankalpvani_session', formEmail);
                }

                setProfileModalOpen(false);
                setToastMessage('Administrative credentials and profile updated successfully!');
                setTimeout(() => setToastMessage(null), 3500);
              }} className="flex-1 overflow-y-auto p-6 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Basic Details */}
                  <div className="space-y-4">
                    <h4 className="font-serif text-sm font-bold text-primary border-b border-outline-variant/30 pb-1.5 uppercase tracking-wider">
                      Administrative Persona
                    </h4>

                    {/* Name input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                        Full Name / Title
                      </label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Chief Priest Rama Prasad"
                        required
                        className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>

                    {/* Designation / Role */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                        System Designation
                      </label>
                      <input
                        type="text"
                        value={formRole}
                        onChange={(e) => setFormRole(e.target.value)}
                        placeholder="e.g. Maha-Purohita / System Admin"
                        required
                        className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>

                    {/* Email Input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                        Primary Email Address
                      </label>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="admin@temple1.com"
                        required
                        className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>

                    {/* Phone Input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                        Emergency Contact Number
                      </label>
                      <input
                        type="text"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Right Column: Avatar Choice & Security Credentials */}
                  <div className="space-y-6">
                    {/* Presets Grid */}
                    <div className="space-y-3">
                      <h4 className="font-serif text-sm font-bold text-primary border-b border-outline-variant/30 pb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                        <Camera size={14} /> Profile Icon
                      </h4>
                      
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          'https://lh3.googleusercontent.com/aida-public/AB6AXuCvn8h5qEhb1tDXNVQmH_C-7Bf3AF9LFkxb3WKWAvVYmxKc-TcXh1fjMMz-WjPg9zbdjB7Yrhy9eiYGkJBLgHovr8GAsE2ft4v7PT9xcRcGGi3JzCKWBozxxFHni9LfCSubIqySEm5J4TesuWgBjdcdegth7w_Lsgvd39ZpYyq-IgCKk-0lzzWXTvduEcTeXKyNURY3AzLe-YP0InifLRv0R4KmiNUF_JDCpbPVweyINkAPtpA7Rfnc7ZfS2hPyvRu8cJGasIwQyYQ',
                          'https://lh3.googleusercontent.com/aida-public/AB6AXuANcPfzsfum8zGj2STDpP_Eds0xOoXxtm_OjHwVkP2MZOW3999u6oVf8P-7GeIMQA1hFSnmMM-gxsed4iDD-ruqP0OJKhI0LBMl2OTllKr3RJspedpV9pOsdDyz43dF_teOB1cC39MQgm579_rgeQq4Evh6iDEqE4aFi5LR5E3SLkqyCjsFrlyNnt_YF1ph80p1i-M4ec2yFc2A9oBE9U3sOA8W64XAiqtD-IxdDQLuoEYwwIz6gU1SePMjmWX2QVVSn1bT8aiesII',
                          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
                          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'
                        ].map((avatarUrl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormAvatar(avatarUrl)}
                            className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                              formAvatar === avatarUrl 
                                ? 'border-primary ring-2 ring-primary/20 scale-95 shadow-md' 
                                : 'border-outline-variant hover:border-primary/50'
                            }`}
                          >
                            <img src={avatarUrl} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                            {formAvatar === avatarUrl && (
                              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                <span className="bg-primary text-on-primary rounded-full p-0.5">
                                  <Check size={10} strokeWidth={3} />
                                </span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Custom Avatar URL */}
                      <div className="flex flex-col gap-1 mt-2">
                        <label className="font-sans text-[10px] font-bold text-on-surface-variant/85 uppercase">
                          Or custom avatar image URL
                        </label>
                        <input
                          type="text"
                          value={formAvatar}
                          onChange={(e) => setFormAvatar(e.target.value)}
                          placeholder="https://example.com/avatar.jpg"
                          className="w-full px-3 py-1.5 bg-surface-container-low border border-outline rounded-lg text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Change Password Section */}
                    <div className="space-y-3 pt-2">
                      <h4 className="font-serif text-sm font-bold text-primary border-b border-outline-variant/30 pb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                        <Key size={14} /> Security Credentials
                      </h4>

                      {passwordError && (
                        <div className="bg-error-container/20 text-error border border-error/20 px-3 py-2 rounded-xl flex items-start gap-2 animate-[pulse_1.5s_infinite]">
                          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                          <span className="font-sans text-xs font-semibold">{passwordError}</span>
                        </div>
                      )}

                      <div className="space-y-3.5">
                        <div className="flex flex-col gap-1">
                          <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => {
                              setCurrentPassword(e.target.value);
                              setPasswordError('');
                            }}
                            placeholder="Enter current master password"
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline rounded-xl text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => {
                                setNewPassword(e.target.value);
                                setPasswordError('');
                              }}
                              placeholder="Min 6 characters"
                              className="w-full px-3 py-2 bg-surface-container-low border border-outline rounded-xl text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setPasswordError('');
                              }}
                              placeholder="Repeat new password"
                              className="w-full px-3 py-2 bg-surface-container-low border border-outline rounded-xl text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="border-t divider-gold pt-5 flex justify-end gap-3 bg-surface-container-lowest sticky bottom-0">
                  <button
                    type="button"
                    onClick={() => setProfileModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container border border-outline-variant/40 transition-all cursor-pointer"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary hover:bg-on-primary-container text-on-primary rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Check size={14} />
                    <span>Synchronize Profile</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
