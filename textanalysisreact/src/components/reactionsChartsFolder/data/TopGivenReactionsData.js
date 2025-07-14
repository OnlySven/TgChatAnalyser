export async function fetchTopGivenReactions(folder) {
  const url = `http://localhost:5222/api/reactionanalysis/top-given-reactions-per-user?folder=${encodeURIComponent(folder)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Не вдалося отримати дані');
  const data = await response.json();
  return Object.entries(data).map(([user, count]) => ({
    label: user,
    value: count,
  }));
}
