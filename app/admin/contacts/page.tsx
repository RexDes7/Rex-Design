/**
 * Simplified Contacts Page
 */

'use client';

import { useState, useEffect, FormEvent } from 'react';
import styles from '@/styles/admin/ProjectForm.module.css';

export default function ContactsPage() {
  const [email, setEmail] = useState('');
  const [telegram, setTelegram] = useState('');
  const [phone, setPhone] = useState('');
  const [behance, setBehance] = useState('');
  const [dribbble, setDribbble] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        const response = await fetch('/api/admin/contacts', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        if (data.success) {
          setEmail(data.data.email || '');
          setTelegram(data.data.telegram || '');
          setPhone(data.data.phone || '');
          setBehance(data.data.behance || '');
          setDribbble(data.data.dribbble || '');
          setAvatar(data.data.avatar || '');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('auth-token');
      let avatarUrl = avatar;

      // Upload avatar if provided
      if (avatarFile && avatarFile.size > 0) {
        const formData = new FormData();
        formData.append('file', avatarFile);

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });

        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          avatarUrl = uploadData.data.url;
        } else {
          alert('Failed to upload avatar: ' + (uploadData.error || 'Unknown error'));
          setSaving(false);
          return;
        }
      }
      
      const response = await fetch('/api/admin/contacts', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          telegram,
          phone,
          behance,
          dribbble,
          avatar: avatarUrl
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('Saved!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save: ' + (data.error || 'Unknown error'));
      }
      setSaving(false);
    } catch (error) {
      console.error('Error saving contacts:', error);
      setMessage('Failed to save');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--color-gray-light)' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Contact Information</h1>
        <p className={styles.subtitle}>Manage your contact details and social links</p>
      </div>

      {message && (
        <div className={`${styles.message} ${message.includes('Failed') ? styles.messageError : styles.messageSuccess}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Contact Details</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email <span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>Phone</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={styles.input}
              placeholder="+7 (999) 123-45-67"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="telegram" className={styles.label}>Telegram</label>
            <input
              type="text"
              id="telegram"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              className={styles.input}
              placeholder="@username"
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Social Links</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="behance" className={styles.label}>Behance</label>
            <input
              type="url"
              id="behance"
              value={behance}
              onChange={(e) => setBehance(e.target.value)}
              className={styles.input}
              placeholder="https://behance.net/username"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dribbble" className={styles.label}>Dribbble</label>
            <input
              type="url"
              id="dribbble"
              value={dribbble}
              onChange={(e) => setDribbble(e.target.value)}
              className={styles.input}
              placeholder="https://dribbble.com/username"
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Profile Picture</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="avatar" className={styles.label}>Avatar Image</label>
            {avatar && (
              <div style={{ marginBottom: '1rem' }}>
                <img 
                  src={avatar} 
                  alt="Current avatar" 
                  style={{ 
                    maxWidth: '200px', 
                    borderRadius: '8px',
                    border: '1px solid rgba(201, 169, 110, 0.2)' 
                  }} 
                />
              </div>
            )}
            <input
              type="file"
              id="avatar"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              className={styles.input}
            />
            <p className={styles.helpText}>
              Upload your profile picture for the About page (JPEG, PNG, or WebP)
            </p>
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={`${styles.button} ${styles.buttonPrimary}`}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
