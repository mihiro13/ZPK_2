export function formatDateTime(date, timezone) {
    const offset = timezone * 60 * 60 * 1000;
    const factDate = new Date(date.getTime() + offset);

    const hours = String(factDate.getUTCHours()).padStart(2, '0');
    const minutes = String(factDate.getUTCMinutes()).padStart(2, '0');
    const seconds = String(factDate.getUTCSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}