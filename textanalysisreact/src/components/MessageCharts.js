import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

function MessageCharts({ folder }) {
  const [messageChartType, setMessageChartType] = useState('day');
  const [messageChartData, setMessageChartData] = useState([]);

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
    } catch (err) {
      setMessageChartData([]);
    }
  };

  useEffect(() => {
    fetchMessageChartData(messageChartType);
  }, [messageChartType, folder]);

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
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button onClick={() => setMessageChartType('day')} style={getMessageChartTypeButtonStyle('day')}>
          📆 Повідомлення за днями
        </button>
        <button onClick={() => setMessageChartType('week')} style={getMessageChartTypeButtonStyle('week')}>
          🗓️ Повідомлення за тижнями
        </button>
        <button onClick={() => setMessageChartType('month')} style={getMessageChartTypeButtonStyle('month')}>
          🗓️ Повідомлення за місяцями
        </button>
      </div>

      {messageChartData.length > 0 && (
        <div style={{ width: '100%', maxWidth: 700, marginBottom: 40 }}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={messageChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                label={{ 
                  value:
                    messageChartType === 'day'
                      ? 'Дата'
                      : messageChartType === 'week'
                      ? 'Тиждень'
                      : 'Місяць',
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
  );
}

export default MessageCharts;
