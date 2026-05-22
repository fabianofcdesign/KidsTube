const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  thumbnail: string;
  title: string;
  channelName: string;
  channelAvatar: string;
  channelId: string;
  views: string;
  timestamp: string;
  duration: string;
  isRestricted?: boolean;
  isShort?: boolean;
}

interface YouTubeSearchItem {
  id: { videoId?: string; kind: string };
  snippet: {
    title: string;
    channelTitle: string;
    channelId: string;
    publishedAt: string;
    thumbnails: {
      high: { url: string };
      medium: { url: string };
    };
  };
}

interface YouTubeVideoItem {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    channelId: string;
    publishedAt: string;
    thumbnails: {
      high: { url: string };
      medium: { url: string };
    };
  };
  statistics: {
    viewCount: string;
  };
  contentDetails: {
    duration: string;
    contentRating?: {
      ytRating?: string;
    };
  };
}

function formatViews(count: string): string {
  const num = parseInt(count, 10);
  if (isNaN(num)) return '0 visualizações';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace('.0', '')} mi de visualizações`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)} mil visualizações`;
  return `${num} visualizações`;
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffYear > 0) return `há ${diffYear} ano${diffYear > 1 ? 's' : ''}`;
  if (diffMonth > 0) return `há ${diffMonth} ${diffMonth > 1 ? 'meses' : 'mês'}`;
  if (diffWeek > 0) return `há ${diffWeek} semana${diffWeek > 1 ? 's' : ''}`;
  if (diffDay > 0) return `há ${diffDay} dia${diffDay > 1 ? 's' : ''}`;
  if (diffHour > 0) return `há ${diffHour} hora${diffHour > 1 ? 's' : ''}`;
  if (diffMin > 0) return `há ${diffMin} minuto${diffMin > 1 ? 's' : ''}`;
  return 'agora mesmo';
}

function parseDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  const h = match[1] ? parseInt(match[1]) : 0;
  const m = match[2] ? parseInt(match[2]) : 0;
  const s = match[3] ? parseInt(match[3]) : 0;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function isShortDuration(iso: string): boolean {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return false;
  const h = match[1] ? parseInt(match[1]) : 0;
  const m = match[2] ? parseInt(match[2]) : 0;
  const s = match[3] ? parseInt(match[3]) : 0;
  return h === 0 && m === 0 && s <= 60;
}

// Cache channel avatars to reduce API calls
const channelAvatarCache: Record<string, string> = {};

async function getChannelAvatars(channelIds: string[]): Promise<Record<string, string>> {
  const uncached = channelIds.filter(id => !channelAvatarCache[id]);
  if (uncached.length === 0) {
    const result: Record<string, string> = {};
    channelIds.forEach(id => { result[id] = channelAvatarCache[id]; });
    return result;
  }

  try {
    const res = await fetch(
      `${BASE_URL}/channels?part=snippet&id=${uncached.join(',')}&key=${API_KEY}`
    );
    const data = await res.json();
    if (data.items) {
      data.items.forEach((item: any) => {
        channelAvatarCache[item.id] = item.snippet.thumbnails.default?.url || 
          `https://ui-avatars.com/api/?name=${encodeURIComponent(item.snippet.title)}&background=random`;
      });
    }
  } catch (e) {
    console.error('Error fetching channel avatars:', e);
  }

  const result: Record<string, string> = {};
  channelIds.forEach(id => {
    result[id] = channelAvatarCache[id] || `https://ui-avatars.com/api/?name=CH&background=random`;
  });
  return result;
}

export async function fetchPopularVideos(maxResults = 20): Promise<YouTubeVideo[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=BR&maxResults=${maxResults}&key=${API_KEY}`
    );
    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      console.error('YouTube API returned no items:', data);
      return [];
    }

    // Get channel avatars
    const channelIds = [...new Set(data.items.map((item: YouTubeVideoItem) => item.snippet.channelId))];
    const avatars = await getChannelAvatars(channelIds as string[]);

    return data.items.map((item: YouTubeVideoItem) => ({
      id: item.id,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      channelAvatar: avatars[item.snippet.channelId] || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.snippet.channelTitle)}&background=random`,
      channelId: item.snippet.channelId,
      views: formatViews(item.statistics.viewCount),
      timestamp: formatTimeAgo(item.snippet.publishedAt),
      duration: parseDuration(item.contentDetails.duration),
      isRestricted: item.contentDetails.contentRating?.ytRating === 'ytAgeRestricted',
      isShort: isShortDuration(item.contentDetails.duration),
    }));
  } catch (error) {
    console.error('Error fetching popular videos:', error);
    return [];
  }
}

