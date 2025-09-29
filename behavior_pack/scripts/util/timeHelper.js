export function formatDateTime(date, timezone) {
    const offset = timezone * 60 * 60 * 1000;
    const date = new Date(date.getTime() + offset);

    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}