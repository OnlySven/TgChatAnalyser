export async function fetchPieChartData(folder) {
  const url = `http://localhost:5222/api/messageanalysis/messages-count?folder=${encodeURIComponent(folder)}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Помилка при отриманні загальної кількості повідомлень');

  const data = await response.json();
  return Object.entries(data).map(([name, value]) => ({ name, value }));
}
