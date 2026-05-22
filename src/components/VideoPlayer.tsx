import React, { useState } from 'react';
import { X, ThumbsUp, ThumbsDown, Share2, Download, Clock, ChevronDown, Play, Pause } from 'lucide-react';

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
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const isLiked = userData.liked.some(v => v.id === video.id);
  const isWatchLater = userData.watchLater.some(v => v.id === video.id);

  if (isMinimized) {
    return (
      <div style={styles.miniplayer} onClick={() => setIsMinimized(false)}>
        <img src={video.thumbnail} alt={video.title} style={styles.miniThumbnail} />
        <div style={styles.miniInfo}>
          <p style={styles.miniTitle}>{video.title}</p>
          <p style={styles.miniChannel}>{video.channelName}</p>
        </div>
        <div style={styles.miniControls}>
          <button style={styles.iconBtn} onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}>
            {isPlaying ? <Pause size={24} color="var(--text-primary)" /> : <Play size={24} color="var(--text-primary)" />}
          </button>
          <button style={styles.iconBtn} onClick={(e) => { e.stopPropagation(); onClose(); }}>
            <X size={24} color="var(--text-primary)" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="video-overlay" style={styles.overlay}>
      <div className="video-container" style={styles.container}>
        <div style={styles.header}>
          <button style={styles.iconBtn} onClick={() => setIsMinimized(true)}>
            <ChevronDown size={28} color="white" />
          </button>
          <div style={styles.headerActions}>
            {/* Additional header icons like cast, caption, settings */}
          </div>
        </div>
        
        <div style={styles.playerWrapper}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`}
            title={video.title}
            style={styles.iframe}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        
        <div style={styles.videoInfo}>
          <h2 style={styles.videoTitle}>{video.title}</h2>
          <p style={styles.videoStats}>{video.views} visualizações • {video.timestamp}</p>
        </div>

        <div style={styles.channelRow}>
          <div style={styles.channelInfo}>
            <img src={video.channelAvatar || 'https://via.placeholder.com/40'} alt="Avatar" style={styles.channelAvatar} />
            <div style={styles.channelTexts}>
              <p style={styles.channelName}>{video.channelName}</p>
              <p style={styles.subscribers}>1.2M inscritos</p>
            </div>
          </div>
          <button style={styles.subscribeBtn}>Inscrever-se</button>
        </div>

        <div className="video-controls" style={styles.controlsScroll}>
          <div style={styles.pillGroup}>
            <button 
              style={{...styles.pillBtn, borderRight: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px 0 0 20px', paddingRight: '12px'}} 
              onClick={() => toggleLike(video)}
            >
              <ThumbsUp size={18} color={isLiked ? 'var(--text-primary)' : 'var(--text-primary)'} fill={isLiked ? 'var(--text-primary)' : 'none'} />
              <span style={styles.pillText}>10K</span>
            </button>
            <button style={{...styles.pillBtn, borderRadius: '0 20px 20px 0', paddingLeft: '12px'}}>
              <ThumbsDown size={18} color="var(--text-primary)" />
            </button>
          </div>

          <button style={styles.pillSingleBtn} onClick={() => toggleWatchLater(video)}>
            <Clock size={18} color={isWatchLater ? 'var(--text-primary)' : 'var(--text-primary)'} fill={isWatchLater ? 'var(--text-primary)' : 'none'} />
            <span style={styles.pillText}>{isWatchLater ? 'Salvo' : 'Salvar'}</span>
          </button>
          
          <button style={styles.pillSingleBtn}>
            <Share2 size={18} color="var(--text-primary)" />
            <span style={styles.pillText}>Compartilhar</span>
          </button>
          
          <button style={styles.pillSingleBtn}>
            <Download size={18} color="var(--text-primary)" />
            <span style={styles.pillText}>Download</span>
          </button>
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
    backgroundColor: 'var(--bg-color)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 2000,
    overflowY: 'auto',
  },
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 12px',
    backgroundColor: '#000',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    cursor: 'pointer',
  },
  headerActions: {
    display: 'flex',
  },
  playerWrapper: {
    width: '100%',
    aspectRatio: '16/9',
    backgroundColor: '#000',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  videoInfo: {
    padding: '12px 16px',
  },
  videoTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: '0 0 8px 0',
    lineHeight: '24px',
  },
  videoStats: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  channelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 16px 12px 16px',
  },
  channelInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  channelAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  channelTexts: {
    display: 'flex',
    flexDirection: 'column',
  },
  channelName: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    margin: 0,
  },
  subscribers: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  subscribeBtn: {
    backgroundColor: 'var(--text-primary)',
    color: 'var(--bg-color)',
    border: 'none',
    borderRadius: '18px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  controlsScroll: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 16px 16px 16px',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    scrollbarWidth: 'none',
  },
  pillGroup: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    flexShrink: 0,
  },
  pillSingleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    border: 'none',
    padding: '8px 16px',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    flexShrink: 0,
  },
  pillBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '8px',
    color: 'var(--text-primary)',
    cursor: 'pointer',
  },
  pillText: {
    fontSize: '14px',
    fontWeight: '500',
  },
  miniplayer: {
    position: 'fixed',
    bottom: '56px', // height of BottomNav
    left: 0,
    right: 0,
    height: '52px',
    backgroundColor: '#212121',
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px 0 0',
    zIndex: 1900,
    boxShadow: '0 -2px 10px rgba(0,0,0,0.5)',
    cursor: 'pointer',
  },
  miniThumbnail: {
    height: '100%',
    aspectRatio: '16/9',
    objectFit: 'cover',
    marginRight: '12px',
  },
  miniInfo: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  miniTitle: {
    fontSize: '13px',
    color: 'var(--text-primary)',
    margin: '0 0 2px 0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  miniChannel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  miniControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  }
};

export default VideoPlayer;
