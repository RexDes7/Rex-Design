'use client';

import { useState } from 'react';
import ContentEditor from '@/components/admin/ContentEditor';
import styles from '@/styles/admin/Content.module.css';

export default function ContentPage() {
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleSave = () => {
    setNotification({
      type: 'success',
      message: 'Content saved successfully!',
    });

    // Clear notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Edit Site Content</h1>
        <p className={styles.description}>
          Manage your site content, including about section, manifesto, skills, and contact information.
        </p>
      </div>

      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <ContentEditor onSave={handleSave} />
    </div>
  );
}

