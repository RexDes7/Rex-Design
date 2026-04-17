/**
 * Simplified Edit Project Page
 */

'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/admin/ProjectForm.module.css';
import { compressImage } from '@/lib/utils/image-compression';

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imageAlt, setImageAlt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        const response = await fetch(`/api/admin/projects/${params.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        if (data.success) {
          const project = data.data;
          setTitle(project.title);
          setDescription(project.description);
          setCategory(project.category);
          setYear(project.year);
          setCurrentImage(project.image || '');
          setImageAlt(project.image_alt || '');
          
          // Parse images JSON
          if (project.images) {
            try {
              const parsedImages = JSON.parse(project.images);
              setImages(Array.isArray(parsedImages) ? parsedImages : []);
            } catch {
              setImages([]);
            }
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project:', error);
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages(prev => [...prev, ...files]);
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url: string) => {
    setImages(prev => prev.filter(img => img !== url));
  };

  const setCoverImage = (url: string) => {
    setCurrentImage(url);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('auth-token');
      const allImages = [...images];

      // Upload new images if provided
      if (newImages.length > 0) {
        for (const file of newImages) {
          // Compress image before upload
          console.log('[UPLOAD] Original size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
          const compressedFile = await compressImage(file, {
            maxWidth: 1920,
            maxHeight: 1920,
            quality: 0.85,
            maxSizeMB: 1.5,
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
            allImages.push(uploadData.data.url);
          } else {
            alert('Failed to upload image: ' + (uploadData.error || 'Unknown error'));
            setSaving(false);
            return;
          }
        }
      }

      // If no cover image set, use first image
      const coverImage = currentImage || allImages[0] || '';

      // Update project
      const response = await fetch(`/api/admin/projects/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          category,
          year,
          image: coverImage,
          image_alt: imageAlt,
          images: JSON.stringify(allImages)
        })
      });

      const data = await response.json();
      if (data.success) {
        router.push('/admin/projects');
      } else {
        alert('Failed to update project');
        setSaving(false);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.pageContainer}>Loading...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1>Edit Project</h1>

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
          />
        </div>

        {/* Gallery Images */}
        <div className={styles.formGroup}>
          <label>Project Gallery</label>
          
          {/* Existing Images */}
          {images.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              {images.map((img, index) => (
                <div key={index} style={{ position: 'relative', border: currentImage === img ? '3px solid #4CAF50' : '1px solid #ccc', padding: '0.5rem' }}>
                  <img src={img} alt={`Gallery ${index + 1}`} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setCoverImage(img)}
                      style={{ flex: 1, padding: '0.25rem', fontSize: '0.75rem', background: currentImage === img ? '#4CAF50' : '#fff', color: currentImage === img ? '#fff' : '#000', border: '1px solid #ccc' }}
                    >
                      {currentImage === img ? '✓ Cover' : 'Set Cover'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img)}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: '#f44336', color: '#fff', border: 'none' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* New Images Preview */}
          {newImages.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              {newImages.map((file, index) => (
                <div key={index} style={{ position: 'relative', border: '1px solid #2196F3', padding: '0.5rem' }}>
                  <img src={URL.createObjectURL(file)} alt={`New ${index + 1}`} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.25rem 0.5rem', background: '#f44336', color: '#fff', border: 'none' }}
                  >
                    ✕
                  </button>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#2196F3' }}>New</div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          <input
            type="file"
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
          <label htmlFor="imageAlt">Cover Image Alt Text</label>
          <input
            type="text"
            id="imageAlt"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={() => router.push('/admin/projects')}
            className={`${styles.button} ${styles.buttonSecondary}`}
            disabled={saving}
          >
            Cancel
          </button>
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
