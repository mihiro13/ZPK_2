export function formatDateTime(date, timezone) {
    const offset = timezone * 60 * 60 * 1000;
    const newDate = new Date(date.getTime() + offset);

    const hours = String(newDate.getUTCHours()).padStart(2, '0');
    const minutes = String(newDate.getUTCMinutes()).padStart(2, '0');
    const seconds = String(newDate.getUTCSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}