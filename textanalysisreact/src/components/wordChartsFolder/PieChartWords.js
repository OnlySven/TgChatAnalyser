import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchTotalWordsPerUser } from './PieChartWordsData';
import { chartTitleStyle } from '../chartStyles';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EF2', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCF'
];

function PieChartWords({ folder }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalWords, setTotalWords] = useState(0); // додали стан для загальної кількості

  useEffect(() => {
    if (!folder) return;

    setLoading(true);
    setError(null);

    fetchTotalWordsPerUser(folder)
      .then((rawData) => {
        const total = rawData.reduce((sum, item) => sum + item.value, 0);
        setTotalWords(total); // зберігаємо загальну кількість слів

        const filtered = [];
        let othersTotal = 0;

        for (const item of rawData) {
          const percent = (item.value / total) * 100;
          if (percent >= 2) {
            filtered.push(item);
          } else {
            othersTotal += item.value;
          }
        }

        if (othersTotal > 0) {
          filtered.push({ label: 'Інші', value: othersTotal });
        }

        setData(filtered);
      })
      .catch((e) => {
        setError(e.message);
        setData([]);
        setTotalWords(0);
      })
      .finally(() => setLoading(false));
  }, [folder]);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h2 style={chartTitleStyle}>
        🔍 Сумарна кількість слів по користувачах {totalWords > 0 && `Всього: ${totalWords}`}
      </h2>

      {loading && <p>Завантаження даних...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && data.length > 0 && (
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              outerRadius={120}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value}`, `${name}`]} />
          </PieChart>
        </ResponsiveContainer>
      )}

      {!loading && !error && data.length === 0 && <p>Немає даних для відображення.</p>}
    </div>
  );
}

export default PieChartWords;
