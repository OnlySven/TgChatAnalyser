import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import MessageCharts from './MessageCharts';

function AnalysisMenu() {
  const location = useLocation();
  const folder = location.state?.folder || '';

  const [selected, setSelected] = useState('Аналіз повідомлень');
  const [chartType, setChartType] = useState('hour');
  const [chartData, setChartData] = useState([]);
  const [folderResult, setFolderResult] = useState('');

  const fetchChartData = async (type) => {
    const endpoint =
      type === 'hour' ? 'activity-per-hour' : 'activity-per-day';

    try {
      const response = await fetch(
        `http://localhost:5222/api/messageanalysis/${endpoint}?folder=${encodeURIComponent(folder)}`
      );
      if (!response.ok) throw new Error('Помилка при отриманні даних');
      const data = await response.json();

      const formatted = Object.entries(data)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => {
          if (type === 'hour') return parseInt(a.label) - parseInt(b.label);

          const days = ['понеділок', 'вівторок', 'середа', 'четвер', 'пʼятниця', 'субота', 'неділя'];
          return days.indexOf(a.label.toLowerCase()) - days.indexOf(b.label.toLowerCase());
        });

      setChartData(formatted);
      setFolderResult(type === 'hour' ? 'Графік активності за годинами' : 'Графік активності за днями тижня');
    } catch (err) {
      setFolderResult('Помилка отримання даних');
      setChartData([]);
    }
  };

  useEffect(() => {
    if (selected === 'Аналіз повідомлень') {
      fetchChartData(chartType);
    }
  }, [selected, chartType]);

  const getButtonStyle = (name) => ({
    padding: '12px 28px',
    fontSize: 16,
    borderRadius: 40,
    border: selected === name ? '1px solid #1976d2' : '1px solid #bbb',
    background: selected === name ? '#e3f0fc' : '#f7f7f7',
    color: selected === name ? '#1976d2' : '#222',
    boxShadow: selected === name ? '0 2px 8px #1976d222' : 'none',
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap'
  });

  const getChartTypeButtonStyle = (type) => ({
    padding: '8px 18px',
    fontSize: 14,
    borderRadius: 24,
    border: chartType === type ? '1px solid #555' : '1px solid #ccc',
    background: chartType === type ? '#dceefc' : '#f0f0f0',
    color: chartType === type ? '#1976d2' : '#444',
    cursor: 'pointer'
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px'
      }}
    >
      <h2 style={{ marginBottom: 32 }}>Меню аналізу</h2>

      <div
        style={{
          display: 'flex',
          gap: 16,
          marginBottom: 32,
          flexWrap: 'wrap'
        }}
      >
        <button
          style={getButtonStyle('Аналіз повідомлень')}
          onClick={() => setSelected('Аналіз повідомлень')}
        >
          👁️‍🗨️ ПОВІДОМЛЕННЯ
        </button>
        <button
          style={getButtonStyle('Аналіз слів')}
          onClick={() => setSelected('Аналіз слів')}
        >
          🔤 СЛОВА
        </button>
        <button
          style={getButtonStyle('Аналіз реакцій')}
          onClick={() => setSelected('Аналіз реакцій')}
        >
          😊 РЕАКЦІЇ
        </button>
      </div>

      {selected === 'Аналіз повідомлень' && (
        <>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <button onClick={() => setChartType('hour')} style={getChartTypeButtonStyle('hour')}>
              📊 За годинами
            </button>
            <button onClick={() => setChartType('day')} style={getChartTypeButtonStyle('day')}>
              📅 За днями тижня
            </button>
          </div>

          <div style={{ fontSize: 20, color: '#1976d2', marginBottom: 20 }}>
            {folderResult}
          </div>

          {chartData.length > 0 && (
            <div style={{ width: '100%', maxWidth: 500 }}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" label={{ value: chartType === 'hour' ? 'Година' : 'День', position: 'insideBottom', offset: -5 }} />
                  <YAxis allowDecimals={false} label={{ value: 'Кількість', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <MessageCharts folder={folder} />
        </>
      )}

      {selected !== 'Аналіз повідомлень' && (
        <p style={{ fontSize: 18, marginTop: 20, color: '#888' }}>
          Ця вкладка ще в розробці 🛠
        </p>
      )}
    </div>
  );
}

export default AnalysisMenu;
