import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { fetchActivityChartData } from './ActivityChartData';
import { chartTitleStyle, getToggleButtonStyle } from '../chartStyles';

function ActivityChart({ folder }) {
  const [chartType, setChartType] = useState('hour'); // 'hour' або 'day'
  const [dataMap, setDataMap] = useState({ hour: [], day: [] });
  const [loadingMap, setLoadingMap] = useState({ hour: false, day: false });
  const [errorMap, setErrorMap] = useState({ hour: null, day: null });

  useEffect(() => {
    if (!folder) return;

    // Функція для завантаження даних певного типу і оновлення стану
    const loadData = async (type) => {
      setLoadingMap(prev => ({ ...prev, [type]: true }));
      setErrorMap(prev => ({ ...prev, [type]: null }));

      try {
        const data = await fetchActivityChartData(type, folder);
        setDataMap(prev => ({ ...prev, [type]: data }));
      } catch (e) {
        setErrorMap(prev => ({ ...prev, [type]: e.message || 'Помилка завантаження' }));
        setDataMap(prev => ({ ...prev, [type]: [] }));
      } finally {
        setLoadingMap(prev => ({ ...prev, [type]: false }));
      }
    };

    // Одночасно завантажуємо дані для обох типів
    loadData('hour');
    loadData('day');
  }, [folder]);

  const loading = loadingMap[chartType];
  const error = errorMap[chartType];
  const data = dataMap[chartType];

  return (
    <div style={{ width: 500, height: 350 }}>
      <h2 style={chartTitleStyle}>
        {chartType === 'hour' ? '📊 Активність за годинами' : '📅 Активність за днями тижня'}
      </h2>

      <div style={{ marginBottom: 12, gap: 8, display: 'flex', flexWrap: 'wrap' }}>
        <button
          onClick={() => setChartType('hour')}
          style={getToggleButtonStyle(chartType === 'hour')}
          disabled={loadingMap['hour']}
        >
          📊 За годинами
        </button>
        <button
          onClick={() => setChartType('day')}
          style={getToggleButtonStyle(chartType === 'day')}
          disabled={loadingMap['day']}
        >
          📅 За днями тижня
        </button>
      </div>

      {loading && <p>Завантаження...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && data.length > 0 && (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis
              allowDecimals={false}
              label={{ value: 'Кількість', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Bar dataKey="count" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      )}

      {!loading && !error && data.length === 0 && <p>Немає даних для відображення.</p>}
    </div>
  );
}

export default ActivityChart;