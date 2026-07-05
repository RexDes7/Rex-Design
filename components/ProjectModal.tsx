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
    document.body.style.overflow = 'hidden';

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

    const timer = setTimeout(() => {
      setIsReady(true);
      setShowFloatingButton(true);
    }, 400);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
      clearTimeout(timer);
    };
  }, [onClose, lightboxImage]);

  useEffect(() => {
    if (!isReady) return;

    const handleScroll = () => {
      if (!modalRef.current || !footerRef.current) return;
      const footerRect = footerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const isFooterVisible = footerRect.top < viewportHeight - 100;
      setShowFloatingButton(!isFooterVisible);
    };

    const modal = modalRef.current;
    if (modal) {
      modal.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    return () => {
      if (modal) modal.removeEventListener('scroll', handleScroll);
    };
  }, [isReady]);

  // Parse images from JSON
  let galleryImages: string[] = [];
  if (project.images) {
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

  if (galleryImages.length === 0 && project.image) {
    galleryImages = [project.image];
  }

  return (
    <div
      className={`${styles.overlay} ${isReady ? styles.overlayReady : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Проект: ${project.title}`}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <Link
          href="/contact"
          className={`${styles.floatingCta} ${
            showFloatingButton ? styles.floatingCtaVisible : styles.floatingCtaHidden
          }`}
        >
          <span className="material-symbols-outlined">arrow_forward</span>
          <span>Заказать</span>
        </Link>

        <div className={styles.content}>
          {/* Header (above all images — like a landing page hero text) */}
          <div className={styles.header}>
            <div className={styles.headerMeta}>
              <span className={styles.category}>{project.category}</span>
              <span className={styles.year}>{project.year}</span>
            </div>
            <h2 className={styles.title}>{project.title}</h2>
            <p className={styles.description}>{project.description}</p>
          </div>

          {/* Long-scroll gallery: all images stacked, full width, natural aspect ratio */}
          {galleryImages.length > 0 && (
            <div className={styles.gallery}>
              {galleryImages.map((img, index) => {
                return (
                  <figure
                    key={index}
                    className={styles.galleryItem}
                    onClick={() => setLightboxImage(img)}
                  >
                    {!loadedImages.has(index) && (
                      <div className={styles.imageSkeleton} aria-hidden="true" />
                    )}
                    <Image
                      src={img}
                      alt={`${project.title} — изображение ${index + 1}`}
                      width={1600}
                      height={1000}
                      className={`${styles.galleryImage} ${
                        loadedImages.has(index)
                          ? styles.imageLoaded
                          : styles.imageLoading
                      }`}
                      onLoad={() =>
                        setLoadedImages((prev) => new Set(prev).add(index))
                      }
                      priority={index === 0}
                    />
                  </figure>
                );
              })}
            </div>
          )}

          {/* CTA footer */}
          <div className={styles.footer} ref={footerRef}>
            <div className={styles.footerInner}>
              <div className={styles.footerText}>
                <h3 className={styles.footerTitle}>Понравился проект?</h3>
                <p className={styles.footerDescription}>
                  Давайте создадим что-то похожее для вас.
                </p>
              </div>
              <Link href="/contact" className={styles.ctaButton}>
                Заказать проект
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox (still available on click — for zooming into details) */}
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
            aria-label="Закрыть увеличенное изображение"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
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
