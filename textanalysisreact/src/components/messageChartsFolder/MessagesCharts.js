import ActivityChart from './ActivityChart';
import MessagesChart from './MessagesChart';
import AverageLengthChart from './AverageLengthChart';
import PieMessageChart from './PieMessageChart';

function MessageCharts({ folder, style }) {
  return (
    <div style={{ display: 'flex', gap: 80, flexWrap: 'wrap', ...style }}>
      {/* Ліва колонка */}
      <div style={{ flex: 1, minWidth: 300, maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 50 }}>
        <MessagesChart folder={folder} />
        <AverageLengthChart folder={folder} />
      </div>

      {/* Права колонка */}
      <div style={{ flex: 1, minWidth: 300, maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 50 }}>
        <ActivityChart folder={folder} />
        <PieMessageChart folder={folder} />
      </div>
    </div>
  );
}

export default MessageCharts;