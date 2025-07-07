export const fetchActivityChartData = async (type, folder) => {
  const endpoint = type === 'hour' ? 'activity-per-hour' : 'activity-per-day';
  const response = await fetch(`http://localhost:5222/api/messageanalysis/${endpoint}?folder=${encodeURIComponent(folder)}`);
  if (!response.ok) throw new Error('Помилка при отриманні активності');

  const data = await response.json();

  return Object.entries(data)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => {
      if (type === 'hour') return parseInt(a.label) - parseInt(b.label);
      const days = ['понеділок', 'вівторок', 'середа', 'четвер', 'пʼятниця', 'субота', 'неділя'];
      return days.indexOf(a.label.toLowerCase()) - days.indexOf(b.label.toLowerCase());
    });
};
