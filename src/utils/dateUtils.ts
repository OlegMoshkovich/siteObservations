import { format } from 'date-fns';

export function exifDateToPostgres(dateStr: string | null) {
    // EXIF: "YYYY:MM:DD HH:MM:SS"
    // Postgres: "YYYY-MM-DD HH:MM:SS"
    if (!dateStr) return null;
    return dateStr.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
  }


// Utility to format ISO date string to "dd.MM.yyyy"
export function formatObservationDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // fallback if invalid
  return format(date, 'dd.MM.yyyy');
}

export function postgresDateToExif(dateStr: string | null) {
  // Postgres: "YYYY-MM-DD HH:MM:SS"
  // EXIF: "YYYY:MM:DD HH:MM:SS"
  if (!dateStr) return null;
  return dateStr.replace(/^(\d{4})-(\d{2})-(\d{2})/, '$1:$2:$3');
}