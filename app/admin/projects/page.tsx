/**
 * Simplified Projects List Page
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/admin/Projects.module.css';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  image: string;
  image_alt: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        const response = await fetch('/api/admin/projects', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          const normalizedProjects = (data.data || []).map((p: any) => ({
            id: p._id?.toString() || p.id || '',
            title: p.title || '',
            description: p.description || '',
            category: p.category || '',
            year: p.year || '',
            image: p.image || '',
            image_alt: p.image_alt || '',
          }));
          setProjects(normalizedProjects);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setProjects(projects.filter(p => p.id !== id));
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <Link href="/admin/projects/new" className={styles.createButton}>
          <span className="material-symbols-outlined">add</span>
          Create New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className={styles.empty}>
          <p>No projects yet. Create your first project!</p>
        </div>
      ) : (
        <div className={styles.projectsList}>
          {projects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              {project.image && (
                <div className={styles.projectImage}>
                  {!loadedImages.has(project.id) && (
                    <div className={styles.imageSkeleton} aria-hidden="true" />
                  )}
                  <Image
                    src={project.image}
                    alt={project.image_alt || project.title}
                    width={180}
                    height={120}
                    style={{ objectFit: 'cover' }}
                    className={loadedImages.has(project.id) ? styles.imageLoaded : styles.imageLoading}
                    onLoad={() => setLoadedImages(prev => new Set(prev).add(project.id))}
                  />
                </div>
              )}

              <div className={styles.projectInfo}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectMeta}>
                  {project.category} • {project.year}
                </p>
                <p className={styles.projectDescription}>
                  {typeof project.description === 'string' && project.description.length > 0
                    ? `${project.description.substring(0, 150)}${project.description.length > 150 ? '...' : ''}`
                    : 'No description'}
                </p>
              </div>

              <div className={styles.projectActions}>
                <button
                  onClick={() => router.push(`/admin/projects/${project.id}/edit`)}
                  className={styles.editButton}
                >
                  <span className="material-symbols-outlined">edit</span>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className={styles.deleteButton}
                >
                  <span className="material-symbols-outlined">delete</span>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
