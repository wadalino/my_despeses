import React from 'react';
import './Badge.css';
export default function Badge({ value, color = 'red' }) {
  if (value == null) return null;

  return (
    <span className="custom-badge" style={{ backgroundColor: color }}>
      {value}
    </span>
  );
}
