import React from 'react';
import { Search, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <Link to="/" style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <div style={styles.playTriangle}></div>
          </div>
          <span style={styles.logoText}>KidsTube</span>
        </Link>
      </div>

      <div style={styles.right}>
        <button style={styles.iconButton}>
          <div style={styles.bellContainer}>
            <Bell size={24} color="var(--text-primary)" />
            <span style={styles.badge}>1</span>
          </div>
        </button>
        <button style={styles.iconButton} onClick={() => navigate('/search')}>
          <Search size={24} color="var(--text-primary)" />
        </button>
      </div>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 12px',
    height: '48px',
    backgroundColor: 'var(--bg-color)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '28px',
    height: '20px',
    backgroundColor: '#FF0000',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderTop: '4px solid transparent',
    borderBottom: '4px solid transparent',
    borderLeft: '8px solid white',
    marginLeft: '2px',
  },
  logoText: {
    color: 'var(--text-primary)',
    fontSize: '20px',
    fontWeight: 'bold',
    letterSpacing: '-1px',
    fontFamily: '"Oswald", sans-serif',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
  },
  bellContainer: {
    position: 'relative',
    display: 'flex',
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: '#FF0000',
    color: 'white',
    fontSize: '10px',
    fontWeight: 'bold',
    borderRadius: '10px',
    padding: '1px 4px',
    border: '2px solid var(--bg-color)',
  }
};

export default Header;
