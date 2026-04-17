/**
 * Logs Page
 * 
 * Displays system logs with filtering and search capabilities.
 * Shows admin actions, system errors, and security events.
 * 
 * Requirements: 8.4, 8.5, 8.6
 */

import LogsTable from '@/components/admin/LogsTable';
import styles from '@/styles/admin/Analytics.module.css';

export default function LogsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Системные логи</h1>
      <p className={styles.pageDescription}>
        Просмотр и фильтрация логов системных событий, действий администратора и событий безопасности
      </p>
      
      <LogsTable />
    </div>
  );
}
