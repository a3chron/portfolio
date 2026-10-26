/**
 * European date for display: "2024-01-10" -> "10.01.2024".
 *
 * Formats the ISO date string itself rather than going through
 * Date/Intl: those follow the server's or browser's locale (US formats in an
 * English browser) and time zone, which can shift a midnight-UTC date by a day.
 */
export function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.slice(0, 10).split("-");
  return `${day}.${month}.${year}`;
}
