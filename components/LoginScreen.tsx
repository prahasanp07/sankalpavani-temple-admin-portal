'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (email: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('admin@temple1.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authenticating
    setTimeout(() => {
      if (email.trim() && password.trim()) {
        onLoginSuccess(email);
      } else {
        setError('Please enter both Email and Password.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-background text-on-surface">
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBID-dWLCOnrauvnfNg65tnBI3NvcIqcncVBRA1Ps0X-nJ6XIr7IFu8P6mzYisgZcyFgD4Gjw4GFThVg4veOvVfDSFaMFDzFqVoh8gLdJ5GhihfNqJoHTEv6RITgyoODWCYPPF_GNgj9gi2ndfmUCD4wk3qcWgAQdz3MzEgQVsPM_EcYr7qk2otj5uI3HM-jQy-EU7PpPlrDqXXgKyGOGECk-7ftFCRoHInNz6JzYV2cOWvgtZO5qI1mqpqR3qcQktPvoRC_WdfW1w')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>
        <div className="absolute inset-0 bg-pattern"></div>
      </div>

      <div className="flex-grow flex items-center justify-center p-4 md:p-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl sacred-glow border-t-4 border-primary border-x border-b border-outline-variant/30 overflow-hidden"
        >
          {/* Card Header */}
          <div className="p-8 pb-0 text-center flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-4"
            >
              <span className="material-symbols-outlined text-on-primary-container" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>
                temple_hindu
              </span>
            </motion.div>
            <h1 className="font-serif font-bold text-3xl md:text-4xl text-primary mb-2">
              SankalpVani
            </h1>
            <p className="font-sans text-sm text-on-surface-variant font-medium tracking-wide uppercase">
              Admin Portal Login
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="p-3 bg-error-container text-on-error-container rounded-lg text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label 
                htmlFor="email"
                className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 bg-white/50 border border-outline rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="admin@temple1.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label 
                htmlFor="password"
                className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-white/50 border border-outline rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="••••••••"
                required
              />

              <div className="flex justify-end mt-1">
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); alert('Please contact the head priest or system administrator to reset password.'); }} 
                  className="font-sans text-xs text-primary hover:text-on-primary-container transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-on-primary-container text-on-primary font-bold py-3 px-4 rounded-lg shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isLoading ? 'Authenticating...' : 'Log In'}</span>
              {!isLoading && <ArrowRight size={18} />}
            </button>

            <div className="text-center pt-2">
              <p className="font-sans text-xs text-on-surface-variant font-medium tracking-wide">
                Authorized personnel only.
              </p>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      {/* <footer className="relative z-10 py-6 text-center">
        <p className="font-sans text-xs text-on-surface-variant font-medium opacity-80">
          Powered by ShreePMCS & PraGana Innovations
        </p>
      </footer>  */}
    </div>
  );
}
