export async function fetchTopUniqueEmojis(folder) {
  const url = `http://localhost:5222/api/reactionanalysis/top-unique-emojis?folder=${encodeURIComponent(folder)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Не вдалося отримати дані');
  const data = await response.json();
  return Object.entries(data).map(([label, value]) => ({ label, value }));
}

export async function fetchTopEmojisPerUser(folder, user) {
  const url = `http://localhost:5222/api/reactionanalysis/top-emojis-per-user?folder=${encodeURIComponent(folder)}&username=${encodeURIComponent(user)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Не вдалося отримати дані');
  const data = await response.json();
  return Object.entries(data).map(([label, value]) => ({ label, value }));
}
