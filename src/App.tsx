import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import FeedPage from './pages/FeedPage';
import UserLibraryPage from './pages/UserLibraryPage';
import ShortsPage from './pages/ShortsPage';
import SearchResults from './pages/SearchResults';
import PinModal from './components/PinModal';
import VideoPlayer from './components/VideoPlayer';
import { useUserData } from './hooks/useUserData';
import { fetchVideosByCategory } from './services/youtube';
import './index.css';

function App() {
  const { userData, addToHistory, toggleLike, toggleWatchLater } = useUserData();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  
  const [unlockedVideoIds, setUnlockedVideoIds] = useState<string[]>([]);
  const [unlockTarget, setUnlockTarget] = useState<string | 'global' | null>(null);
  const [playingVideo, setPlayingVideo] = useState<any | null>(null);

  const handleLockClick = () => {
    if (isUnlocked) {
      setIsUnlocked(false);
      setUnlockedVideoIds([]);
    } else {
      setUnlockTarget('global');
      setIsPinModalOpen(true);
    }
  };

  const handleVideoUnlockRequest = (videoId: string) => {
    setUnlockTarget(videoId);
    setIsPinModalOpen(true);
  };

  const handlePinSuccess = () => {
    if (unlockTarget === 'global') {
      setIsUnlocked(true);
    } else if (unlockTarget) {
      setUnlockedVideoIds(prev => [...prev, unlockTarget]);
    }
    setUnlockTarget(null);
  };

  const handlePlayVideo = (video: any) => {
    setPlayingVideo(video);
    addToHistory(video);
  };

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <main style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--bg-color)' }}>
            <Routes>
              <Route path="/search" element={
                <SearchResults 
                  isUnlocked={isUnlocked} 
                  unlockedVideoIds={unlockedVideoIds}
                  onUnlockRequest={handleVideoUnlockRequest}
                  onPlayVideo={handlePlayVideo}
                />
              } />
              <Route path="/" element={
                <Home 
                  isUnlocked={isUnlocked} 
                  unlockedVideoIds={unlockedVideoIds}
                  onUnlockRequest={handleVideoUnlockRequest}
                  onPlayVideo={handlePlayVideo}
                />
              } />
              <Route path="/shorts" element={<ShortsPage isUnlocked={isUnlocked} />} />
              <Route path="/explore" element={
                <FeedPage 
                  title="Explorar" 
                  icon="🧭" 
                  fetchFunction={() => fetchVideosByCategory('0', 20)}
                  isUnlocked={isUnlocked}
                  unlockedVideoIds={unlockedVideoIds}
                  onUnlockRequest={handleVideoUnlockRequest}
                  onPlayVideo={handlePlayVideo}
                />
              } />
              <Route path="/subscriptions" element={
                <FeedPage 
                  title="Inscrições" 
                  icon="▶️" 
                  fetchFunction={() => fetchVideosByCategory('24', 15)}
                  isUnlocked={isUnlocked}
                  unlockedVideoIds={unlockedVideoIds}
                  onUnlockRequest={handleVideoUnlockRequest}
                  onPlayVideo={handlePlayVideo}
                />
              } />
              <Route path="/history" element={
                <UserLibraryPage 
                  title="Você (Configurações)" 
                  icon="⚙️" 
                  videos={userData.history}
                  isUnlocked={isUnlocked}
                  unlockedVideoIds={unlockedVideoIds}
                  onUnlockRequest={handleVideoUnlockRequest}
                  onPlayVideo={handlePlayVideo}
                  headerAction={
                    <button 
                      onClick={handleLockClick} 
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 'bold'
                      }}
                    >
                      {isUnlocked ? '🔒 Bloquear App' : '🔓 Desbloquear Tudo'}
                    </button>
                  }
                />
              } />
              <Route path="/later" element={
                <UserLibraryPage 
                  title="Assistir mais tarde" 
                  icon="⌛" 
                  videos={userData.watchLater}
                  isUnlocked={isUnlocked}
                  unlockedVideoIds={unlockedVideoIds}
                  onUnlockRequest={handleVideoUnlockRequest}
                  onPlayVideo={handlePlayVideo}
                />
              } />
              <Route path="/liked" element={
                <UserLibraryPage 
                  title="Vídeos marcados como Gostei" 
                  icon="👍" 
                  videos={userData.liked}
                  isUnlocked={isUnlocked}
                  unlockedVideoIds={unlockedVideoIds}
                  onUnlockRequest={handleVideoUnlockRequest}
                  onPlayVideo={handlePlayVideo}
                />
              } />
              <Route path="/trending" element={
                <FeedPage 
                  title="Em alta" 
                  icon="🔥" 
                  fetchFunction={() => fetchVideosByCategory('0', 20)}
                  isUnlocked={isUnlocked}
                  unlockedVideoIds={unlockedVideoIds}
                  onUnlockRequest={handleVideoUnlockRequest}
                  onPlayVideo={handlePlayVideo}
                />
              } />
              <Route path="/music" element={
                <FeedPage 
                  title="Música" 
                  icon="🎵" 
                  fetchFunction={() => fetchVideosByCategory('10', 20)}
                  isUnlocked={isUnlocked}
                  unlockedVideoIds={unlockedVideoIds}
                  onUnlockRequest={handleVideoUnlockRequest}
                  onPlayVideo={handlePlayVideo}
                />
              } />
              <Route path="/gaming" element={
                <FeedPage 
                  title="Jogos" 
                  icon="🎮" 
                  fetchFunction={() => fetchVideosByCategory('20', 20)}
                  isUnlocked={isUnlocked}
                  unlockedVideoIds={unlockedVideoIds}
                  onUnlockRequest={handleVideoUnlockRequest}
                  onPlayVideo={handlePlayVideo}
                />
              } />
            </Routes>
          </main>
        </div>
        <BottomNav isUnlocked={isUnlocked} />
      </div>
      <PinModal 
        isOpen={isPinModalOpen} 
        onClose={() => setIsPinModalOpen(false)} 
        onSuccess={handlePinSuccess} 
      />
      {playingVideo && (
        <VideoPlayer 
          video={playingVideo}
          userData={userData}
          toggleLike={toggleLike}
          toggleWatchLater={toggleWatchLater}
          onClose={() => setPlayingVideo(null)} 
        />
      )}
    </Router>
  );
}

export default App;
