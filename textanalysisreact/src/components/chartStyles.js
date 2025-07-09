export const chartTitleStyle = {
  color: '#1976d2',
  marginBottom: 12,
};

export const buttonStyle = {
  padding: '8px 18px',
  fontSize: 14,
  borderRadius: 24,
  cursor: 'pointer',
};

export const getToggleButtonStyle = (isActive) => ({
  ...buttonStyle,
  border: isActive ? '1px solid #555' : '1px solid #ccc',
  background: isActive ? '#dceefc' : '#f0f0f0',
  color: isActive ? '#1976d2' : '#444',
});

export const getMenuButtonStyle = (selected, name) => ({
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

export const searchInputStyle = {
  marginBottom: 16,
  padding: '8px 12px',
  fontSize: 16,
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: 4,
  border: '1px solid #ccc',
};
