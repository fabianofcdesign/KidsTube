import React from 'react';
import { X, ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal, Clock } from 'lucide-react';

import type { YouTubeVideo } from '../services/youtube';
import type { UserData } from '../hooks/useUserData';

interface VideoPlayerProps {
  video: YouTubeVideo;
  userData: UserData;
  onClose: () => void;
  toggleLike: (video: YouTubeVideo) => void;
  toggleWatchLater: (video: YouTubeVideo) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, userData, onClose, toggleLike, toggleWatchLater }) => {
  const isLiked = userData.liked.some(v => v.id === video.id);
  const isWatchLater = userData.watchLater.some(v => v.id === video.id);

  return (
    <div className="video-overlay" style={styles.overlay} onClick={onClose}>
      <div className="video-container" style={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className="video-close-btn" style={styles.closeBtn} onClick={onClose}>
          <X size={24} color="white" />
        </button>
        <div style={styles.playerWrapper}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`}
            title={video.title}
            style={styles.iframe}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="video-controls" style={styles.controls}>
          <div style={styles.controlGroup}>
            <button 
              style={{...styles.controlBtn, backgroundColor: isLiked ? 'var(--text-primary)' : 'rgba(255,255,255,0.1)'}} 
              onClick={() => toggleLike(video)}
            >
              <ThumbsUp size={20} color={isLiked ? 'var(--bg-color)' : 'var(--text-primary)'} />
              <span style={{...styles.controlText, color: isLiked ? 'var(--bg-color)' : 'var(--text-primary)'}}>
                {isLiked ? 'Gostou' : 'Gostei'}
              </span>
            </button>
            <button style={styles.controlBtn}>
              <ThumbsDown size={20} color="var(--text-primary)" />
            </button>
          </div>
          <div style={styles.controlGroup}>
            <button 
              style={{...styles.controlBtn, backgroundColor: isWatchLater ? 'var(--text-primary)' : 'rgba(255,255,255,0.1)'}} 
              onClick={() => toggleWatchLater(video)}
            >
              <Clock size={20} color={isWatchLater ? 'var(--bg-color)' : 'var(--text-primary)'} />
              <span style={{...styles.controlText, color: isWatchLater ? 'var(--bg-color)' : 'var(--text-primary)'}}>
                {isWatchLater ? 'Salvo' : 'Salvar'}
              </span>
            </button>
            <button style={styles.controlBtn}>
              <Share2 size={20} color="var(--text-primary)" />
              <span style={styles.controlText}>Compartilhar</span>
            </button>
            <button style={styles.controlBtn}>
              <Download size={20} color="var(--text-primary)" />
              <span style={styles.controlText}>Download</span>
            </button>
            <button style={styles.controlBtn}>
              <MoreHorizontal size={20} color="var(--text-primary)" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
    padding: '20px',
  },
  container: {
    width: '100%',
    maxWidth: '960px',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '-48px',
    right: '0',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
    zIndex: 10,
  },
  playerWrapper: {
    width: '100%',
    aspectRatio: '16/9',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#000',
    boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
  },
  controlGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  controlBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  controlText: {
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default VideoPlayer;
