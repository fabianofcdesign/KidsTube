import React, { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';
import { fetchPopularVideos, fetchKidsVideos, type YouTubeVideo } from '../services/youtube';

interface HomeProps {
  isUnlocked: boolean;
  unlockedVideoIds: string[];
  onUnlockRequest: (videoId: string) => void;
  onPlayVideo: (video: YouTubeVideo) => void;
}

const Home: React.FC<HomeProps> = ({ isUnlocked, unlockedVideoIds, onUnlockRequest, onPlayVideo }) => {
  const [kidsVideos, setKidsVideos] = useState<YouTubeVideo[]>([]);
  const [allVideos, setAllVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tudo');

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const [kids, popular] = await Promise.all([
        fetchKidsVideos(12),
        fetchPopularVideos(20),
      ]);
      setKidsVideos(kids);
      // Mark popular videos that are NOT in kids as restricted
      const kidsIds = new Set(kids.map(v => v.id));
      const markedPopular = popular.map(v => ({
        ...v,
        isRestricted: !kidsIds.has(v.id),
      }));
      setAllVideos(markedPopular);
    } catch (err) {
      console.error('Failed to load videos:', err);
    }
    setLoading(false);
  };

  // Combine videos based on unlock state
  const videos = isUnlocked
    ? [...kidsVideos, ...allVideos]
    : [...kidsVideos]; // Do not show restricted videos when locked

  // Remove duplicates by id
  const uniqueVideos = videos.filter((v, i, arr) => arr.findIndex(x => x.id === v.id) === i);

  const categories = ['Tudo', 'Desenhos', 'Música', 'Educativo'];
  if (isUnlocked) {
    categories.push('Shorts', 'Games', 'Notícias', 'Em alta');
  }

  // Filter Shorts
  const shorts = allVideos.filter(v => v.isShort);

  return (
    <div style={styles.container}>
      {/* Categories */}
      <div style={styles.categories}>
        {categories.map(cat => (
          <button
            key={cat}
            style={{
              ...styles.categoryBtn,
              ...(activeCategory === cat ? styles.activeBtn : {}),
            }}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Carregando vídeos do YouTube...</p>
        </div>
      )}

      {/* Shorts Section */}
      {!loading && isUnlocked && shorts.length > 0 && (
        <div style={styles.shortsContainer}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.shortsIcon}>▶</span>
            Shorts
          </h2>
          <div style={styles.shortsGrid}>
            {shorts.slice(0, 6).map(video => (
              <div
                key={video.id}
                style={styles.shortCard}
                onClick={() => onPlayVideo(video)}
              >
                <div style={styles.shortThumbnail}>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    style={styles.shortImg}
                    loading="lazy"
                  />
                </div>
                <p style={styles.shortTitle}>{video.title}</p>
                <p style={styles.shortViews}>{video.views}</p>
              </div>
            ))}
          </div>
          <div style={styles.divider} />
        </div>
      )}

      {/* Videos Grid */}
      {!loading && (
        <div style={styles.grid}>
          {uniqueVideos.map(video => (
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

      {/* Empty State */}
      {!loading && uniqueVideos.length === 0 && (
        <div style={styles.emptyState}>
          <p style={styles.emptyIcon}>📺</p>
          <p style={styles.emptyText}>Nenhum vídeo encontrado</p>
          <p style={styles.emptySubtext}>Verifique sua conexão ou tente novamente mais tarde.</p>
          <button style={styles.retryBtn} onClick={loadVideos}>Tentar novamente</button>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '16px 24px',
  },
  categories: {
    display: 'flex',
    gap: '10px',
    marginBottom: '24px',
    overflowX: 'auto',
    paddingBottom: '12px',
    scrollbarWidth: 'none',
  },
  categoryBtn: {
    padding: '8px 16px',
    backgroundColor: 'var(--hover-bg)',
    color: 'var(--text-primary)',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
  },
  activeBtn: {
    backgroundColor: 'var(--text-primary)',
    color: 'var(--bg-color)',
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
  shortsContainer: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-primary)',
  },
  shortsIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    backgroundColor: 'var(--accent-color)',
    color: 'white',
    fontSize: '12px',
  },
  shortsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '12px',
  },
  shortCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  shortThumbnail: {
    width: '100%',
    aspectRatio: '9/16',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  shortImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  shortTitle: {
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '18px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    color: 'var(--text-primary)',
    margin: 0,
  },
  shortViews: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  divider: {
    height: '4px',
    backgroundColor: 'var(--border-color)',
    margin: '24px 0',
    borderRadius: '2px',
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
  retryBtn: {
    marginTop: '16px',
    padding: '10px 24px',
    backgroundColor: 'var(--accent-color)',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
};

export default Home;