export async function searchVideos(query: string, maxResults = 20): Promise<YouTubeVideo[]> {
  try {
    // First search
    const searchRes = await fetch(
      `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&regionCode=BR&key=${API_KEY}`
    );
    const searchData = await searchRes.json();

    if (!searchData.items || searchData.items.length === 0) return [];

    // Get video details for view count + duration
    const videoIds = searchData.items
      .filter((item: YouTubeSearchItem) => item.id.videoId)
      .map((item: YouTubeSearchItem) => item.id.videoId)
      .join(',');

    const detailsRes = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
    );
    const detailsData = await detailsRes.json();

    if (!detailsData.items) return [];

    // Get channel avatars
    const channelIds = [...new Set(detailsData.items.map((item: YouTubeVideoItem) => item.snippet.channelId))];
    const avatars = await getChannelAvatars(channelIds as string[]);

    return detailsData.items.map((item: YouTubeVideoItem) => ({
      id: item.id,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      channelAvatar: avatars[item.snippet.channelId] || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.snippet.channelTitle)}&background=random`,
      channelId: item.snippet.channelId,
      views: formatViews(item.statistics.viewCount),
      timestamp: formatTimeAgo(item.snippet.publishedAt),
      duration: parseDuration(item.contentDetails.duration),
      isRestricted: item.contentDetails.contentRating?.ytRating === 'ytAgeRestricted',
      isShort: isShortDuration(item.contentDetails.duration),
    }));
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
}

export async function fetchKidsVideos(maxResults = 12): Promise<YouTubeVideo[]> {
  // Search for kid-friendly content
  const queries = ['desenhos animados infantil', 'músicas infantis educativas', 'aprendendo cores números crianças'];
  const query = queries[Math.floor(Math.random() * queries.length)];
  
  try {
    const searchRes = await fetch(
      `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&safeSearch=strict&regionCode=BR&relevanceLanguage=pt&key=${API_KEY}`
    );
    const searchData = await searchRes.json();

    if (!searchData.items || searchData.items.length === 0) return [];

    const videoIds = searchData.items
      .filter((item: YouTubeSearchItem) => item.id.videoId)
      .map((item: YouTubeSearchItem) => item.id.videoId)
      .join(',');

    const detailsRes = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
    );
    const detailsData = await detailsRes.json();

    if (!detailsData.items) return [];

    const channelIds = [...new Set(detailsData.items.map((item: YouTubeVideoItem) => item.snippet.channelId))];
    const avatars = await getChannelAvatars(channelIds as string[]);

    return detailsData.items.map((item: YouTubeVideoItem) => ({
      id: item.id,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      channelAvatar: avatars[item.snippet.channelId] || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.snippet.channelTitle)}&background=random`,
      channelId: item.snippet.channelId,
      views: formatViews(item.statistics.viewCount),
      timestamp: formatTimeAgo(item.snippet.publishedAt),
      duration: parseDuration(item.contentDetails.duration),
      isRestricted: false,
      isShort: isShortDuration(item.contentDetails.duration),
    }));
  } catch (error) {
    console.error('Error fetching kids videos:', error);
    return [];
  }
}

export async function fetchVideosByCategory(categoryId: string, maxResults = 20): Promise<YouTubeVideo[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails&chart=mostPopular&videoCategoryId=${categoryId}&regionCode=BR&maxResults=${maxResults}&key=${API_KEY}`
    );
    const data = await res.json();

    if (!data.items || data.items.length === 0) return [];

    const channelIds = [...new Set(data.items.map((item: YouTubeVideoItem) => item.snippet.channelId))];
    const avatars = await getChannelAvatars(channelIds as string[]);

    return data.items.map((item: YouTubeVideoItem) => ({
      id: item.id,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      channelAvatar: avatars[item.snippet.channelId] || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.snippet.channelTitle)}&background=random`,
      channelId: item.snippet.channelId,
      views: formatViews(item.statistics.viewCount),
      timestamp: formatTimeAgo(item.snippet.publishedAt),
      duration: parseDuration(item.contentDetails.duration),
      isRestricted: item.contentDetails.contentRating?.ytRating === 'ytAgeRestricted',
      isShort: isShortDuration(item.contentDetails.duration),
    }));
  } catch (error) {
    console.error(`Error fetching category ${categoryId}:`, error);
    return [];
  }
}

export async function fetchShorts(maxResults = 20): Promise<YouTubeVideo[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/search?part=snippet&q=%23shorts&type=video&videoDuration=short&maxResults=${maxResults}&regionCode=BR&key=${API_KEY}`
    );
    const data = await res.json();

    if (!data.items || data.items.length === 0) return [];

    const videoIds = data.items
      .filter((item: YouTubeSearchItem) => item.id.videoId)
      .map((item: YouTubeSearchItem) => item.id.videoId)
      .join(',');

    const detailsRes = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
    );
    const detailsData = await detailsRes.json();

    if (!detailsData.items) return [];

    const channelIds = [...new Set(detailsData.items.map((item: YouTubeVideoItem) => item.snippet.channelId))];
    const avatars = await getChannelAvatars(channelIds as string[]);

    return detailsData.items.map((item: YouTubeVideoItem) => ({
      id: item.id,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      channelAvatar: avatars[item.snippet.channelId] || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.snippet.channelTitle)}&background=random`,
      channelId: item.snippet.channelId,
      views: formatViews(item.statistics.viewCount),
      timestamp: formatTimeAgo(item.snippet.publishedAt),
      duration: parseDuration(item.contentDetails.duration),
      isRestricted: item.contentDetails.contentRating?.ytRating === 'ytAgeRestricted',
      isShort: true, // Force to true since we searched for #shorts
    }));
  } catch (error) {
    console.error('Error fetching shorts:', error);
    return [];
  }
}
