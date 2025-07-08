export async function fetchTotalWordsPerUser(folder) {
  const response = await fetch(`http://localhost:5222/api/wordanalysis/total-words-per-user?folder=${encodeURIComponent(folder)}`);
  if (!response.ok) {
    throw new Error("Не вдалося завантажити дані");
  }

  const data = await response.json();
  return Object.entries(data).map(([label, value]) => ({ label, value }));
}