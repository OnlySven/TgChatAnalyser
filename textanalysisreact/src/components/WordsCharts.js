import React from 'react';
import { chartTitleStyle } from './chartStyles';
import TopUniqueWordsChart from './wordChartsFolder/TopUniqueWordsChart';

function WordsCharts({ folder }) {
  return (
    <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
      {/* Ліва колонка */}
      <div style={{ flex: 20, minWidth: 500, maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div>
          <h2 style={chartTitleStyle}>Топ слів</h2>
          <TopUniqueWordsChart folder={folder} />
        </div>

        <div>
          <h2 style={chartTitleStyle}>Частота слова</h2>
          <div>Тут буде графік частоти слова для папки: <strong>{folder}</strong></div>
        </div>

        <div>
          <h2 style={chartTitleStyle}>📏 Середня довжина слова</h2>
          <div>Тут буде графік середньої довжини слова для папки: <strong>{folder}</strong></div>
        </div>
      </div>

      {/* Права колонка */}
      <div style={{ flex: 1, minWidth: 320, maxWidth: 400 }}>
        <h2 style={chartTitleStyle}>Інформація</h2>
        <div>Тут буде кругова діаграма по словах для папки: <strong>{folder}</strong></div>
      </div>
    </div>
  );
}

export default WordsCharts;