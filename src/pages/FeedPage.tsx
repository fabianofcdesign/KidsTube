import React, { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';
import type { YouTubeVideo } from '../services/youtube';

interface FeedPageProps {
  title: string;
  icon?: string;
  fetchFunction: () => Promise<YouTubeVideo[]>;
  isUnlocked: boolean;
  unlockedVideoIds: string[];
  onUnlockRequest: (videoId: string) => void;
  onPlayVideo: (video: YouTubeVideo) => void;
  forceLock?: boolean; // Used to mark all videos as restricted if needed
}

const FeedPage: React.FC<FeedPageProps> = ({ 
  title, 
  icon, 
  fetchFunction, 
  isUnlocked, 
  unlockedVideoIds, 
  onUnlockRequest, 
  onPlayVideo,
  forceLock = false
}) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    fetchFunction().then(data => {
      if (isMounted) {
        setVideos(data);
        setLoading(false);
      }
    }).catch(err => {
      console.error(`Failed to load feed ${title}:`, err);
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [fetchFunction, title]);

  const displayedVideos = videos.filter(v => {
    if (!isUnlocked && (forceLock || v.isRestricted)) {
      return false;
    }
    return true;
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.headerTitle}>
        {icon && <span style={styles.headerIcon}>{icon}</span>}
        {title}
      </h2>

      {loading && (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Carregando vídeos...</p>
        </div>
      )}

      {!loading && displayedVideos.length > 0 && (
        <div style={styles.grid}>
          {displayedVideos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              isUnlocked={isUnlocked || unlockedVideoIds.includes(video.id)}
              onUnlockRequest={onUnlockRequest}
              onPlayVideo={onPlayVideo}
            />
          ))}
        </div>
      )}

      {!loading && displayedVideos.length === 0 && (
        <div style={styles.emptyState}>
          <p style={styles.emptyIcon}>📺</p>
          <p style={styles.emptyText}>Nenhum vídeo encontrado</p>
          <p style={styles.emptySubtext}>Verifique sua conexão ou tente novamente mais tarde.</p>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '24px',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    marginBottom: '24px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '16px',
  },
  headerIcon: {
    fontSize: '28px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid var(--hover-bg)',
    borderTopColor: 'var(--accent-color)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
    gap: '8px',
  },
  emptyIcon: {
    fontSize: '48px',
    margin: '0 0 8px 0',
  },
  emptyText: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    margin: 0,
  },
  emptySubtext: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: 0,
  },
};

export default FeedPage;
