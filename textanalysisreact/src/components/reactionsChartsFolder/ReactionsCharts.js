import React, { useState } from 'react';
import { chartTitleStyle } from '../chartStyles';

function ReactionsCharts({ folder, style }) {
  return (
    <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', ...style }}>
      {/* Ліва колонка */}
      <div style={{ flex: 20, minWidth: 500, maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div>
          <img
          src="/mama_vlada.png"
          alt="Мама Влада"
          style={{ width: '400px', height: 'auto' }}
        />
        </div>
        <img
          src="/mama_vlada.png"
          alt="Мама Влада"
          style={{ width: '400px', height: 'auto' }}
        />
      </div>

      {/* Права колонка */}
      
      <div style={{ flex: 20, minWidth: 500, maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div>
          <img
          src="/mama_vlada.png"
          alt="Мама Влада"
          style={{ width: '400px', height: 'auto' }}
        />
        </div>
        <img
          src="/mama_vlada.png"
          alt="Мама Влада"
          style={{ width: '400px', height: 'auto' }}
        />
      </div>
    </div>
  );
}

export default ReactionsCharts;
