'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/types/project';
import styles from '@/styles/ProjectModal.module.css';

interface ProjectModalProps {
  project: Project & { images?: string };
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Handle ESC key
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxImage) {
          setLightboxImage(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    
    // Show button after modal animation completes
    setTimeout(() => {
      setIsReady(true);
      setShowFloatingButton(true);
    }, 500);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose, lightboxImage]);

  useEffect(() => {
    if (!isReady) return;
    
    // Check if footer is visible
    const handleScroll = () => {
      if (!modalRef.current || !footerRef.current) return;

      const footerRect = footerRef.current.getBoundingClientRect();
      
      // Calculate if footer is in the visible viewport
      // Footer is visible when its top is above the bottom of the viewport
      const viewportHeight = window.innerHeight;
      const isFooterVisible = footerRect.top < viewportHeight - 100; // 100px threshold
      
      setShowFloatingButton(!isFooterVisible);
    };

    const modal = modalRef.current;
    if (modal) {
      modal.addEventListener('scroll', handleScroll);
      // Check initial state
      handleScroll();
    }

    return () => {
      if (modal) {
        modal.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isReady]);

  // Parse images from JSON
  let galleryImages: string[] = [];
  if (project.images) {
    // Check if images is already an array or a string
    if (Array.isArray(project.images)) {
      galleryImages = project.images;
    } else if (typeof project.images === 'string') {
      try {
        const parsed = JSON.parse(project.images);
        galleryImages = Array.isArray(parsed) ? parsed : [];
      } catch {
        galleryImages = [];
      }
    }
  }
  
  // If no gallery images, use main image
  if (galleryImages.length === 0 && project.image) {
    galleryImages = [project.image];
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} ref={modalRef}>
        {/* Close button */}
        <button 
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Floating CTA Button */}
        <Link 
          href="/contact" 
          className={`${styles.floatingCta} ${showFloatingButton ? styles.floatingCtaVisible : styles.floatingCtaHidden}`}
        >
          <span className="material-symbols-outlined">arrow_forward</span>
          <span>Заказать</span>
        </Link>

        {/* Content */}
        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <h2 className={styles.title}>{project.title}</h2>
            <div className={styles.metadata}>
              <span className={styles.badge}>{project.category}</span>
              <span className={styles.badge}>{project.year}</span>
            </div>
          </div>

          {/* Description */}
          <p className={styles.description}>{project.description}</p>

          {/* Gallery */}
          <div className={styles.gallery}>
            {galleryImages.map((img, index) => (
              <div 
                key={index} 
                className={styles.imageWrapper}
                onClick={() => setLightboxImage(img)}
                style={{ cursor: 'pointer' }}
              >
                {!loadedImages.has(index) && (
                  <div className={styles.imageSkeleton} aria-hidden="true" />
                )}
                <Image
                  src={img}
                  alt={`${project.title} - Image ${index + 1}`}
                  width={1200}
                  height={800}
                  className={`${styles.image} ${loadedImages.has(index) ? styles.imageLoaded : styles.imageLoading}`}
                  onLoad={() => setLoadedImages(prev => new Set(prev).add(index))}
                />
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className={styles.footer} ref={footerRef}>
            <Link href="/contact" className={styles.ctaButton}>
              ЗАКАЗАТЬ ПРОЕКТ
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className={styles.lightbox} 
          onClick={(e) => {
            e.stopPropagation();
            setLightboxImage(null);
          }}
        >
          <button 
            className={styles.lightboxClose}
            onClick={(e) => {
              e.stopPropagation();
              setLightboxImage(null);
            }}
            aria-label="Close lightbox"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightboxImage}
              alt={project.title}
              width={1920}
              height={1080}
              className={styles.lightboxImage}
              quality={100}
            />
          </div>
        </div>
      )}
    </div>
  );
}
