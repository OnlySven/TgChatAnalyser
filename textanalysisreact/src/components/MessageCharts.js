import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LabelList
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#33AA77', '#7777FF', '#FF44AA'];

function MessageCharts({ folder }) {
  const [chartType, setChartType] = useState('hour');
  const [chartData, setChartData] = useState([]);
  const [messageChartType, setMessageChartType] = useState('day');
  const [messageChartData, setMessageChartData] = useState([]);
  const [folderResult, setFolderResult] = useState('');
  const [averageLengthData, setAverageLengthData] = useState([]);
  const [messageChartTitle, setMessageChartTitle] = useState('');
  const [pieData, setPieData] = useState([]);

  const chartHeight = averageLengthData.length * 20 + 100;
  const isLogScale = averageLengthData.length > 2;

  // Завантаження даних для активності (BarChart)
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

  // Завантаження даних для графіка повідомлень (BarChart)
  const fetchMessageChartData = async (type) => {
    const endpoint =
      type === 'day'
        ? 'messages-per-day'
        : type === 'month'
        ? 'messages-per-month'
        : 'messages-per-week';

    try {
      const response = await fetch(
        `http://localhost:5222/api/messageanalysis/${endpoint}?folder=${encodeURIComponent(folder)}`
      );
      if (!response.ok) throw new Error('Помилка при отриманні даних');
      const data = await response.json();

      const formatted = Object.entries(data).map(([label, count]) => ({ label, count }));

      setMessageChartData(formatted);

      // Оновлюємо заголовок графіка повідомлень
      const titles = {
        day: 'Графік повідомлень за днями',
        week: 'Графік повідомлень за тижнями',
        month: 'Графік повідомлень за місяцями'
      };
      setMessageChartTitle(titles[type] || '');
    } catch (err) {
      setMessageChartData([]);
      setMessageChartTitle('Помилка отримання даних');
    }
  };

  // Завантаження середньої довжини повідомлень (BarChart)
  const fetchAverageLength = async () => {
    try {
      const response = await fetch(
        `http://localhost:5222/api/messageanalysis/messages-average-length?folder=${encodeURIComponent(folder)}`
      );
      if (!response.ok) throw new Error('Помилка при отриманні середньої довжини');
      const data = await response.json();

      // Формат: { "User1": 123, "User2": 456 }
      const formatted = Object.entries(data).map(([user, avgLength]) => ({
        label: user,
        value: avgLength
      }));

      setAverageLengthData(formatted);
    } catch (err) {
      setAverageLengthData([]);
    }
  };

  // Завантаження даних для PieChart (messages-count)
  const fetchMessagesCount = async () => {
    try {
      const response = await fetch(
        `http://localhost:5222/api/messageanalysis/messages-count?folder=${encodeURIComponent(folder)}`
      );
      if (!response.ok) throw new Error('Помилка при отриманні загальної кількості повідомлень');
      const data = await response.json();

      // Очікуємо формат, наприклад: { "User1": 100, "User2": 200 }
      const formatted = Object.entries(data).map(([name, count]) => ({
        name,
        value: count
      }));

      setPieData(formatted);
    } catch (err) {
      setPieData([]);
    }
  };

  // Обробка pieData для групування елементів < 1%
  const processedPieData = useMemo(() => {
    if (!pieData.length) return [];

    const total = pieData.reduce((sum, entry) => sum + entry.value, 0);

    const mainItems = [];
    let othersSum = 0;

    for (const entry of pieData) {
      if ((entry.value / total) < 0.02) {
        othersSum += entry.value;
      } else {
        mainItems.push(entry);
      }
    }

    if (othersSum > 0) {
      mainItems.push({ name: 'Інші', value: othersSum });
    }

    return mainItems;
  }, [pieData]);
  
  // Ефекти завантаження
  useEffect(() => {
    fetchMessageChartData(messageChartType);
  }, [messageChartType, folder]);

  useEffect(() => {
    fetchChartData(chartType);
  }, [chartType, folder]);

  useEffect(() => {
    fetchAverageLength();
    fetchMessagesCount();
  }, [folder]);

  // Стилі кнопок (не змінював)
  const getChartTypeButtonStyle = (type) => ({
    padding: '8px 18px',
    fontSize: 14,
    borderRadius: 24,
    border: chartType === type ? '1px solid #555' : '1px solid #ccc',
    background: chartType === type ? '#dceefc' : '#f0f0f0',
    color: chartType === type ? '#1976d2' : '#444',
    cursor: 'pointer'
  });

  const getMessageChartTypeButtonStyle = (type) => ({
    padding: '8px 18px',
    fontSize: 14,
    borderRadius: 24,
    border: messageChartType === type ? '1px solid #555' : '1px solid #ccc',
    background: messageChartType === type ? '#dceefc' : '#f0f0f0',
    color: messageChartType === type ? '#1976d2' : '#444',
    cursor: 'pointer'
  });

  return (
    <>
      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
        {/* Ліва колонка з двома графіками вертикально */}
        <div style={{ flex: 20, minWidth: 500, maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 40 }}>
          {/* Великий графік повідомлень */}
          <div>
            <h2 style={{ color: '#1976d2', marginBottom: 12 }}>{messageChartTitle}</h2>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <button onClick={() => setMessageChartType('day')} style={getMessageChartTypeButtonStyle('day')}>
                📆 За днями
              </button>
              <button onClick={() => setMessageChartType('week')} style={getMessageChartTypeButtonStyle('week')}>
                🗓️ За тижнями
              </button>
              <button onClick={() => setMessageChartType('month')} style={getMessageChartTypeButtonStyle('month')}>
                🗓️ За місяцями
              </button>
            </div>

            {messageChartData.length > 0 && (
              <div style={{ width: '100%', maxWidth: 700 }}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={messageChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      label={{
                        value:'',
                        position: 'insideBottom',
                        offset: -5
                      }}
                    />
                    <YAxis allowDecimals={false} label={{ value: 'Кількість', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#ff9800" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 320, maxWidth: 400}}>
            <h2 style={{ color: '#1976d2' }}>📏 Середня довжина повідомлень</h2>

            {averageLengthData.length > 0 ? (
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart data={averageLengthData} layout="vertical">
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
                  <Tooltip />
                  <Bar dataKey="value" fill="#4caf50">
                    <LabelList dataKey="label" position="insideLeft" style={{ fill: '#000', fontSize: 12 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>Дані не знайдено або сталася помилка.</p>
            )}
          </div>
        </div>

        {/* Друга колонка: кнопки, PieChart і BarChart активності */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 400 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <button onClick={() => setChartType('hour')} style={getChartTypeButtonStyle('hour')}>
              📊 За годинами
            </button>
            <button onClick={() => setChartType('day')} style={getChartTypeButtonStyle('day')}>
              📅 За днями тижня
            </button>
          </div>

          {/* Графік активності */}
          <div style={{ fontSize: 20, color: '#1976d2', marginBottom: 20 }}>{folderResult}</div>

          {chartData.length > 0 && (
            <div style={{ width: '100%', maxWidth: 400 }}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    label={{
                      value: '',
                      position: 'insideBottom',
                      offset: -5
                    }}
                  />
                  <YAxis allowDecimals={false} label={{ value: 'Кількість', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* PieChart із загальною кількістю повідомлень */}
          {processedPieData.length > 0 && (
            <>
      <h2 style={{ color: '#1976d2', marginBottom: 12 }}>
        📊 Загальна кількість повідомлень: {pieData.reduce((sum, entry) => sum + entry.value, 0)}
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={processedPieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={({ name }) => name}
          >
            {processedPieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </>
          )}
        </div>
      </div>
    </>
  );
}

export default MessageCharts;
