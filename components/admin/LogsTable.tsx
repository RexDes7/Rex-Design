'use client';

/**
 * Logs Table Component
 * 
 * Displays system logs with filtering, search, and pagination.
 * Supports filtering by date, type, severity and keyword search.
 * 
 * Requirements: 8.4, 8.5, 8.6
 */

import { useState, useEffect } from 'react';
import styles from '@/styles/admin/Logs.module.css';
import type { LogEntry } from '@/lib/types/logger';
import type { LogType, LogSeverity } from '@/lib/db/schema';

interface LogsTableProps {
  initialLogs?: LogEntry[];
}

const ITEMS_PER_PAGE = 50;

export default function LogsTable({ initialLogs = [] }: LogsTableProps) {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState<LogType | ''>('');
  const [severity, setSeverity] = useState<LogSeverity | ''>('');
  const [search, setSearch] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch logs when filters change
  useEffect(() => {
    fetchLogs();
  }, [startDate, endDate, type, severity, search]);
  
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      if (startDate) params.append('startDate', new Date(startDate).toISOString());
      if (endDate) params.append('endDate', new Date(endDate).toISOString());
      if (type) params.append('type', type);
      if (severity) params.append('severity', severity);
      if (search) params.append('search', search);
      
      const response = await fetch(`/api/admin/logs?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      
      const data = await response.json();
      setLogs(data.logs || []);
      setCurrentPage(1); // Reset to first page when filters change
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Pagination
  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedLogs = logs.slice(startIndex, endIndex);
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // Get severity badge class
  const getSeverityClass = (severity: LogSeverity) => {
    return styles[`severity-${severity}`] || styles['severity-info'];
  };
  
  // Get type badge class
  const getTypeClass = (type: LogType) => {
    return styles[`type-${type.replace('_', '-')}`] || styles['type-default'];
  };
  
  return (
    <div className={styles.logsContainer}>
      {/* Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label htmlFor="startDate" className={styles.filterLabel}>
              С:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.filterInput}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="endDate" className={styles.filterLabel}>
              По:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles.filterInput}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="type" className={styles.filterLabel}>
              Тип:
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as LogType | '')}
              className={styles.filterSelect}
            >
              <option value="">Все</option>
              <option value="admin_action">Действия админа</option>
              <option value="system_error">Системные ошибки</option>
              <option value="security_event">События безопасности</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="severity" className={styles.filterLabel}>
              Важность:
            </label>
            <select
              id="severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as LogSeverity | '')}
              className={styles.filterSelect}
            >
              <option value="">Все</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        
        <div className={styles.searchRow}>
          <input
            type="text"
            placeholder="Поиск по ключевым словам..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className={styles.loading}>Загрузка логов...</div>
      )}
      
      {/* Error state */}
      {error && (
        <div className={styles.error}>Ошибка: {error}</div>
      )}
      
      {/* Logs table */}
      {!loading && !error && (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.logsTable}>
              <thead>
                <tr>
                  <th>Время</th>
                  <th>Тип</th>
                  <th>Важность</th>
                  <th>Сообщение</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.noData}>
                      Логи не найдены
                    </td>
                  </tr>
                ) : (
                  paginatedLogs.map((log) => (
                    <tr key={log.id} className={styles.logRow}>
                      <td className={styles.timestamp}>
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td>
                        <span className={`${styles.badge} ${getTypeClass(log.type)}`}>
                          {log.type === 'admin_action' && 'Действие'}
                          {log.type === 'system_error' && 'Ошибка'}
                          {log.type === 'security_event' && 'Безопасность'}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${getSeverityClass(log.severity)}`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className={styles.message}>{log.message}</td>
                      <td className={styles.ip}>{log.ipAddress || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                ← Назад
              </button>
              
              <span className={styles.paginationInfo}>
                Страница {currentPage} из {totalPages} ({logs.length} записей)
              </span>
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                Вперед →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
