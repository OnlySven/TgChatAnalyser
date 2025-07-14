export async function fetchWordFrequencyPerUser(folder, word) {
  if (!folder || !word) return [];

  const url = `http://localhost:5222/api/wordanalysis/word-frequency-per-user?folder=${encodeURIComponent(folder)}&word=${encodeURIComponent(word)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Не вдалося отримати дані');

  const data = await response.json();
  return Object.entries(data).map(([user, count]) => ({
    label: user,
    value: count,
  }));
}