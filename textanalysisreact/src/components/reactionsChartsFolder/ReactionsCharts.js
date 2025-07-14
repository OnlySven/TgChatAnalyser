import React from 'react';
import TopUniqueReactionsChart from './TopUniqueReactionsChart';
import TopReceivedReactionsChart from './TopReceivedReactionsChart';
import TopGivenReactionsChart from './TopGivenReactionsChart';

function ReactionsCharts({ folder, style }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 24,
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        ...style,
      }}
    >
      {/* Колонка 1 */}
      <div style={{ flex: '1 1 30%', minWidth: 320 }}>
        <TopUniqueReactionsChart folder={folder} />
      </div>

      {/* Колонка 2 */}
      <div style={{ flex: '1 1 30%', minWidth: 320 }}>
        <TopGivenReactionsChart folder={folder} />
      </div>

      {/* Колонка 3 */}
      <div style={{ flex: '1 1 30%', minWidth: 320 }}>
        <TopReceivedReactionsChart folder={folder} />
      </div>
    </div>
  );
}

export default ReactionsCharts;
