export async function fetchTopUniqueReactions(folder) {
  const url = `http://localhost:5222/api/reactionanalysis/top-unique-reactions?folder=${encodeURIComponent(folder)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Не вдалося отримати реакції');
  const data = await response.json();
  return Object.entries(data).map(([reaction, count]) => ({
    label: reaction,
    value: count,
  }));
}

export async function fetchTopReactionsPerUser(folder, user) {
  const url = `http://localhost:5222/api/reactionanalysis/top-reactions-per-user?folder=${encodeURIComponent(folder)}&username=${encodeURIComponent(user)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Не вдалося отримати реакції користувача');
  const data = await response.json();
  return Object.entries(data).map(([reaction, count]) => ({
    label: reaction,
    value: count,
  }));
}
