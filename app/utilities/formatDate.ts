export default function formatDate(isoString: string) {
  if (!isoString) return "Unknown date";

  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Helper for time formatting (e.g., "5:30 PM")
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Logic:
  // < 1 min: "Just now"
  // < 1 hour: "Xm ago"
  // < 24 hours: "Xh ago"
  // > 24 hours: "Jan 15 • 5:30 PM"

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 172800) return `Yesterday • ${time}`;

  // Default format for older dates
  return `${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} • ${time}`;
}