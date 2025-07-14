import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';
import { fetchTopUniqueReactions, fetchTopReactionsPerUser } from './data/TopUniqueReactionsChartData';
import { fetchTopUniqueEmojis, fetchTopEmojisPerUser } from './data/TopUniqueEmojisChartData';
import { fetchUsersForFolder } from '../wordChartsFolder/data/TopUniqueWordsChartData';

function TopUniqueReactionsChart({ folder }) {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('reactions');

  useEffect(() => {
    if (!folder) return;
    fetchUsersForFolder(folder)
      .then(usersList => {
        setUsers(usersList);
        setSelectedUser('');
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
        if (mode === 'reactions') {
          result = selectedUser
            ? await fetchTopReactionsPerUser(folder, selectedUser)
            : await fetchTopUniqueReactions(folder);
        } else {
          result = selectedUser
            ? await fetchTopEmojisPerUser(folder, selectedUser)
            : await fetchTopUniqueEmojis(folder);
        }
        setData(result);
      } catch (e) {
        setError(e.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [folder, selectedUser, mode]);

  const chartHeight = data.length * 30 + 100;

  // Нормалізація емоджі для коректного відображення
  const normalizedData = data.map(item => ({
    ...item,
    label: item.label.replace(/❤‍🔥/g, '❤️‍🔥').replace(/❤/g, '❤️').replace(/🏻/g, '👍🏻'),
  }));

  return (
    <div style={{ flex: 1, minWidth: 320, maxWidth: 400 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
        <select
          value={mode}
          onChange={e => setMode(e.target.value)}
          style={{ flex: '0 0 150px', padding: '6px 12px', fontSize: 16, borderRadius: 4 }}
        >
          <option value="reactions">Реакції</option>
          <option value="emojis">Смайлики</option>
        </select>

        <select
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
          style={{ flex: '0 0 200px', padding: '6px 12px', fontSize: 16, borderRadius: 4 }}
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
            <BarChart data={normalizedData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                scale="linear"
                domain={[0, 'auto']}
                label={{ value: 'Кількість', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                type="category"
                dataKey="label"
                label={{ value: mode === 'reactions' ? 'Реакція' : 'Смайлик', angle: -90, position: 'insideLeft' }}
                interval={0}
                hide
              />
              <Tooltip formatter={(value, name) => [`${value}`, 'Кількість']} />
              <Bar dataKey="value" fill={mode === 'reactions' ? "#ff9800" : "#2196f3"}>
                <LabelList dataKey="label" position="insideLeft" style={{ fill: '#000', fontSize: 24 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>Немає даних для відображення.</p>
        )
      )}
    </div>
  );
}

export default TopUniqueReactionsChart;