/**
 * ProjectForm Component
 * 
 * Form for creating and editing projects with image upload integration.
 * 
 * Requirements: 2.2, 2.3
 */

'use client';

import { useState, FormEvent } from 'react';
import ImageUploader from './ImageUploader';
import styles from '@/styles/admin/ProjectForm.module.css';
import type { Project, ProjectCategory } from '@/lib/db/schema';

// ============================================================================
// Types
// ============================================================================

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel?: () => void;
}

export interface ProjectFormData {
  title: string;
  description: string;
  category: ProjectCategory;
  categories: ProjectCategory[]; // Multiple categories
  year: string;
  image: string;
  image_alt: string;
  wide: boolean;
  featured: boolean;
}

// ============================================================================
// Component
// ============================================================================

export default function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  // Form state
  const [formData, setFormData] = useState<ProjectFormData>({
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || 'Веб-Дизайн',
    categories: project?.categories ? (typeof project.categories === 'string' ? JSON.parse(project.categories) : project.categories) : [project?.category || 'Веб-Дизайн'],
    year: project?.year || new Date().getFullYear().toString(),
    image: project?.image || '',
    image_alt: project?.image_alt || '',
    wide: Boolean(project?.wide),
    featured: Boolean(project?.featured),
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================================================
  // Validation
  // ============================================================================

  /**
   * Validate form data
   * Requirement 2.3: Validate all required fields
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};

    // Required fields validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.categories || formData.categories.length === 0) {
      newErrors.category = 'At least one category is required';
    }

    if (!formData.year.trim()) {
      newErrors.year = 'Year is required';
    } else if (!/^\d{4}$/.test(formData.year)) {
      newErrors.year = 'Year must be a 4-digit number';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image is required';
    }

    if (!formData.image_alt.trim()) {
      newErrors.image_alt = 'Image alt text is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    if (errors[name as keyof ProjectFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCategoryToggle = (category: ProjectCategory) => {
    setFormData((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      
      // Set primary category to first selected
      const primaryCategory = categories.length > 0 ? categories[0] : 'Веб-Дизайн';
      
      return {
        ...prev,
        categories,
        category: primaryCategory
      };
    });
    
    // Clear error
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: undefined }));
    }
  };

  const handleImageUpload = (result: { url: string }) => {
    setFormData((prev) => ({ ...prev, image: result.url }));
    
    // Clear image error
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      // Error handling is done by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Title */}
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Title <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
          placeholder="Enter project title"
        />
        {errors.title && <span className={styles.error}>{errors.title}</span>}
      </div>

      {/* Description */}
      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Description <span className={styles.required}>*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
          placeholder="Enter project description"
          rows={4}
        />
        {errors.description && <span className={styles.error}>{errors.description}</span>}
      </div>

      {/* Categories */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Categories <span className={styles.required}>*</span>
        </label>
        <p className={styles.helpText}>Select one or more categories for this project</p>
        <div className={styles.categoryCheckboxes}>
          {(['Веб-Дизайн', 'Брендинг', 'Типографика', 'UI/UX', 'Инфографика', 'Полиграфия', 'Иллюстрация', 'Анимация'] as ProjectCategory[]).map((cat) => (
            <label key={cat} className={styles.categoryCheckboxLabel}>
              <input
                type="checkbox"
                checked={formData.categories.includes(cat)}
                onChange={() => handleCategoryToggle(cat)}
                className={styles.checkbox}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
        {errors.category && <span className={styles.error}>{errors.category}</span>}
      </div>

      {/* Year */}
      <div className={styles.formGroup}>
        <label htmlFor="year" className={styles.label}>
          Year <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          className={`${styles.input} ${errors.year ? styles.inputError : ''}`}
          placeholder="2024"
          maxLength={4}
        />
        {errors.year && <span className={styles.error}>{errors.year}</span>}
      </div>

      {/* Image Upload */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Project Image <span className={styles.required}>*</span>
        </label>
        <ImageUploader
          type="project"
          currentImageUrl={formData.image}
          onUploadComplete={handleImageUpload}
        />
        {errors.image && <span className={styles.error}>{errors.image}</span>}
      </div>

      {/* Image Alt Text */}
      <div className={styles.formGroup}>
        <label htmlFor="image_alt" className={styles.label}>
          Image Alt Text <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="image_alt"
          name="image_alt"
          value={formData.image_alt}
          onChange={handleChange}
          className={`${styles.input} ${errors.image_alt ? styles.inputError : ''}`}
          placeholder="Describe the image for accessibility"
        />
        {errors.image_alt && <span className={styles.error}>{errors.image_alt}</span>}
      </div>

      {/* Wide Layout */}
      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="wide"
            checked={formData.wide}
            onChange={handleChange}
            className={styles.checkbox}
          />
          <span>Wide Layout</span>
        </label>
        <p className={styles.helpText}>Display this project in wide format</p>
      </div>

      {/* Featured */}
      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className={styles.checkbox}
          />
          <span>Featured Project</span>
        </label>
        <p className={styles.helpText}>Highlight this project on the homepage</p>
      </div>

      {/* Form Actions */}
      <div className={styles.formActions}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}
