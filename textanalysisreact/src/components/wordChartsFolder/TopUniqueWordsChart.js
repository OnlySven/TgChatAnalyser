import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';
import { fetchTopUniqueWords, fetchFilteredWords } from './TopUniqueWordsChartData';
import { searchInputStyle } from '../chartStyles';

function TopUniqueWordsChart({ folder }) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!folder) return;

    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        let result;
        if (search.trim().length <= 1) {
          result = await fetchTopUniqueWords(folder);
        } else {
          result = await fetchFilteredWords(folder, search.trim());
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
  }, [folder, search]);

  const chartHeight = data.length * 20 + 100;

  return (
    <div style={{ flex: 1, minWidth: 320, maxWidth: 400 }}>
      <input
        type="text"
        placeholder="Пошук слова..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={searchInputStyle}
      />

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
              <Tooltip />
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
