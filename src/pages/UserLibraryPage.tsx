import React from 'react';
import VideoCard from '../components/VideoCard';
import type { YouTubeVideo } from '../services/youtube';

interface UserLibraryPageProps {
  title: string;
  icon: string;
  videos: YouTubeVideo[];
  isUnlocked: boolean;
  unlockedVideoIds: string[];
  onUnlockRequest: (videoId: string) => void;
  onPlayVideo: (video: YouTubeVideo) => void;
  headerAction?: React.ReactNode;
}

const UserLibraryPage: React.FC<UserLibraryPageProps> = ({
  title,
  icon,
  videos,
  isUnlocked,
  unlockedVideoIds,
  onUnlockRequest,
  onPlayVideo,
  headerAction
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.headerTitle}>
          <span style={styles.headerIcon}>{icon}</span>
          {title}
        </h2>
        {headerAction}
      </div>

      {videos.length > 0 ? (
        <div style={styles.grid}>
          {videos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              isUnlocked={isUnlocked || unlockedVideoIds.includes(video.id)}
              onUnlockRequest={onUnlockRequest}
              onPlayVideo={onPlayVideo}
            />
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <p style={styles.emptyIcon}>👻</p>
          <p style={styles.emptyText}>Nada por aqui ainda</p>
          <p style={styles.emptySubtext}>Os vídeos que você interagir aparecerão nesta lista.</p>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '24px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '16px',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    margin: 0,
  },
  headerIcon: {
    fontSize: '28px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
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

export default UserLibraryPage;
