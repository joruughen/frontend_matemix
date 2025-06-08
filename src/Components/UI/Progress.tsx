// Progress.tsx
import React from 'react';

interface ProgressProps {
  value: number;
  style?: React.CSSProperties;  // Permite pasar un estilo personalizado (como el color)
}

const Progress: React.FC<ProgressProps> = ({ value, style }) => {
  const progressBarStyle = {
    width: `${value}%`,
    height: '10px',
    borderRadius: '5px',
    backgroundColor: '#E5E7EB',  // Gris de fondo
    ...style,  // Aplica el estilo pasado (como el color)
  };

  return (
      <div style={{ width: '100%', backgroundColor: '#F3F4F6', borderRadius: '5px' }}>
        <div style={progressBarStyle}></div>
      </div>
  );
};

export { Progress };
