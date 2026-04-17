'use client';

/**
 * Analytics Dashboard Page
 * 
 * Displays comprehensive analytics including page views, clicks, and form submissions.
 * Provides filtering, grouping, and visualization of analytics data.
 * 
 * Requirements: 5.3, 5.4, 5.5, 5.6, 5.7, 6.3, 6.4, 6.5, 7.2, 7.3, 7.4, 7.6, 7.7
 */

import { useState, useEffect, useCallback } from 'react';
import AnalyticsChart, {
  AnalyticsDateFilter,
  StatsCard,
  ElementStats,
} from '@/components/admin/AnalyticsChart';
import styles from '@/styles/admin/Analytics.module.css';

interface DateFilter {
  startDate: string;
  endDate: string;
  groupBy: 'day' | 'week' | 'month';
}

interface PageViewStats {
  total: number;
  unique: number;
  byPeriod: Array<{ period: string; count: number }>;
}

interface ClickStats {
  total: number;
  byElement: Array<{ elementId: string; count: number }>;
  byPeriod: Array<{ period: string; count: number }>;
}

interface SubmissionStats {
  total: number;
  byPeriod: Array<{ period: string; count: number }>;
  recent: Array<{
    id: string;
    form_id: string;
    name: string;
    email: string;
    message: string;
    read: number;
    timestamp: string;
  }>;
}

export default function AnalyticsPage() {
  const [filter, setFilter] = useState<DateFilter>({
    startDate: '',
    endDate: '',
    groupBy: 'day',
  });
  
  const [pageViewStats, setPageViewStats] = useState<PageViewStats | null>(null);
  const [clickStats, setClickStats] = useState<ClickStats | null>(null);
  const [submissionStats, setSubmissionStats] = useState<SubmissionStats | null>(null);
  const [conversionRate, setConversionRate] = useState<number>(0);
  const [uniqueVisitors, setUniqueVisitors] = useState<number>(0);
  const [topPages, setTopPages] = useState<Array<{ path: string; views: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    if (!filter.startDate || !filter.endDate) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        startDate: filter.startDate,
        endDate: filter.endDate,
        groupBy: filter.groupBy,
      });
      
      // Fetch page views
      const pageViewsRes = await fetch(`/api/admin/analytics/pageviews?${params}`);
      if (!pageViewsRes.ok) throw new Error('Failed to fetch page views');
      const pageViewsData = await pageViewsRes.json();
      setPageViewStats(pageViewsData.stats);
      setUniqueVisitors(pageViewsData.uniqueVisitors);
      setTopPages(pageViewsData.topPages);
      
      // Fetch clicks
      const clicksRes = await fetch(`/api/admin/analytics/clicks?${params}`);
      if (!clicksRes.ok) throw new Error('Failed to fetch clicks');
      const clicksData = await clicksRes.json();
      setClickStats(clicksData.stats);
      
      // Fetch submissions
      const submissionsRes = await fetch(`/api/admin/analytics/submissions?${params}`);
      if (!submissionsRes.ok) throw new Error('Failed to fetch submissions');
      const submissionsData = await submissionsRes.json();
      setSubmissionStats(submissionsData.stats);
      setConversionRate(submissionsData.conversionRate);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);
  
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);
  
  // Mark submission as read
  const handleMarkAsRead = async (submissionId: string, read: boolean) => {
    try {
      const res = await fetch('/api/admin/analytics/submissions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId,
          read,
        }),
      });
      
      if (!res.ok) throw new Error('Failed to update submission');
      
      // Refresh data
      fetchAnalytics();
    } catch (err) {
      console.error('Error updating submission:', err);
      alert('Не удалось обновить статус заявки');
    }
  };
  
  if (loading && !pageViewStats) {
    return (
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Аналитика</h1>
        <div>Загрузка...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Аналитика</h1>
        <div style={{ color: 'red' }}>Ошибка: {error}</div>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Аналитика</h1>
      
      {/* Date Filter */}
      <AnalyticsDateFilter onFilterChange={setFilter} />
      
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <StatsCard
          label="Просмотры страниц"
          value={pageViewStats?.total || 0}
          icon="visibility"
          color="#007bff"
        />
        <StatsCard
          label="Уникальные посетители"
          value={uniqueVisitors}
          icon="person"
          color="#28a745"
        />
        <StatsCard
          label="Клики"
          value={clickStats?.total || 0}
          icon="touch_app"
          color="#ffc107"
        />
        <StatsCard
          label="Заявки"
          value={submissionStats?.total || 0}
          icon="mail"
          color="#dc3545"
        />
        <StatsCard
          label="Конверсия"
          value={`${conversionRate.toFixed(2)}%`}
          icon="trending_up"
          color="#17a2b8"
        />
      </div>
      
      {/* Page Views Chart */}
      {pageViewStats && (
        <AnalyticsChart
          title="Просмотры страниц"
          data={pageViewStats.byPeriod}
          color="#007bff"
        />
      )}
      
      {/* Clicks Chart */}
      {clickStats && (
        <>
          <AnalyticsChart
            title="Клики по времени"
            data={clickStats.byPeriod}
            color="#ffc107"
          />
          <ElementStats elements={clickStats.byElement} />
        </>
      )}
      
      {/* Submissions Chart */}
      {submissionStats && (
        <AnalyticsChart
          title="Заявки по времени"
          data={submissionStats.byPeriod}
          color="#dc3545"
        />
      )}
      
      {/* Top Pages */}
      {topPages.length > 0 && (
        <div className={styles.elementStats}>
          <h3 className={styles.sectionTitle}>Популярные страницы</h3>
          <div className={styles.elementList}>
            {topPages.map((page, index) => (
              <div key={index} className={styles.elementItem}>
                <div className={styles.elementName}>{page.path}</div>
                <div className={styles.elementBar}>
                  <div
                    className={styles.elementBarFill}
                    style={{
                      width: `${(page.views / topPages[0].views) * 100}%`,
                    }}
                  />
                </div>
                <div className={styles.elementCount}>{page.views}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Recent Submissions */}
      {submissionStats && submissionStats.recent.length > 0 && (
        <div className={styles.submissionsSection}>
          <h3 className={styles.sectionTitle}>Последние заявки</h3>
          <table className={styles.submissionsTable}>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Имя</th>
                <th>Email</th>
                <th>Сообщение</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {submissionStats.recent.map((submission) => (
                <tr
                  key={submission.id}
                  className={submission.read === 0 ? styles.submissionUnread : ''}
                >
                  <td>
                    {new Date(submission.timestamp).toLocaleDateString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td>{submission.name}</td>
                  <td>{submission.email}</td>
                  <td className={styles.submissionMessage} title={submission.message}>
                    {submission.message}
                  </td>
                  <td>{submission.read === 0 ? 'Новая' : 'Прочитана'}</td>
                  <td>
                    <button
                      className={styles.readButton}
                      onClick={() =>
                        handleMarkAsRead(submission.id, submission.read === 0)
                      }
                    >
                      {submission.read === 0 ? 'Прочитать' : 'Не прочитано'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
