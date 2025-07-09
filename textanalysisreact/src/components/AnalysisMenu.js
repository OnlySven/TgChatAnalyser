import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import MessagesCharts from './MessagesCharts';
import WordsCharts from './WordsCharts';

import {
  chartTitleStyle,
  getMenuButtonStyle
} from './chartStyles';

function AnalysisMenu() {
  const location = useLocation();
  const folder = location.state?.folder || '';

  const [selected, setSelected] = useState('Аналіз повідомлень');

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
          style={getMenuButtonStyle(selected, 'Аналіз повідомлень')}
          onClick={() => setSelected('Аналіз повідомлень')}
        >
          👁️‍🗨️ ПОВІДОМЛЕННЯ
        </button>
        <button
          style={getMenuButtonStyle(selected, 'Аналіз слів')}
          onClick={() => setSelected('Аналіз слів')}
        >
          🔤 СЛОВА
        </button>
        <button
          style={getMenuButtonStyle(selected, 'Аналіз реакцій')}
          onClick={() => setSelected('Аналіз реакцій')}
        >
          😊 РЕАКЦІЇ
        </button>
      </div>

      <MessagesCharts
        folder={folder}
        style={{ display: selected === 'Аналіз повідомлень' ? 'flex' : 'none' }}
      />
      <WordsCharts
        folder={folder}
        style={{ display: selected === 'Аналіз слів' ? 'flex' : 'none' }}
      />

      {selected === 'Аналіз реакцій' && (
        <p style={{ fontSize: 18, marginTop: 20, color: '#888' }}>
          Ця вкладка ще в розробці 🛠
        </p>
      )}
    </div>
  );
}

export default AnalysisMenu;