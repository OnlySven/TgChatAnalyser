import React, { useState } from 'react';
import { chartTitleStyle } from './chartStyles';
import TopUniqueWordsChart from './wordChartsFolder/TopUniqueWordsChart';
import WordFrequencyChart from './wordChartsFolder/WordFrequencyChart';
import PieChartWords from './wordChartsFolder/PieChartWords';

function WordsCharts({ folder, style }) {
  const [selectedWord, setSelectedWord] = useState('');

  return (
    <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', ...style }}>
      {/* Ліва колонка */}
      <div style={{ flex: 20, minWidth: 500, maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div>
          <h2 style={chartTitleStyle}>Топ слів</h2>
          <TopUniqueWordsChart folder={folder} onWordSelect={setSelectedWord} />
        </div>

        <div style={{ flex: 1, minWidth: 320, maxWidth: 600 }}>
          <PieChartWords folder={folder} />
        </div>
      </div>

      {/* Права колонка */}
      
      <div style={{ flex: 1, minWidth: 320, maxWidth: 700 }}>
        <div>
          <h2 style={chartTitleStyle}>Частота слова</h2>
          {selectedWord ? (
            <WordFrequencyChart folder={folder} word={selectedWord} />
          ) : (
            <p style={{ color: '#888' }}>Оберіть слово зі списку або введіть у пошуку.</p>
          )}
        </div>
        <h2 style={chartTitleStyle}>Інформація</h2>
                <div>Тут буде фото мами Влада: </div>
        <img
          src="/mama_vlada.png"
          alt="Мама Влада"
          style={{ width: '400px', height: 'auto' }}
        />
      </div>
    </div>
  );
}

export default WordsCharts;
