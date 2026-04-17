/**
 * Simplified New Project Page
 */

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/admin/ProjectForm.module.css';
import { compressImage } from '@/lib/utils/image-compression';

export default function NewProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [imageAlt, setImageAlt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    if (coverIndex >= index && coverIndex > 0) {
      setCoverIndex(coverIndex - 1);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('auth-token');
      const uploadedImages: string[] = [];

      // Upload all images
      for (const file of imageFiles) {
        // Compress image before upload
        console.log('[UPLOAD] Original size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
        const compressedFile = await compressImage(file, {
          maxWidth: 3840, // 4K resolution
          maxHeight: 2160, // 4K resolution
          quality: 0.95, // Higher quality
          maxSizeMB: 10, // Allow larger files
        });
        console.log('[UPLOAD] Compressed size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
        
        const formData = new FormData();
        formData.append('file', compressedFile);

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });

        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          uploadedImages.push(uploadData.data.url);
        }
      }

      const coverImage = uploadedImages[coverIndex] || uploadedImages[0] || '';

      const projectData = {
        title,
        description,
        category,
        year,
        image: coverImage,
        image_alt: imageAlt,
        images: JSON.stringify(uploadedImages)
      };

      console.log('[DEBUG] Sending project data:', projectData);
      console.log('[DEBUG] image_alt value:', imageAlt);
      console.log('[DEBUG] image_alt empty?:', imageAlt === '');

      // Create project
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      const data = await response.json();
      console.log('[DEBUG] Response data:', data);
      if (data.success) {
        router.push('/admin/projects');
      } else {
        console.error('[ERROR] Failed to create project:', data);
        alert('Failed to create project: ' + (data.error || 'Unknown error') + (data.details ? ' - ' + data.details : ''));
        setLoading(false);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1>Create New Project</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={styles.textarea}
            rows={5}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={styles.select}
          >
            <option value="">Select category</option>
            <option value="Веб-Дизайн">Web Design</option>
            <option value="Брендинг">Branding</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Типографика">Typography</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="year">Year *</label>
          <input
            type="text"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            className={styles.input}
            placeholder="2024"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image">Project Images</label>
          
          {/* Image Preview */}
          {imageFiles.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              {imageFiles.map((file, index) => (
                <div key={index} style={{ position: 'relative', border: coverIndex === index ? '3px solid #4CAF50' : '1px solid #ccc', padding: '0.5rem' }}>
                  <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setCoverIndex(index)}
                      style={{ flex: 1, padding: '0.25rem', fontSize: '0.75rem', background: coverIndex === index ? '#4CAF50' : '#fff', color: coverIndex === index ? '#fff' : '#000', border: '1px solid #ccc' }}
                    >
                      {coverIndex === index ? '✓ Cover' : 'Set Cover'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: '#f44336', color: '#fff', border: 'none' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <input
            type="file"
            id="image"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImageSelect}
            className={styles.fileInput}
          />
          <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
            Upload multiple images. Click &quot;Set Cover&quot; to choose the main image.
          </p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="imageAlt">Image Alt Text *</label>
          <input
            type="text"
            id="imageAlt"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            required
            className={styles.input}
            placeholder="Describe the image for accessibility"
          />
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={() => router.push('/admin/projects')}
            className={`${styles.button} ${styles.buttonSecondary}`}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${styles.button} ${styles.buttonPrimary}`}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
