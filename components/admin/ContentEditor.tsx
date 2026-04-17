'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/admin/ContentEditor.module.css';

interface ManifestoPrinciple {
  title: string;
  description: string;
}

interface Skill {
  name: string;
  level: number;
}

interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

interface SiteContent {
  about: string;
  manifesto: ManifestoPrinciple[];
  skills: Skill[];
}

interface ContactInfo {
  email: string;
  phone: string | null;
  social_links: SocialLink[];
}

interface ContentEditorProps {
  onSave?: () => void;
}

export default function ContentEditor({ onSave }: ContentEditorProps) {
  const [activeTab, setActiveTab] = useState<'site' | 'contact'>('site');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Site content state
  const [siteContent, setSiteContent] = useState<SiteContent>({
    about: '',
    manifesto: [],
    skills: [],
  });
  
  // Contact info state
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phone: null,
    social_links: [],
  });
  
  // Load content on mount
  useEffect(() => {
    loadContent();
  }, []);
  
  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/content');
      
      if (!response.ok) {
        throw new Error('Failed to load content');
      }
      
      const data = await response.json();
      
      setSiteContent(data.site);
      setContactInfo(data.contact);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveSiteContent = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'site',
          data: siteContent,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save site content');
      }
      
      setSuccess('Site content saved successfully');
      setShowPreview(false);
      
      if (onSave) {
        onSave();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save site content');
    } finally {
      setSaving(false);
    }
  };
  
  const handleSaveContactInfo = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact',
          data: contactInfo,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save contact info');
      }
      
      setSuccess('Contact info saved successfully');
      setShowPreview(false);
      
      if (onSave) {
        onSave();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save contact info');
    } finally {
      setSaving(false);
    }
  };
  
  const addManifestoPrinciple = () => {
    setSiteContent({
      ...siteContent,
      manifesto: [...siteContent.manifesto, { title: '', description: '' }],
    });
  };
  
  const removeManifestoPrinciple = (index: number) => {
    setSiteContent({
      ...siteContent,
      manifesto: siteContent.manifesto.filter((_, i) => i !== index),
    });
  };
  
  const updateManifestoPrinciple = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...siteContent.manifesto];
    updated[index] = { ...updated[index], [field]: value };
    setSiteContent({ ...siteContent, manifesto: updated });
  };
  
  const addSkill = () => {
    setSiteContent({
      ...siteContent,
      skills: [...siteContent.skills, { name: '', level: 50 }],
    });
  };
  
  const removeSkill = (index: number) => {
    setSiteContent({
      ...siteContent,
      skills: siteContent.skills.filter((_, i) => i !== index),
    });
  };
  
  const updateSkill = (index: number, field: 'name' | 'level', value: string | number) => {
    const updated = [...siteContent.skills];
    updated[index] = { ...updated[index], [field]: value };
    setSiteContent({ ...siteContent, skills: updated });
  };
  
  const addSocialLink = () => {
    setContactInfo({
      ...contactInfo,
      social_links: [...contactInfo.social_links, { platform: '', url: '', icon: '' }],
    });
  };
  
  const removeSocialLink = (index: number) => {
    setContactInfo({
      ...contactInfo,
      social_links: contactInfo.social_links.filter((_, i) => i !== index),
    });
  };
  
  const updateSocialLink = (index: number, field: 'platform' | 'url' | 'icon', value: string) => {
    const updated = [...contactInfo.social_links];
    updated[index] = { ...updated[index], [field]: value };
    setContactInfo({ ...contactInfo, social_links: updated });
  };
  
  if (loading) {
    return <div className={styles.loading}>Loading content...</div>;
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'site' ? styles.active : ''}`}
          onClick={() => setActiveTab('site')}
        >
          Site Content
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'contact' ? styles.active : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          Contact Info
        </button>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
      
      {activeTab === 'site' && (
        <div className={styles.content}>
          <h2>Site Content</h2>
          
          {/* About Section */}
          <div className={styles.section}>
            <label htmlFor="about">About</label>
            <textarea
              id="about"
              className={styles.richTextEditor}
              value={siteContent.about}
              onChange={(e) => setSiteContent({ ...siteContent, about: e.target.value })}
              rows={10}
              placeholder="Enter about text..."
            />
          </div>
          
          {/* Manifesto Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Manifesto Principles</h3>
              <button
                type="button"
                className={styles.addButton}
                onClick={addManifestoPrinciple}
              >
                + Add Principle
              </button>
            </div>
            
            {siteContent.manifesto.map((principle, index) => (
              <div key={index} className={styles.listItem}>
                <input
                  type="text"
                  placeholder="Title"
                  value={principle.title}
                  onChange={(e) => updateManifestoPrinciple(index, 'title', e.target.value)}
                  className={styles.input}
                />
                <textarea
                  placeholder="Description"
                  value={principle.description}
                  onChange={(e) => updateManifestoPrinciple(index, 'description', e.target.value)}
                  className={styles.textarea}
                  rows={3}
                />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeManifestoPrinciple(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          {/* Skills Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Skills</h3>
              <button
                type="button"
                className={styles.addButton}
                onClick={addSkill}
              >
                + Add Skill
              </button>
            </div>
            
            {siteContent.skills.map((skill, index) => (
              <div key={index} className={styles.listItem}>
                <input
                  type="text"
                  placeholder="Skill name"
                  value={skill.name}
                  onChange={(e) => updateSkill(index, 'name', e.target.value)}
                  className={styles.input}
                />
                <div className={styles.skillLevel}>
                  <label>Level: {skill.level}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skill.level}
                    onChange={(e) => updateSkill(index, 'level', parseInt(e.target.value))}
                    className={styles.slider}
                  />
                </div>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeSkill(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.previewButton}
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              type="button"
              className={styles.saveButton}
              onClick={handleSaveSiteContent}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          
          {showPreview && (
            <div className={styles.preview}>
              <h3>Preview</h3>
              <div className={styles.previewContent}>
                <h4>About</h4>
                <p>{siteContent.about}</p>
                
                <h4>Manifesto</h4>
                {siteContent.manifesto.map((principle, index) => (
                  <div key={index}>
                    <strong>{principle.title}</strong>
                    <p>{principle.description}</p>
                  </div>
                ))}
                
                <h4>Skills</h4>
                {siteContent.skills.map((skill, index) => (
                  <div key={index}>
                    {skill.name}: {skill.level}%
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'contact' && (
        <div className={styles.content}>
          <h2>Contact Information</h2>
          
          {/* Email */}
          <div className={styles.section}>
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={contactInfo.email}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              placeholder="email@example.com"
              required
            />
          </div>
          
          {/* Phone */}
          <div className={styles.section}>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              className={styles.input}
              value={contactInfo.phone || ''}
              onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value || null })}
              placeholder="+1 234 567 8900"
            />
          </div>
          
          {/* Social Links */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Social Links</h3>
              <button
                type="button"
                className={styles.addButton}
                onClick={addSocialLink}
              >
                + Add Link
              </button>
            </div>
            
            {contactInfo.social_links.map((link, index) => (
              <div key={index} className={styles.listItem}>
                <input
                  type="text"
                  placeholder="Platform (e.g., Twitter, LinkedIn)"
                  value={link.platform}
                  onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                  className={styles.input}
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                  className={styles.input}
                />
                <input
                  type="text"
                  placeholder="Icon (optional)"
                  value={link.icon || ''}
                  onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeSocialLink(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.previewButton}
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              type="button"
              className={styles.saveButton}
              onClick={handleSaveContactInfo}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          
          {showPreview && (
            <div className={styles.preview}>
              <h3>Preview</h3>
              <div className={styles.previewContent}>
                <p><strong>Email:</strong> {contactInfo.email}</p>
                {contactInfo.phone && <p><strong>Phone:</strong> {contactInfo.phone}</p>}
                
                <h4>Social Links</h4>
                {contactInfo.social_links.map((link, index) => (
                  <div key={index}>
                    {link.platform}: {link.url}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

