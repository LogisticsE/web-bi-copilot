'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Dashboard from '@/components/Dashboard';
import { User } from '@/lib/types';
import { validateCredentials } from '@/lib/auth';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('portal_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('portal_user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    // Simulate network delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    const validatedUser = validateCredentials(email, password);
    
    if (validatedUser) {
      localStorage.setItem('portal_user', JSON.stringify(validatedUser));
      setUser(validatedUser);
    } else {
      setError('Invalid email or password');
    }
    
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('portal_user');
    setUser(null);
    setEmail('');
    setPassword('');
  };

  if (isLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className={styles.loginContainer}>
      {/* Decorative Elements */}
      <div className={styles.decorativeOrb1}></div>
      <div className={styles.decorativeOrb2}></div>
      <div className={styles.decorativeGrid}></div>
      
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.logoMark}>
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="14" height="14" rx="3" fill="currentColor" opacity="0.9"/>
              <rect x="22" y="4" width="14" height="14" rx="3" fill="currentColor" opacity="0.6"/>
              <rect x="4" y="22" width="14" height="14" rx="3" fill="currentColor" opacity="0.6"/>
              <rect x="22" y="22" width="14" height="14" rx="3" fill="currentColor" opacity="0.3"/>
            </svg>
          </div>
          <h1 className={styles.loginTitle}>Enterprise Portal</h1>
          <p className={styles.loginSubtitle}>Sign in to access your dashboards</p>
        </div>

        <form className={styles.loginForm} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.inputLabel}>Email Address</label>
            <div className={styles.inputWrapper}>
              <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.inputLabel}>Password</label>
            <div className={styles.inputWrapper}>
              <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <span className={styles.buttonSpinner}></span>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <div className={styles.demoCredentials}>
            <p className={styles.demoTitle}>Demo Credentials</p>
            <div className={styles.credentialsList}>
              <div className={styles.credential}>
                <span className={styles.credentialRole}>Admin:</span>
                <code>admin@admin.com / Admin123</code>
              </div>
              <div className={styles.credential}>
                <span className={styles.credentialRole}>User:</span>
                <code>user@user.com / User123</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className={styles.copyright}>© 2024 Enterprise Portal. All rights reserved.</p>
    </div>
  );
}
