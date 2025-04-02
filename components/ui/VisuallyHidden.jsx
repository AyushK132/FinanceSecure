// components/ui/VisuallyHidden.jsx
import React from 'react';

export function VisuallyHidden({ children }) {
  return (
    <span
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        margin: '-1px',
        padding: '0',
        border: '0',
        clip: 'rect(0, 0, 0, 0)',
        clipPath: 'inset(50%)',
        overflow: 'hidden',
      }}
    >
      {children}
    </span>
  );
}
