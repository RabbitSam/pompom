export default function formatDate(dateString: Date | string): string {
    const date : Date = new Date(dateString);

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour12: true,
        hour: "2-digit",
        minute: "2-digit"
    });
}