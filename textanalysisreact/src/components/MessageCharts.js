import React, { useState, useEffect, useMemo } from 'react';
import AverageLengthChart from './messageChartsFolder/AverageLengthChart';
import ActivityChart from './messageChartsFolder/ActivityChart';
import MessagesChart from './messageChartsFolder/MessagesChart';
import PieMessageChart from './messageChartsFolder/PieMessageChart';
import CumulativeMessagesChart from './messageChartsFolder/CumulativeMessagesChart';
import { fetchAverageLength } from './messageChartsFolder/AverageLengthChartData';
import { fetchActivityChartData } from './messageChartsFolder/ActivityChartData';
import { fetchMessagesChartData } from './messageChartsFolder/MessagesChartData';
import { fetchPieChartData } from './messageChartsFolder/PieMessageChartData';
import {
  chartTitleStyle,
  getToggleButtonStyle,
} from './chartStyles';


function MessageCharts({ folder }) {
  const [chartType, setChartType] = useState('hour');
  const [chartData, setChartData] = useState([]);
  const [messageChartType, setMessageChartType] = useState('day');
  const [allMessageChartData, setAllMessageChartData] = useState({
    day: [],
    week: [],
    month: [],
  });
  const [loadingStatus, setLoadingStatus] = useState({
    day: false,
    week: false,
    month: false,
  });
  const [errorStatus, setErrorStatus] = useState({
    day: null,
    week: null,
    month: null,
  });

  const [folderResult, setFolderResult] = useState('');
  const [averageLengthData, setAverageLengthData] = useState([]);
  const [messageChartTitle, setMessageChartTitle] = useState('');
  const [pieData, setPieData] = useState([]);
  const [showCumulative, setShowCumulative] = useState(false);

  // Завантаження активності (години / дні тижня)
  const fetchChartData = async (type) => {
    try {
      const formatted = await fetchActivityChartData(type, folder);
      setChartData(formatted);
      setFolderResult(type === 'hour' ? 'Графік активності за годинами' : 'Графік активності за днями тижня');
    } catch {
      setFolderResult('Помилка отримання даних');
      setChartData([]);
    }
  };

  // Попереднє завантаження графіків повідомлень
  useEffect(() => {
    if (!folder) return;

    const types = ['day', 'week', 'month'];
    types.forEach((type) => {
      setLoadingStatus((prev) => ({ ...prev, [type]: true }));
      fetchMessagesChartData(type, folder)
        .then((formatted) => {
          setAllMessageChartData((prev) => ({ ...prev, [type]: formatted }));
          setLoadingStatus((prev) => ({ ...prev, [type]: false }));
          setErrorStatus((prev) => ({ ...prev, [type]: null }));
        })
        .catch(() => {
          setAllMessageChartData((prev) => ({ ...prev, [type]: [] }));
          setLoadingStatus((prev) => ({ ...prev, [type]: false }));
          setErrorStatus((prev) => ({ ...prev, [type]: 'Помилка отримання даних' }));
        });
    });
  }, [folder]);

  // Оновлення заголовка графіка повідомлень
  useEffect(() => {
    const titles = {
      day: 'Графік повідомлень за днями',
      week: 'Графік повідомлень за тижнями',
      month: 'Графік повідомлень за місяцями',
    };
    setMessageChartTitle(titles[messageChartType] || '');
  }, [messageChartType]);

  // Завантаження середньої довжини повідомлень
  useEffect(() => {
    if (!folder) return;

    fetchAverageLength(folder)
      .then((formatted) => setAverageLengthData(formatted))
      .catch(() => setAverageLengthData([]));
  }, [folder]);

  // Завантаження даних для кругової діаграми
  useEffect(() => {
    if (!folder) return;

    fetchPieChartData(folder)
      .then((formatted) => setPieData(formatted))
      .catch(() => setPieData([]));
  }, [folder]);

  // Обробка pieData: групування маленьких часток у "Інші"
  const processedPieData = useMemo(() => {
    if (!pieData.length) return [];

    const total = pieData.reduce((sum, entry) => sum + entry.value, 0);
    const mainItems = [];
    let othersSum = 0;

    for (const entry of pieData) {
      if (entry.value / total < 0.02) othersSum += entry.value;
      else mainItems.push(entry);
    }
    if (othersSum > 0) mainItems.push({ name: 'Інші', value: othersSum });

    return mainItems;
  }, [pieData]);

  // Поточні дані для графіка повідомлень
  const currentMessageChartData = allMessageChartData[messageChartType] || [];
  const isLoading = loadingStatus[messageChartType];
  const errorMessage = errorStatus[messageChartType];

  // Завантаження при зміні типу активності
  useEffect(() => {
    fetchChartData(chartType);
  }, [chartType, folder]);

  // Стилі кнопок
  const getChartTypeButtonStyle = (type) => getToggleButtonStyle(chartType === type);
  const getMessageChartTypeButtonStyle = (type) => getToggleButtonStyle(messageChartType === type);
  
  return (
    <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
      {/* Ліва колонка */}
      <div style={{ flex: 20, minWidth: 500, maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 40 }}>
        {/* Графік повідомлень */}
        <div>
          <h2 style={chartTitleStyle}>{messageChartTitle}</h2>
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
            <button
              onClick={() => setShowCumulative((prev) => !prev)}
              style={getToggleButtonStyle(showCumulative)}
            >
              📈 Кумулятивний
            </button>
          </div>

          {isLoading && <p>Завантаження даних...</p>}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

          {!isLoading && !errorMessage && (showCumulative ? (
            <CumulativeMessagesChart data={currentMessageChartData} />
          ) : (
            <MessagesChart data={currentMessageChartData} />
          ))}
        </div>

        {/* Середня довжина повідомлень */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 700 }}>
          <h2 style={chartTitleStyle}>📏 Середня довжина повідомлень</h2>
          <AverageLengthChart data={averageLengthData} />
        </div>
      </div>

      {/* Права колонка */}
      <div style={{ flex: 1, minWidth: 320, maxWidth: 700 }}>
        <h2 style={chartTitleStyle}>{folderResult}</h2>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <button onClick={() => setChartType('hour')} style={getChartTypeButtonStyle('hour')}>
            📊 За годинами
          </button>
          <button onClick={() => setChartType('day')} style={getChartTypeButtonStyle('day')}>
            📅 За днями тижня
          </button>
        </div>
        <ActivityChart data={chartData} />
        <h2 style={chartTitleStyle}>
                📊 Загальна кількість повідомлень: {pieData.reduce((sum, entry) => sum + entry.value, 0)}
              </h2>
        <PieMessageChart data={processedPieData} />
      </div>
    </div>
  );
}

export default MessageCharts;
