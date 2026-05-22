import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { searchVideos, type YouTubeVideo } from '../services/youtube';

interface SearchResultsProps {
  isUnlocked: boolean;
  unlockedVideoIds: string[];
  onUnlockRequest: (videoId: string) => void;
  onPlayVideo: (video: YouTubeVideo) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  isUnlocked, 
  unlockedVideoIds, 
  onUnlockRequest, 
  onPlayVideo 
}) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setIsLoading(true);
      const results = await searchVideos(query);
      setVideos(results);
      setIsLoading(false);
    };
    
    fetchResults();
  }, [query]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Resultados para "{query}"</h2>
      
      {isLoading ? (
        <div style={styles.loader}>Buscando vídeos...</div>
      ) : (
        <div style={styles.grid}>
          {videos.map(video => {
            const canPlay = !video.isRestricted || isUnlocked || unlockedVideoIds.includes(video.id);
            return (
              <VideoCard 
                key={video.id} 
                video={video} 
                canPlay={canPlay}
                onPlay={() => onPlayVideo(video)}
                onUnlockRequest={() => onUnlockRequest(video.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    color: 'var(--text-primary)',
    marginBottom: '24px',
    fontSize: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },
  loader: {
    color: 'var(--text-secondary)',
    textAlign: 'center' as const,
    padding: '40px',
  }
};

export default SearchResults;
