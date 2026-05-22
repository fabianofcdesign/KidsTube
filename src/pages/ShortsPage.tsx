import React, { useEffect, useState } from 'react';
import { fetchShorts, type YouTubeVideo } from '../services/youtube';
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

interface ShortsPageProps {
  isUnlocked: boolean;
}

const ShortsPage: React.FC<ShortsPageProps> = ({ isUnlocked }) => {
  const [shorts, setShorts] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchShorts(10).then(data => {
      if (isMounted) {
        setShorts(data);
        setLoading(false);
      }
    }).catch(err => {
      console.error('Error fetching shorts:', err);
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  if (!isUnlocked) {
    return (
      <div style={styles.lockedContainer}>
        <div style={styles.lockedIcon}>🔒</div>
        <h2>Shorts Bloqueados</h2>
        <p>Você precisa inserir o PIN (cadeado no topo) para acessar esta seção.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {shorts.map((short, index) => (
        <div key={short.id} style={styles.shortWrapper}>
          <div style={styles.playerContainer}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${short.id}?autoplay=${index === 0 ? 1 : 0}&loop=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3`}
              title={short.title}
              style={styles.iframe}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div style={styles.infoOverlay}>
              <h3 style={styles.title}>{short.title}</h3>
              <div style={styles.channelInfo}>
                <img src={short.channelAvatar} alt={short.channelName} style={styles.avatar} />
                <span style={styles.channelName}>@{short.channelName.replace(/\s+/g, '')}</span>
                <button style={styles.subscribeBtn}>Inscrever-se</button>
              </div>
            </div>
          </div>
          <div style={styles.actionButtons}>
            <button style={styles.actionBtn}>
              <div style={styles.iconCircle}><ThumbsUp size={24} color="var(--text-primary)" /></div>
              <span style={styles.actionText}>Gostei</span>
            </button>
            <button style={styles.actionBtn}>
              <div style={styles.iconCircle}><ThumbsDown size={24} color="var(--text-primary)" /></div>
              <span style={styles.actionText}>Não gostei</span>
            </button>
            <button style={styles.actionBtn}>
              <div style={styles.iconCircle}><MessageCircle size={24} color="var(--text-primary)" /></div>
              <span style={styles.actionText}>123</span>
            </button>
            <button style={styles.actionBtn}>
              <div style={styles.iconCircle}><Share2 size={24} color="var(--text-primary)" /></div>
              <span style={styles.actionText}>Compart.</span>
            </button>
            <button style={styles.actionBtn}>
              <div style={styles.iconCircle}><MoreHorizontal size={24} color="var(--text-primary)" /></div>
            </button>
            <img src={short.channelAvatar} alt="audio" style={styles.audioDisk} />
          </div>
        </div>
      ))}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory',
    backgroundColor: '#000', // Darker background for shorts
  },
  lockedContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '24px',
    textAlign: 'center',
  },
  lockedIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid var(--hover-bg)',
    borderTopColor: 'var(--accent-color)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  shortWrapper: {
    position: 'relative',
    height: 'calc(100vh - 56px)', // Full height minus header
    minHeight: '600px',
    width: '100%',
    maxWidth: '450px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    scrollSnapAlign: 'start',
    padding: '20px 0',
  },
  playerContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#111',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
    pointerEvents: 'none', // Prevent intercepting swipes/clicks (except double clicks, normally handled by custom player)
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '20px 16px',
    background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
    pointerEvents: 'none',
  },
  title: {
    fontSize: '15px',
    fontWeight: '500',
    color: 'white',
    margin: '0 0 12px 0',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  channelInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    pointerEvents: 'auto',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  channelName: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
  },
  subscribeBtn: {
    backgroundColor: 'white',
    color: 'black',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginLeft: '8px',
    cursor: 'pointer',
  },
  actionButtons: {
    position: 'absolute',
    right: '-60px',
    bottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'center',
  },
  actionBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  iconCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: '12px',
  },
  audioDisk: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    objectFit: 'cover',
    marginTop: '8px',
  }
};

export default ShortsPage;
