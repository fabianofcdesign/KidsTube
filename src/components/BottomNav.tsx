import React from 'react';
import { Home, PlaySquare, Smartphone, User } from 'lucide-react';
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
        <Home size={24} color={isActive('/') ? 'var(--text-primary)' : 'var(--text-secondary)'} />
        <span>Início</span>
      </Link>
      
      {isUnlocked && (
        <Link to="/shorts" className={`nav-item ${isActive('/shorts') ? 'active' : ''}`}>
          <Smartphone size={24} color={isActive('/shorts') ? 'var(--text-primary)' : 'var(--text-secondary)'} />
          <span>Shorts</span>
        </Link>
      )}

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
