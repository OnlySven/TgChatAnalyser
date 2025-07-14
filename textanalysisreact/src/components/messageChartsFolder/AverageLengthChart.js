import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList
} from 'recharts';
import { fetchAverageLength } from './data/AverageLengthChartData';
import { chartTitleStyle } from '../chartStyles';

function AverageLengthChart({ folder }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!folder) return;

    setLoading(true);
    setError(null);

    fetchAverageLength(folder)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [folder]);

  const chartHeight = data.length * 20 + 100;
  const isLogScale = data.length > 2;

  return (
    <div style={{ flex: 1, minWidth: 320, maxWidth: 400 }}>
      <h2 style={chartTitleStyle}>📏 Середня довжина повідомлень</h2>

      {loading && <p>Завантаження...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              scale={isLogScale ? 'log' : 'linear'}
              domain={[isLogScale ? 'auto' : 0, 'auto']}
              label={{ value: 'Кількість', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              type="category"
              dataKey="label"
              label={{ value: 'Користувач', angle: -90, position: 'insideLeft' }}
              interval={0}
              hide
            />
            <Tooltip formatter={(value, name) => [`${value}`, 'Кількість символів']} />
            <Bar dataKey="value" fill="#4caf50">
              <LabelList dataKey="label" position="insideLeft" style={{ fill: '#000', fontSize: 12 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        !loading && !error && <p>Дані не знайдено або сталася помилка.</p>
      )}
    </div>
  );
}

export default AverageLengthChart;