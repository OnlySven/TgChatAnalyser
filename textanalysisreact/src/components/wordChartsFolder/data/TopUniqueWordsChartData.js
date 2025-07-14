export async function fetchTopUniqueWords(folder) {
  const url = `http://localhost:5222/api/wordanalysis/top-unique-words?folder=${encodeURIComponent(folder)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Не вдалося отримати дані');
  const data = await response.json();
  return Object.entries(data).map(([word, count]) => ({
    label: word,
    value: count,
  }));
}

export async function fetchFilteredWords(folder, word) {
  if (!word || word.trim() === '') {
    return fetchTopUniqueWords(folder);
  }

  const url = `http://localhost:5222/api/wordanalysis/top-filtered-words?folder=${encodeURIComponent(folder)}&word=${encodeURIComponent(word)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Не вдалося отримати дані');
  const data = await response.json();
  return Object.entries(data).map(([word, count]) => ({
    label: word,
    value: count,
  }));
}

export async function fetchTopWordsPerUser(folder, user) {
  if (!user || user.trim() === '') {
    return fetchTopUniqueWords(folder);
  }

  const url = `http://localhost:5222/api/wordanalysis/top-words-per-user?folder=${encodeURIComponent(folder)}&username=${encodeURIComponent(user)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Не вдалося отримати дані');
  const data = await response.json();
  return Object.entries(data).map(([word, count]) => ({
    label: word,
    value: count,
  }));
}

export async function fetchUsersForFolder(folder) {
  const url = `http://localhost:5222/api/wordanalysis/users?folder=${encodeURIComponent(folder)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Не вдалося отримати список користувачів');
  const data = await response.json();
  return data;
}
