export function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = getTodayString();

  if (dateString === today) {
    return '今天';
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  if (dateString === yesterdayString) {
    return '昨天';
  }

  return date.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric'
  });
}
