export async function fetchAverageLength(folder) {
  const url = `http://localhost:5222/api/messageanalysis/messages-average-length?folder=${encodeURIComponent(folder)}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Помилка при отриманні середньої довжини');

  const data = await response.json();
  return Object.entries(data).map(([user, avgLength]) => ({
    label: user,
    value: avgLength,
  }));
}