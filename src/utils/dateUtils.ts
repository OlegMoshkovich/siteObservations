export function exifDateToPostgres(dateStr: string | null) {
    // EXIF: "YYYY:MM:DD HH:MM:SS"
    // Postgres: "YYYY-MM-DD HH:MM:SS"
    if (!dateStr) return null;
    return dateStr.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
  }