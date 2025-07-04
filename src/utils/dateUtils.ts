// Date formatting utilities for admin interface
// Provides safe date rendering to prevent toLocaleDateString errors

/**
 * Safely formats a date value to a localized date string
 * @param value - Date object, date string, or timestamp
 * @param fallback - Fallback text if date is invalid
 * @returns Formatted date string or fallback
 */
export function formatDate(value: any, fallback: string = 'Not set'): string {
  if (!value) {
    return fallback;
  }

  try {
    let date: Date;

    // If it's already a Date object
    if (value instanceof Date) {
      date = value;
    }
    // If it's a string or number, convert it
    else {
      date = new Date(value);
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date value:', value);
      return fallback;
    }

    return date.toLocaleDateString();
  } catch (error) {
    console.warn('Error formatting date:', value, error);
    return fallback;
  }
}

/**
 * Safely formats a date value to a localized date and time string
 * @param value - Date object, date string, or timestamp
 * @param fallback - Fallback text if date is invalid
 * @returns Formatted date and time string or fallback
 */
export function formatDateTime(value: any, fallback: string = 'Not set'): string {
  if (!value) {
    return fallback;
  }

  try {
    let date: Date;

    // If it's already a Date object
    if (value instanceof Date) {
      date = value;
    }
    // If it's a string or number, convert it
    else {
      date = new Date(value);
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date value:', value);
      return fallback;
    }

    return date.toLocaleString();
  } catch (error) {
    console.warn('Error formatting date time:', value, error);
    return fallback;
  }
}

/**
 * Safely formats a date value to a relative time string (e.g., "2 days ago")
 * @param value - Date object, date string, or timestamp
 * @param fallback - Fallback text if date is invalid
 * @returns Relative time string or fallback
 */
export function formatRelativeTime(value: any, fallback: string = 'Unknown time'): string {
  if (!value) {
    return fallback;
  }

  try {
    let date: Date;

    // If it's already a Date object
    if (value instanceof Date) {
      date = value;
    }
    // If it's a string or number, convert it
    else {
      date = new Date(value);
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date value:', value);
      return fallback;
    }

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  } catch (error) {
    console.warn('Error formatting relative time:', value, error);
    return fallback;
  }
}

/**
 * Checks if a value is a valid date
 * @param value - Any value to check
 * @returns True if the value can be converted to a valid Date
 */
export function isValidDate(value: any): boolean {
  if (!value) return false;

  try {
    const date = new Date(value);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}

/**
 * Converts any date-like value to a Date object safely
 * @param value - Date object, date string, or timestamp
 * @returns Date object or null if invalid
 */
export function toDate(value: any): Date | null {
  if (!value) return null;

  try {
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }

    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}