import React, { useState } from 'react';
import { Search, Mic, Video, Bell, Lock, Unlock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

interface HeaderProps {
  isUnlocked: boolean;
  onLockClick: () => void;
}

interface UserProfile {
  name: string;
  picture: string;
}

const Header: React.FC<HeaderProps> = ({ isUnlocked, onLockClick }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded: any = jwtDecode(credentialResponse.credential);
      setUserProfile({
        name: decoded.name,
        picture: decoded.picture
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 16px',
    height: '56px',
    backgroundColor: 'var(--bg-color)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '30px',
    height: '20px',
    backgroundColor: 'var(--accent-color)',
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
    borderLeft: '6px solid white',
  },
  logoText: {
    color: 'var(--text-primary)',
    fontSize: '20px',
    fontWeight: 'bold',
    letterSpacing: '-1px',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    maxWidth: '720px',
    marginLeft: '40px',
  },
  searchContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    border: '1px solid var(--border-color)',
    borderRadius: '40px',
    overflow: 'hidden',
    backgroundColor: 'var(--search-bg)',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-primary)',
    padding: '0 16px',
    fontSize: '16px',
    outline: 'none',
    height: '40px',
  },
  searchButton: {
    backgroundColor: 'var(--hover-bg)',
    border: 'none',
    borderLeft: '1px solid var(--border-color)',
    padding: '0 20px',
    height: '40px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    backgroundColor: 'var(--hover-bg)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  iconButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
  },
  profileButton: {
    backgroundColor: '#0056b3',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  }
};

export default Header;
