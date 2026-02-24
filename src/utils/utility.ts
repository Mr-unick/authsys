import { PaginationInstance } from "./instances";

/**
 * Formats a date to a datetime-local input value string.
 * Returns a string in format "YYYY-MM-DDTHH:MM".
 */
export function formatDateToShow(originalDate: string | Date | null | undefined): string {
  if (!originalDate) return '';
  const date = new Date(originalDate);
  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Formats a timestamp to a localized date string (dd/mm/yyyy) and optional time.
 */
export const formatDateTime = (timestamp: string | Date | null | undefined): string => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'N/A';

  const formattedDate = date.toLocaleDateString('en-GB');
  const timeString = date.toISOString().split('T')[1].slice(0, 8);

  return `${formattedDate}, ${timeString}`;
};

/**
 * Returns a relative time string (e.g. "2 minutes ago").
 */
export const getRelativeTime = (timestamp: string | Date | null | undefined): string => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'N/A';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
};


/**
 * Maps lead source data to chart-compatible format with HSL colors.
 */
export function mapLeadSourcesToChartData(sources: Array<{ source: string; count: any }>) {
  const colors = [
    'hsl(240, 100%, 50%)',
    'hsl(215, 100%, 50%)',
    'hsl(210, 80%, 55%)',
    'hsl(190, 70%, 50%)',
    'hsl(170, 60%, 50%)',
    'hsl(150, 50%, 50%)',
    'hsl(130, 40%, 50%)',
    'hsl(110, 30%, 50%)',
    'hsl(90, 20%, 50%)',
    'hsl(70, 10%, 50%)',
  ];

  return sources.map((source, index) => ({
    label: source.source,
    value: Number(source.count),
    fill: colors[index % colors.length],
  }));
}

/**
 * Calculates pagination metadata.
 */
export function getPagination(page: number, perPage: number = 10, totalRows: number): PaginationInstance {
  const totalPages = Math.ceil(totalRows / perPage);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const startIndex = (page - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage - 1, totalRows - 1);

  return {
    page,
    perPage,
    totalPages,
    totalRows,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
  };
}