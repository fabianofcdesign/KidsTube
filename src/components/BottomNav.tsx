import React from 'react';
import { Home, PlaySquare, Smartphone, User, PlusCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface BottomNavProps {
  isUnlocked: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ isUnlocked }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
        <Home size={24} fill={isActive('/') ? 'var(--text-primary)' : 'none'} strokeWidth={isActive('/') ? 0 : 2} color={isActive('/') ? 'var(--text-primary)' : 'var(--text-primary)'} />
        <span>Início</span>
      </Link>
      
      {isUnlocked && (
        <Link to="/shorts" className={`nav-item ${isActive('/shorts') ? 'active' : ''}`}>
          <Smartphone size={24} color={'var(--text-primary)'} />
          <span>Shorts</span>
        </Link>
      )}

      <button className="nav-item plus-button">
        <PlusCircle size={40} strokeWidth={1} color="var(--text-primary)" />
      </button>

      <Link to="/subscriptions" className={`nav-item ${isActive('/subscriptions') ? 'active' : ''}`}>
        <PlaySquare size={24} fill={isActive('/subscriptions') ? 'var(--text-primary)' : 'none'} strokeWidth={isActive('/subscriptions') ? 0 : 2} color={'var(--text-primary)'} />
        <span>Inscrições</span>
      </Link>

      <Link to="/history" className={`nav-item ${isActive('/history') ? 'active' : ''}`}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', border: isActive('/history') ? '2px solid white' : 'none', overflow: 'hidden' }}>
          <User size={24} fill="var(--text-secondary)" color="var(--bg-color)" style={{backgroundColor: 'var(--text-secondary)'}} />
        </div>
        <span>Você</span>
      </Link>
    </nav>
  );
};

      <Link to="/subscriptions" className={`nav-item ${isActive('/subscriptions') ? 'active' : ''}`}>
        <PlaySquare size={24} color={isActive('/subscriptions') ? 'var(--text-primary)' : 'var(--text-secondary)'} />
        <span>Inscrições</span>
      </Link>

      <Link to="/history" className={`nav-item ${isActive('/history') ? 'active' : ''}`}>
        <User size={24} color={isActive('/history') ? 'var(--text-primary)' : 'var(--text-secondary)'} />
        <span>Você</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
