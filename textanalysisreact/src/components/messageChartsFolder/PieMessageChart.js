import React, { useEffect, useState, useMemo } from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { fetchPieChartData } from './data/PieMessageChartData';
import { chartTitleStyle } from '../chartStyles';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#33AA77', '#7777FF', '#FF44AA'];

function PieMessageChart({ folder }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!folder) return;

    setLoading(true);
    setError(null);

    fetchPieChartData(folder)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [folder]);

  const processedData = useMemo(() => {
    if (!data.length) return [];

    const total = data.reduce((sum, entry) => sum + entry.value, 0);

    const mainItems = [];
    let othersSum = 0;

    data.forEach(entry => {
      if (entry.value / total < 0.02) {
        othersSum += entry.value;
      } else {
        mainItems.push(entry);
      }
    });

    if (othersSum > 0) {
      mainItems.push({ name: 'Інші', value: othersSum });
    }

    return mainItems;
  }, [data]);

  const totalMessages = useMemo(() => {
    return data.reduce((sum, entry) => sum + entry.value, 0);
  }, [data]);

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!processedData.length) return <p>Дані відсутні.</p>;

  return (
    <div>
      <h2 style={chartTitleStyle}>
        📊 Загальна кількість повідомлень: {totalMessages}
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={processedData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
          >
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieMessageChart;
