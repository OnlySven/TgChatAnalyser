import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function CumulativeMessagesChart({ data }) {
  const cumulativeData = useMemo(() => {
    let sum = 0;
    return data.map(item => {
      sum += item.count;
      return { ...item, cumulativeCount: sum };
    });
  }, [data]);

  if (!cumulativeData.length) {
    return <p>Дані відсутні для кумулятивного графіка.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={cumulativeData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis allowDecimals={false} label={{ value: 'Кумулятивна кількість', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Line type="monotone" dataKey="cumulativeCount" stroke="#1976d2" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default CumulativeMessagesChart;