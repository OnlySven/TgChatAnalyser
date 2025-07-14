import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import CumulativeMessagesChart from './CumulativeMessagesChart';
import { fetchMessagesChartData } from './data/MessagesChartData';
import { chartTitleStyle, getToggleButtonStyle } from '../chartStyles';

function MessagesChart({ folder }) {
  const [chartType, setChartType] = useState('day'); // 'day' | 'week' | 'month'
  const [dataMap, setDataMap] = useState({ day: [], week: [], month: [] });
  const [loadingMap, setLoadingMap] = useState({ day: false, week: false, month: false });
  const [errorMap, setErrorMap] = useState({ day: null, week: null, month: null });
  const [showCumulative, setShowCumulative] = useState(false);

  useEffect(() => {
    if (!folder) return;

    const types = ['day', 'week', 'month'];

    types.forEach(async (type) => {
      setLoadingMap((prev) => ({ ...prev, [type]: true }));
      setErrorMap((prev) => ({ ...prev, [type]: null }));

      try {
        const data = await fetchMessagesChartData(type, folder);
        setDataMap((prev) => ({ ...prev, [type]: data }));
      } catch (e) {
        setErrorMap((prev) => ({ ...prev, [type]: e.message || 'Помилка завантаження' }));
        setDataMap((prev) => ({ ...prev, [type]: [] }));
      } finally {
        setLoadingMap((prev) => ({ ...prev, [type]: false }));
      }
    });
  }, [folder]);

  const loading = loadingMap[chartType];
  const error = errorMap[chartType];
  const data = dataMap[chartType];

  const titles = {
    day: '📊 Графік повідомлень за днями',
    week: '📊 Графік повідомлень за тижнями',
    month: '📊 Графік повідомлень за місяцями',
  };

  return (
    <div style={{ width: 600, height: 350 }}>
      <h2 style={chartTitleStyle}>{titles[chartType]}</h2>

      <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'nowrap', alignItems: 'center' }}>
        <button
          onClick={() => setChartType('day')}
          style={getToggleButtonStyle(chartType === 'day')}
          disabled={loadingMap['day']}
        >
          📆 За днями
        </button>
        <button
          onClick={() => setChartType('week')}
          style={getToggleButtonStyle(chartType === 'week')}
          disabled={loadingMap['week']}
        >
          🗓️ За тижнями
        </button>
        <button
          onClick={() => setChartType('month')}
          style={getToggleButtonStyle(chartType === 'month')}
          disabled={loadingMap['month']}
        >
          🗓️ За місяцями
        </button>
        <button
          onClick={() => setShowCumulative(prev => !prev)}
          style={getToggleButtonStyle(showCumulative)}
        >
          📈 Кумулятивний
        </button>
      </div>

      {loading && <p>Завантаження...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && data.length > 0 && (
        showCumulative ? (
          <CumulativeMessagesChart data={data} />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis
                allowDecimals={false}
                label={{ value: 'Кількість', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip formatter={(value, name) => [`${value}`, 'Кількість']} />
              <Bar dataKey="count" fill="#ff9800" />
            </BarChart>
          </ResponsiveContainer>
        )
      )}

      {!loading && !error && data.length === 0 && <p>Немає даних для відображення.</p>}
    </div>
  );
}

export default MessagesChart;