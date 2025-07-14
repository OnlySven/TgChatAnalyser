import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts';
import { fetchTopGivenReactions } from './data/TopGivenReactionsData';
import { chartTitleStyle } from '../chartStyles';

function TopGivenReactionsChart({ folder }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!folder) return;
    setLoading(true);
    setError(null);
    fetchTopGivenReactions(folder)
      .then(setData)
      .catch(err => {
        setError(err.message);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [folder]);

  const chartHeight = data.length * 30 + 100;

  return (
    <div style={{ flex: 1, minWidth: 320, maxWidth: 500 }}>
      <h2 style={chartTitleStyle}>Користувачі, що поставили найбільше реакцій</h2>
      {loading && <p>Завантаження...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && data.length > 0 && (
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
              <Tooltip formatter={(value) => [`${value}`, 'Кількість ']} />
              <Bar dataKey="value" fill="#8e44d2">
                <LabelList dataKey="label" position="insideLeft" style={{ fill: '#000', fontSize: 12 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
      )}
    </div>
  );
}

export default TopGivenReactionsChart;
