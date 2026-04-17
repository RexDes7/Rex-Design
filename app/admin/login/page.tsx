/**
 * Admin Login Page
 * 
 * Provides a login form for admin authentication with CSRF protection.
 * Requirements: 1.1, 1.3, 11.2
 */

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/admin/Login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('Starting login process...');

    try {
      console.log('Sending login request...');
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        // Handle different error types
        if (response.status === 429) {
          setError(data.error?.message || 'Too many login attempts. Please try again later.');
        } else if (response.status === 401) {
          setError(data.error?.message || 'Invalid email or password');
          
          // Show attempts remaining warning if available
          if (data.error?.warning) {
            setError(data.error.warning);
          }
        } else {
          setError('An error occurred during login. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      // Successful login - redirect to admin dashboard
      console.log('Login successful, redirecting...');
      
      // Store token in localStorage as fallback
      if (data.token) {
        try {
          localStorage.setItem('auth-token', data.token);
          console.log('Token stored in localStorage');
          
          // Also try to set cookie
          document.cookie = `auth-token=${data.token}; path=/`;
          
          // Redirect immediately
          window.location.replace('/admin');
        } catch (err) {
          console.error('Failed to store token:', err);
          setError('Failed to save authentication. Please try again.');
          setIsLoading(false);
        }
      } else {
        setError('Login successful but no token received');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check your connection and try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.subtitle}>Sign in to manage your portfolio</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              autoComplete="email"
              disabled={isLoading}
              placeholder="admin@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              autoComplete="current-password"
              disabled={isLoading}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
