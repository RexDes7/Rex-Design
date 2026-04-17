/**
 * Simplified Admin Dashboard Page
 */

'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/admin/Dashboard.module.css';

interface Stats {
  totalProjects: number;
  pageviewsLast30Days: number;
  recentPageviews: Array<{
    path: string;
    timestamp: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        const response = await fetch('/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎨</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats?.totalProjects || 0}</div>
            <div className={styles.statLabel}>Total Projects</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>👁️</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats?.pageviewsLast30Days || 0}</div>
            <div className={styles.statLabel}>Page Views (30 days)</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats?.recentPageviews?.length || 0}</div>
            <div className={styles.statLabel}>Recent Views</div>
          </div>
        </div>
      </div>

      <div className={styles.activitySection}>
        <h2 className={styles.sectionTitle}>Recent Page Views</h2>
        <div className={styles.activityList}>
          {stats?.recentPageviews && stats.recentPageviews.length > 0 ? (
            stats.recentPageviews.map((view, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityMessage}>{view.path}</div>
                <div className={styles.activityTime}>
                  {new Date(view.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>No recent views</div>
          )}
        </div>
      </div>
    </div>
  );
}
