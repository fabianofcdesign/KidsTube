import React from 'react';
import { Home, Compass, PlaySquare, Clock, History, ThumbsUp, Flame, Gamepad2, Music, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  isUnlocked: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isUnlocked }) => {
  if (!isOpen) {
    return (
      <aside style={styles.sidebarCollapsed}>
        <Link to="/" style={styles.collapsedItem}>
          <Home size={24} color="var(--text-primary)" />
          <span style={styles.collapsedText}>Início</span>
        </Link>
        {isUnlocked && (
          <Link to="/shorts" style={styles.collapsedItem}>
            <Smartphone size={24} color="var(--text-primary)" />
            <span style={styles.collapsedText}>Shorts</span>
          </Link>
        )}
        <Link to="/explore" style={styles.collapsedItem}>
          <Compass size={24} color="var(--text-primary)" />
          <span style={styles.collapsedText}>Explorar</span>
        </Link>
        <Link to="/subscriptions" style={styles.collapsedItem}>
          <PlaySquare size={24} color="var(--text-primary)" />
          <span style={styles.collapsedText}>Inscrições</span>
        </Link>
      </aside>
    );
  }

  return (
    <aside style={styles.sidebar}>
      <div style={styles.section}>
        <Link to="/" style={{...styles.item, backgroundColor: 'var(--hover-bg)'}}>
          <Home size={24} color="var(--text-primary)" />
          <span style={styles.itemText}>Início</span>
        </Link>
        {isUnlocked && (
          <Link to="/shorts" style={styles.item}>
            <Smartphone size={24} color="var(--text-primary)" />
            <span style={styles.itemText}>Shorts</span>
          </Link>
        )}
        <Link to="/explore" style={styles.item}>
          <Compass size={24} color="var(--text-primary)" />
          <span style={styles.itemText}>Explorar</span>
        </Link>
        <Link to="/subscriptions" style={styles.item}>
          <PlaySquare size={24} color="var(--text-primary)" />
          <span style={styles.itemText}>Inscrições</span>
        </Link>
      </div>
      
      <div style={styles.divider}></div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Você</h3>
        <Link to="/history" style={styles.item}>
          <History size={24} color="var(--text-primary)" />
          <span style={styles.itemText}>Histórico</span>
        </Link>
        <Link to="/later" style={styles.item}>
          <Clock size={24} color="var(--text-primary)" />
          <span style={styles.itemText}>Assistir mais tarde</span>
        </Link>
        <Link to="/liked" style={styles.item}>
          <ThumbsUp size={24} color="var(--text-primary)" />
          <span style={styles.itemText}>Vídeos marcados...</span>
        </Link>
      </div>

      <div style={styles.divider}></div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Explorar</h3>
        <Link to="/trending" style={styles.item}>
          <Flame size={24} color="var(--text-primary)" />
          <span style={styles.itemText}>Em alta</span>
        </Link>
        <Link to="/music" style={styles.item}>
          <Music size={24} color="var(--text-primary)" />
          <span style={styles.itemText}>Música</span>
        </Link>
        <Link to="/gaming" style={styles.item}>
          <Gamepad2 size={24} color="var(--text-primary)" />
          <span style={styles.itemText}>Jogos</span>
        </Link>
      </div>
    </aside>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: '240px',
    backgroundColor: 'var(--bg-color)',
    height: '100%',
    overflowY: 'auto',
    padding: '12px 0',
  },
  sidebarCollapsed: {
    width: '72px',
    backgroundColor: 'var(--bg-color)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '12px',
  },
  collapsedItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '16px 0',
    cursor: 'pointer',
    gap: '6px',
  },
  collapsedText: {
    fontSize: '10px',
    color: 'var(--text-primary)',
  },
  section: {
    padding: '0 12px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 12px',
    gap: '24px',
    cursor: 'pointer',
    borderRadius: '10px',
    textDecoration: 'none',
  },
  itemText: {
    fontSize: '14px',
    color: 'var(--text-primary)',
    fontWeight: 400,
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '12px 0',
  },
  sectionTitle: {
    fontSize: '16px',
    color: 'var(--text-primary)',
    fontWeight: 'bold',
    margin: '8px 12px 12px 12px',
  }
};

export default Sidebar;
