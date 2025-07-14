import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';
import { fetchTopUniqueWords, fetchFilteredWords, fetchUsersForFolder, fetchTopWordsPerUser } from './data/TopUniqueWordsChartData';
import { searchInputStyle } from '../chartStyles';

function TopUniqueWordsChart({ folder, onWordSelect }) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(''); // новий стан для вибору користувача
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Завантажуємо список користувачів при зміні папки
  useEffect(() => {
    if (!folder) return;
    fetchUsersForFolder(folder)
      .then(usersList => {
        setUsers(usersList);
        setSelectedUser(''); // скидаємо вибір користувача
      })
      .catch(() => setUsers([]));
  }, [folder]);

  useEffect(() => {
    if (!folder) return;

    setLoading(true);
    setError(null);
    setData([]);

    const fetchData = async () => {
      try {
        let result;

        if (selectedUser) {
          // Якщо вибрано користувача, завантажуємо топ слів для нього
          result = await fetchTopWordsPerUser(folder, selectedUser);
        } else if (search.trim().length > 0) {
          // Якщо є пошук, фільтруємо
          result = await fetchFilteredWords(folder, search.trim());
        } else {
          // Інакше завантажуємо загальний топ слів по папці
          result = await fetchTopUniqueWords(folder);
        }

        setData(result);

        // Автоматично вибираємо слово
        const selected = search.trim() || (result.length > 0 ? result[0].label : '');
        onWordSelect?.(selected);
      } catch (e) {
        setError(e.message);
        setData([]);
        onWordSelect?.('');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [folder, search, selectedUser, onWordSelect]);

  const chartHeight = data.length * 20 + 100;

  return (
    <div style={{ flex: 1, minWidth: 320, maxWidth: 400 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Пошук слова..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...searchInputStyle, flex: 1, marginBottom: 0 }}
        />
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          style={{ flex: '0 0 150px', padding: '6px 12px', fontSize: 16, borderRadius: 4 }}
        >
          <option value="">Усі користувачі</option>
          {users.map(user => (
            <option key={user} value={user}>{user}</option>
          ))}
        </select>
      </div>

      {loading && <p>Завантаження даних...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        data.length > 0 ? (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                scale={'linear'}
                domain={[0, 'auto']}
                label={{ value: 'Кількість', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                type="category"
                dataKey="label"
                label={{ value: 'Слово', angle: -90, position: 'insideLeft' }}
                interval={0}
                hide
              />
              <Tooltip formatter={(value) => [`${value}`, 'Кількість']} />
              <Bar dataKey="value" fill="#1976d2">
                <LabelList dataKey="label" position="insideLeft" style={{ fill: '#000', fontSize: 12 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>Дані не знайдено або сталася помилка.</p>
        )
      )}
    </div>
  );
}

export default TopUniqueWordsChart;