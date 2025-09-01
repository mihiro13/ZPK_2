export function formatDateTime(date) {
    const jstOffset = 9 * 60 * 60 * 1000;
    const jstDate = new Date(date.getTime() + jstOffset);

    const hours = String(jstDate.getUTCHours()).padStart(2, '0');
    const minutes = String(jstDate.getUTCMinutes()).padStart(2, '0');
    const seconds = String(jstDate.getUTCSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}