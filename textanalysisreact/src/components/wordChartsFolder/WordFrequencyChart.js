import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, LabelList
} from 'recharts';
import { fetchWordFrequencyPerUser } from './data/WordFrequencyChartData';
import { chartTitleStyle } from '../chartStyles';

function WordFrequencyChart({ folder, word }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!folder || !word) return;

    setLoading(true);
    setError(null);

    fetchWordFrequencyPerUser(folder, word)
      .then((result) => setData(result))
      .catch((e) => {
        setError(e.message);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [folder, word]);

  const chartHeight = data.length * 20 + 100;

  return (
    <div style={{ flex: 1, minWidth: 320, maxWidth: 400 }}>
      <h3 style={chartTitleStyle}>Використання слова “{word}”</h3>

      {loading && <p>Завантаження даних...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[0, 'auto']}
              label={{ value: 'Кількість', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              type="category"
              dataKey="label"
              label={{ value: 'Користувач', angle: -90, position: 'insideLeft' }}
              interval={0}
              hide
            />
            <Tooltip formatter={(value, name) => [`${value}`, 'Кількість']} />
            <Bar dataKey="value" fill="#ff9800">
              <LabelList dataKey="label" position="insideLeft" style={{ fill: '#000', fontSize: 12 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        !loading && <p>Немає даних.</p>
      )}
    </div>
  );
}

export default WordFrequencyChart;
