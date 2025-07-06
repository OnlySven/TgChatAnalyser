import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MessageCharts from './MessageCharts';

function AnalysisMenu() {
  const location = useLocation();
  const folder = location.state?.folder || '';

  const [selected, setSelected] = useState('Аналіз повідомлень');

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

      {selected === 'Аналіз повідомлень' && <MessageCharts folder={folder} />}

      {selected !== 'Аналіз повідомлень' && (
        <p style={{ fontSize: 18, marginTop: 20, color: '#888' }}>
          Ця вкладка ще в розробці 🛠
        </p>
      )}
    </div>
  );
}

export default AnalysisMenu;
