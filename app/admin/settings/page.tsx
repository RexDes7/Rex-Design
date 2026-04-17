/**
 * Settings Page
 * 
 * Admin panel settings page with backup management functionality.
 * Allows manual backup creation, viewing backup list, and restoration.
 * 
 * Requirements: 12.6, 12.7
 */

'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/admin/Settings.module.css';

interface Backup {
  timestamp: string;
  date: string;
  size: number;
  databaseSize: number;
  imagesSize: number;
  version: string;
}

export default function SettingsPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load backups on mount
  useEffect(() => {
    loadBackups();
  }, []);

  // Load list of backups
  const loadBackups = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/backup/list');
      const data = await response.json();

      if (data.success) {
        setBackups(data.backups);
      } else {
        showMessage('error', 'Не удалось загрузить список бэкапов');
      }
    } catch (error) {
      console.error('Error loading backups:', error);
      showMessage('error', 'Ошибка при загрузке бэкапов');
    } finally {
      setLoading(false);
    }
  };

  // Create manual backup
  const handleCreateBackup = async () => {
    setCreating(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/backup/create', {
        method: 'POST'
      });
      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Бэкап успешно создан');
        await loadBackups(); // Reload backup list
      } else {
        showMessage('error', `Ошибка создания бэкапа: ${data.message}`);
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      showMessage('error', 'Ошибка при создании бэкапа');
    } finally {
      setCreating(false);
    }
  };

  // Restore from backup
  const handleRestoreBackup = async (timestamp: string) => {
    if (!confirm('Вы уверены, что хотите восстановить данные из этого бэкапа? Текущие данные будут заменены.')) {
      return;
    }

    setRestoring(timestamp);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/backup/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ timestamp })
      });
      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Данные успешно восстановлены из бэкапа');
      } else {
        showMessage('error', `Ошибка восстановления: ${data.message}`);
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      showMessage('error', 'Ошибка при восстановлении бэкапа');
    } finally {
      setRestoring(null);
    }
  };

  // Show message
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Format file size
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get last automatic backup
  const lastAutoBackup = backups.length > 0 ? backups[0] : null;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Настройки</h1>
      <p className={styles.pageDescription}>
        Управление бэкапами и настройками системы
      </p>

      {/* Message notification */}
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {/* Backup Management Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Управление бэкапами</h2>

        {/* Last automatic backup info */}
        {lastAutoBackup && (
          <div className={styles.infoBox}>
            <h3 className={styles.infoTitle}>Последний автоматический бэкап</h3>
            <div className={styles.infoContent}>
              <p><strong>Дата:</strong> {formatDate(lastAutoBackup.date)}</p>
              <p><strong>Размер:</strong> {formatSize(lastAutoBackup.size)}</p>
              <p><strong>База данных:</strong> {formatSize(lastAutoBackup.databaseSize)}</p>
              <p><strong>Изображения:</strong> {formatSize(lastAutoBackup.imagesSize)}</p>
            </div>
          </div>
        )}

        {/* Manual backup button */}
        <div className={styles.actionBox}>
          <button
            onClick={handleCreateBackup}
            disabled={creating}
            className={styles.primaryButton}
          >
            {creating ? 'Создание бэкапа...' : 'Создать бэкап вручную'}
          </button>
          <p className={styles.helpText}>
            Автоматические бэкапы создаются ежедневно в 03:00 UTC. 
            Хранятся последние 7 бэкапов.
          </p>
        </div>

        {/* Backups list */}
        <div className={styles.backupsList}>
          <h3 className={styles.subsectionTitle}>Доступные бэкапы</h3>
          
          {loading ? (
            <p className={styles.loadingText}>Загрузка...</p>
          ) : backups.length === 0 ? (
            <p className={styles.emptyText}>Нет доступных бэкапов</p>
          ) : (
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <div className={styles.tableCell}>Дата</div>
                <div className={styles.tableCell}>Размер</div>
                <div className={styles.tableCell}>База данных</div>
                <div className={styles.tableCell}>Изображения</div>
                <div className={styles.tableCell}>Действия</div>
              </div>
              {backups.map((backup) => (
                <div key={backup.timestamp} className={styles.tableRow}>
                  <div className={styles.tableCell}>
                    {formatDate(backup.date)}
                  </div>
                  <div className={styles.tableCell}>
                    {formatSize(backup.size)}
                  </div>
                  <div className={styles.tableCell}>
                    {formatSize(backup.databaseSize)}
                  </div>
                  <div className={styles.tableCell}>
                    {formatSize(backup.imagesSize)}
                  </div>
                  <div className={styles.tableCell}>
                    <button
                      onClick={() => handleRestoreBackup(backup.timestamp)}
                      disabled={restoring !== null}
                      className={styles.restoreButton}
                    >
                      {restoring === backup.timestamp ? 'Восстановление...' : 'Восстановить'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
