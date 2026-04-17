/**
 * Rate Limiter Utility
 * 
 * Tracks login attempts by IP address and enforces rate limiting
 * to protect against brute force attacks.
 * 
 * Features:
 * - Track failed login attempts per IP address
 * - Block IPs after 5 failed attempts within 15 minutes
 * - Automatic cleanup of expired attempts
 * - Thread-safe in-memory storage
 * 
 * Requirements: 11.5, 11.6, 11.7
 */

interface LoginAttempt {
  timestamp: number;
  success: boolean;
}

interface IPRecord {
  attempts: LoginAttempt[];
  blockedUntil: number | null;
}

// In-memory storage for login attempts
// In production, consider using Redis for distributed systems
const ipRecords = new Map<string, IPRecord>();

// Configuration
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes in milliseconds
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Clean up expired attempts from an IP record
 * Removes attempts older than the time window
 */
function cleanupExpiredAttempts(record: IPRecord): void {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  
  record.attempts = record.attempts.filter(
    attempt => attempt.timestamp > cutoff
  );
}

/**
 * Get or create an IP record
 */
function getIPRecord(ipAddress: string): IPRecord {
  let record = ipRecords.get(ipAddress);
  
  if (!record) {
    record = {
      attempts: [],
      blockedUntil: null
    };
    ipRecords.set(ipAddress, record);
  }
  
  return record;
}

/**
 * Check if an IP address is currently blocked
 * 
 * @param ipAddress - IP address to check
 * @returns True if blocked, false otherwise
 */
export function isIPBlocked(ipAddress: string): boolean {
  const record = getIPRecord(ipAddress);
  
  // Check if IP is currently blocked
  if (record.blockedUntil !== null) {
    const now = Date.now();
    
    if (now < record.blockedUntil) {
      // Still blocked
      return true;
    } else {
      // Block expired, clear it
      record.blockedUntil = null;
      record.attempts = [];
    }
  }
  
  return false;
}

/**
 * Get the number of failed attempts within the time window
 * 
 * @param ipAddress - IP address to check
 * @returns Number of failed attempts in the last 15 minutes
 */
export function getFailedAttempts(ipAddress: string): number {
  const record = getIPRecord(ipAddress);
  cleanupExpiredAttempts(record);
  
  return record.attempts.filter(attempt => !attempt.success).length;
}

/**
 * Get the time remaining until an IP is unblocked
 * 
 * @param ipAddress - IP address to check
 * @returns Milliseconds until unblocked, or 0 if not blocked
 */
export function getBlockTimeRemaining(ipAddress: string): number {
  const record = getIPRecord(ipAddress);
  
  if (record.blockedUntil === null) {
    return 0;
  }
  
  const now = Date.now();
  const remaining = record.blockedUntil - now;
  
  return remaining > 0 ? remaining : 0;
}

/**
 * Record a login attempt (success or failure)
 * 
 * @param ipAddress - IP address making the attempt
 * @param success - Whether the login was successful
 * @returns Object indicating if IP should be blocked
 */
export function recordLoginAttempt(
  ipAddress: string,
  success: boolean
): { blocked: boolean; attemptsRemaining: number } {
  const record = getIPRecord(ipAddress);
  const now = Date.now();
  
  // If login was successful, clear all attempts
  if (success) {
    record.attempts = [];
    record.blockedUntil = null;
    return { blocked: false, attemptsRemaining: MAX_ATTEMPTS };
  }
  
  // Record failed attempt
  record.attempts.push({
    timestamp: now,
    success: false
  });
  
  // Clean up old attempts
  cleanupExpiredAttempts(record);
  
  // Count failed attempts in the window
  const failedCount = record.attempts.filter(a => !a.success).length;
  
  // Check if we should block the IP
  if (failedCount >= MAX_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
    return { blocked: true, attemptsRemaining: 0 };
  }
  
  return {
    blocked: false,
    attemptsRemaining: MAX_ATTEMPTS - failedCount
  };
}

/**
 * Reset rate limiting for an IP address
 * Useful for testing or manual intervention
 * 
 * @param ipAddress - IP address to reset
 */
export function resetIPRateLimit(ipAddress: string): void {
  ipRecords.delete(ipAddress);
}

/**
 * Clear all rate limiting data
 * Useful for testing
 */
export function clearAllRateLimits(): void {
  ipRecords.clear();
}

/**
 * Get rate limiting statistics for monitoring
 */
export function getRateLimitStats(): {
  totalIPs: number;
  blockedIPs: number;
  totalAttempts: number;
} {
  const now = Date.now();
  let blockedCount = 0;
  let totalAttempts = 0;
  
  for (const record of ipRecords.values()) {
    if (record.blockedUntil !== null && now < record.blockedUntil) {
      blockedCount++;
    }
    totalAttempts += record.attempts.length;
  }
  
  return {
    totalIPs: ipRecords.size,
    blockedIPs: blockedCount,
    totalAttempts
  };
}
