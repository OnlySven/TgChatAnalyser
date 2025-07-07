export const fetchMessagesChartData = async (type, folder) => {
  const endpoint = `messages-per-${type}`;
  const response = await fetch(`http://localhost:5222/api/messageanalysis/${endpoint}?folder=${encodeURIComponent(folder)}`);
  if (!response.ok) throw new Error('Помилка при отриманні повідомлень');
  
  const data = await response.json();

  return Object.entries(data).map(([label, count]) => ({ label, count }));
};
