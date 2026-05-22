import React, { useState } from 'react';
import { Compass } from 'lucide-react';

const categories = [
  "Tudo",
  "Novidades para você",
  "Mixes",
  "Música",
  "Jogos",
  "Ao vivo",
  "Animação"
];

const CategoryChips: React.FC = () => {
  const [active, setActive] = useState("Tudo");

  return (
    <div className="chips-container" style={styles.container}>
      <button style={styles.compassBtn}>
        <Compass size={20} color="var(--text-primary)" />
      </button>
      <div style={styles.divider}></div>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActive(cat)}
          style={{
            ...styles.chip,
            backgroundColor: active === cat ? 'var(--text-primary)' : 'rgba(255,255,255,0.1)',
            color: active === cat ? 'var(--bg-color)' : 'var(--text-primary)',
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    overflowX: 'auto' as const,
    whiteSpace: 'nowrap' as const,
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    backgroundColor: 'var(--bg-color)',
    position: 'sticky' as const,
    top: '48px', // just below header
    zIndex: 90,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  compassBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '4px',
    padding: '6px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  divider: {
    width: '1px',
    height: '24px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexShrink: 0,
  },
  chip: {
    border: 'none',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'background-color 0.2s',
  }
};

export default CategoryChips;
