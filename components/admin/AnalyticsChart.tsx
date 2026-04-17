'use client';

/**
 * Analytics Chart Component
 * 
 * Displays analytics data with charts and filters.
 * Supports date range filtering and grouping by day/week/month.
 * 
 * Requirements: 5.4, 5.5, 6.3, 6.5, 7.3
 */

import { useState, useEffect } from 'react';
import styles from '@/styles/admin/Analytics.module.css';

interface TimeSeriesData {
  period: string;
  count: number;
}

interface AnalyticsChartProps {
  title: string;
  data: TimeSeriesData[];
  color?: string;
}

interface DateFilter {
  startDate: string;
  endDate: string;
  groupBy: 'day' | 'week' | 'month';
}

export default function AnalyticsChart({ title, data, color = '#007bff' }: AnalyticsChartProps) {
  const maxValue = Math.max(...data.map(d => d.count), 1);
  
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.chart}>
        {data.length === 0 ? (
          <div className={styles.noData}>Нет данных для отображения</div>
        ) : (
          <div className={styles.bars}>
            {data.map((item, index) => (
              <div key={index} className={styles.barWrapper}>
                <div
                  className={styles.bar}
                  style={{
                    height: `${(item.count / maxValue) * 100}%`,
                    backgroundColor: color,
                  }}
                  title={`${item.period}: ${item.count}`}
                />
                <div className={styles.barLabel}>{item.period}</div>
                <div className={styles.barValue}>{item.count}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Date Filter Component
 * 
 * Provides date range and grouping controls for analytics.
 */
interface DateFilterProps {
  onFilterChange: (filter: DateFilter) => void;
}

export function AnalyticsDateFilter({ onFilterChange }: DateFilterProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');
  
  // Set default dates (last 30 days)
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, []);
  
  // Notify parent when filter changes
  useEffect(() => {
    if (startDate && endDate) {
      onFilterChange({ startDate, endDate, groupBy });
    }
  }, [startDate, endDate, groupBy, onFilterChange]);
  
  return (
    <div className={styles.filterContainer}>
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
        <label htmlFor="groupBy" className={styles.filterLabel}>
          Группировка:
        </label>
        <select
          id="groupBy"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as 'day' | 'week' | 'month')}
          className={styles.filterSelect}
        >
          <option value="day">День</option>
          <option value="week">Неделя</option>
          <option value="month">Месяц</option>
        </select>
      </div>
    </div>
  );
}

/**
 * Stats Card Component
 * 
 * Displays a single statistic with label and value.
 */
interface StatsCardProps {
  label: string;
  value: number | string;
  icon?: string;
  color?: string;
}

export function StatsCard({ label, value, icon, color = '#007bff' }: StatsCardProps) {
  return (
    <div className={styles.statsCard}>
      {icon && (
        <div className={styles.statsIcon} style={{ color }}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      )}
      <div className={styles.statsContent}>
        <div className={styles.statsLabel}>{label}</div>
        <div className={styles.statsValue}>{value}</div>
      </div>
    </div>
  );
}

/**
 * Element Stats Component
 * 
 * Displays click statistics by element.
 */
interface ElementStatsProps {
  elements: Array<{ elementId: string; count: number }>;
}

export function ElementStats({ elements }: ElementStatsProps) {
  if (elements.length === 0) {
    return <div className={styles.noData}>Нет данных о кликах</div>;
  }
  
  const maxCount = Math.max(...elements.map(e => e.count), 1);
  
  return (
    <div className={styles.elementStats}>
      <h3 className={styles.sectionTitle}>Клики по элементам</h3>
      <div className={styles.elementList}>
        {elements.map((element, index) => (
          <div key={index} className={styles.elementItem}>
            <div className={styles.elementName}>{element.elementId}</div>
            <div className={styles.elementBar}>
              <div
                className={styles.elementBarFill}
                style={{ width: `${(element.count / maxCount) * 100}%` }}
              />
            </div>
            <div className={styles.elementCount}>{element.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
