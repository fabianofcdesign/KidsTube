import React from 'react';
import { Lock } from 'lucide-react';
import type { YouTubeVideo } from '../services/youtube';

// Re-export for backward compatibility
export type Video = YouTubeVideo;

interface VideoCardProps {
  video: YouTubeVideo;
  isUnlocked: boolean;
  onUnlockRequest: (videoId: string) => void;
  onPlayVideo: (video: YouTubeVideo) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, isUnlocked, onUnlockRequest, onPlayVideo }) => {
  const isLocked = video.isRestricted && !isUnlocked;

  const handleClick = () => {
    if (isLocked) {
      onUnlockRequest(video.id);
    } else {
      onPlayVideo(video);
    }
  };

  return (
    <div style={styles.card} onClick={handleClick}>
      <div style={styles.thumbnailContainer}>
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          style={{
            ...styles.thumbnail, 
            filter: isLocked ? 'blur(12px) brightness(0.4)' : 'none'
          }} 
          loading="lazy"
        />
        {isLocked && (
          <div style={styles.lockOverlay}>
            <div style={styles.lockIconCircle}>
              <Lock size={28} color="white" />
            </div>
            <span style={styles.lockText}>Conteúdo Restrito</span>
            <span style={styles.lockSubtext}>Toque para desbloquear com PIN</span>
          </div>
        )}
        {!isLocked && video.duration && (
          <span style={styles.duration}>{video.duration}</span>
        )}
        {!isLocked && (
          <div style={styles.hoverOverlay}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.7)" />
              <polygon points="19,14 36,24 19,34" fill="white" />
            </svg>
          </div>
        )}
      </div>
      <div style={styles.details}>
        <img 
          src={video.channelAvatar} 
          alt={video.channelName} 
          style={styles.avatar}
          loading="lazy"
        />
        <div style={styles.meta}>
          <h3 style={styles.title}>{video.title}</h3>
          <p style={styles.channelName}>{video.channelName}</p>
          <p style={styles.stats}>{video.views} • {video.timestamp}</p>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    cursor: 'pointer',
    width: '100%',
    transition: 'transform 0.2s ease',
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: '16/9',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'filter 0.3s ease, transform 0.3s ease',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(30,0,0,0.7) 100%)',
    backdropFilter: 'blur(2px)',
  },
  lockIconCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'rgba(204, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(204, 0, 0, 0.4)',
    marginBottom: '4px',
  },
  lockText: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  lockSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '12px',
  },
  duration: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    backgroundColor: 'rgba(0,0,0,0.85)',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
  hoverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s ease',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  details: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
  },
  meta: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  title: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    margin: '0 0 4px 0',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: '20px',
  },
  channelName: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: '0 0 2px 0',
  },
  stats: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: 0,
  }
};

export default VideoCard;
