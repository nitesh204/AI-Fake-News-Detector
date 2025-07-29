import axios from 'axios';

// Types for the API responses
export interface NewsPost {
  title: string;
  body: string;
  platform: string;
  date: string;
  label: boolean; // false = fake, true = real
  ai_prediction: 'REAL' | 'FAKE';
  region: string;
  image?: string;
}

export interface TrendsData {
  dataset_labels: {
    "false": number;
    "true": number;
  };
  platforms: Record<string, number>;
  regions: Record<string, number>;
}

export interface AITrendsData {
  ai_prediction_counts: {
    "FAKE": number;
    "REAL": number;
  };
}

export interface FiltersData {
  languages: string[];
  platforms: string[];
  regions: string[];
}

// Mock data for fallback
const mockPosts: NewsPost[] = [
  {
    title: 'Share by stating the old video of PM Modi\'s highest civilian honor of UAE',
    body: 'A video of Prime Minister Narendra Modi being honored with a gold chain has gone viral on social media. It is being claimed that "Sultan of Arabia"…',
    platform: 'Twitter',
    date: '2022-07-09',
    label: false,
    ai_prediction: 'REAL',
    region: 'National',
    image: 'https://i0.wp.com/www.altnews.in/Hindi/wp-content/uploads/sites/2/2022/07/Copy-of-FI-Template-25.jpg?resize=300%2C169&ssl=1'
  },
  {
    title: 'Fact-check: A reporter in Telangana stopped speaking to Home Minister Amit Shah?',
    body: 'A video is viral on social media in which a journalist can be seen questioning Home Minister Amit Shah. In the video, journalist asked Amit Shah…',
    platform: 'Twitter',
    date: '2022-07-09',
    label: false,
    ai_prediction: 'REAL',
    region: 'Telangana'
  },
  {
    title: 'Local Community Center Opens New Youth Program',
    body: 'The Riverside Community Center announced today the launch of their new after-school program designed to provide educational support and recreational activities for local youth...',
    platform: 'Facebook',
    date: '2024-01-15',
    label: true,
    ai_prediction: 'REAL',
    region: 'Local'
  },
  {
    title: 'BREAKING: Scientists Discover Cure for All Diseases Using Common Household Item',
    body: 'In a shocking revelation, researchers claim that lemon juice mixed with baking soda can cure any disease known to mankind. This miracle cure has been hidden by big pharma...',
    platform: 'Twitter',
    date: '2024-01-14',
    label: false,
    ai_prediction: 'FAKE',
    region: 'International'
  }
];

const mockTrends: TrendsData = {
  dataset_labels: {
    "false": 10319,
    "true": 15913
  },
  platforms: {
    "Twitter": 21879,
    "Facebook": 625,
    "twitter": 1713,
    "Facbook": 313
  },
  regions: {
    "National": 5000,
    "International": 3000,
    "Local": 2500
  }
};

const mockAITrends: AITrendsData = {
  ai_prediction_counts: {
    "FAKE": 4655,
    "REAL": 21577
  }
};

const mockFilters: FiltersData = {
  languages: ["English", "Hindi", "Bengali"],
  platforms: ["Twitter", "Facebook"],
  regions: ["National", "International", "Local"]
};

// Base URL for the Flask backend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions with fallbacks
export interface PostsParams {
  platform?: string;
  region?: string;
  label?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const fetchPosts = async (params: PostsParams = {}): Promise<NewsPost[]> => {
  try {
    const queryParams = new URLSearchParams();

    if (params.platform) queryParams.set('platform', params.platform);
    if (params.region) queryParams.set('region', params.region);
    if (params.label) queryParams.set('label', params.label);
    if (params.search) queryParams.set('search', params.search);
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());

    const url = `/get_posts${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    console.log('Fetching posts from:', `${BASE_URL}${url}`);

    const response = await api.get(url);
    console.log('Posts response:', response.status, response.data?.length || 0, 'items');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch posts from backend:', error);
    console.warn('Using mock data for posts');
    return mockPosts;
  }
};

export const fetchTrends = async (): Promise<TrendsData> => {
  try {
    console.log('Fetching trends from:', `${BASE_URL}/get_trends`);
    const response = await api.get('/get_trends');
    console.log('Trends response:', response.status, response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch trends from backend:', error);
    console.warn('Using mock data for trends');
    return mockTrends;
  }
};

export const fetchAITrends = async (): Promise<AITrendsData> => {
  try {
    console.log('Fetching AI trends from:', `${BASE_URL}/get_ai_trends`);
    const response = await api.get('/get_ai_trends');
    console.log('AI trends response:', response.status, response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch AI trends from backend:', error);
    console.warn('Using mock data for AI trends');
    return mockAITrends;
  }
};

export const fetchFilters = async (): Promise<FiltersData> => {
  try {
    const response = await api.get('/get_filters');
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable, using mock data for filters:', error);
    return mockFilters;
  }
};

// Helper function to check if API is available
export const checkAPIConnection = async (): Promise<boolean> => {
  try {
    console.log('Checking API connection to:', `${BASE_URL}/get_trends`);
    const response = await api.get('/get_trends');
    const isAvailable = response.status === 200;
    console.log('API connection status:', isAvailable ? 'CONNECTED' : 'FAILED', response.status);
    return isAvailable;
  } catch (error) {
    console.error('API connection failed:', error);
    return false;
  }
};

// Helper function to get combined trends data with API status
export const fetchAllTrends = async () => {
  const [trends, aiTrends] = await Promise.all([
    fetchTrends(),
    fetchAITrends()
  ]);

  return {
    dataset: trends,
    ai: aiTrends
  };
};

// Helper functions to work with the new data structure
export const getTotalPosts = (trends: TrendsData) => {
  return trends.dataset_labels.true + trends.dataset_labels.false;
};

export const getFakeNewsPercentage = (trends: TrendsData) => {
  const total = getTotalPosts(trends);
  return total > 0 ? (trends.dataset_labels.false / total) * 100 : 0;
};

export const getAIAccuracy = (trends: TrendsData, aiTrends: AITrendsData) => {
  const totalDataset = getTotalPosts(trends);
  const totalAI = aiTrends.ai_prediction_counts.REAL + aiTrends.ai_prediction_counts.FAKE;

  // Approximate accuracy based on label distribution similarity
  const datasetFakeRate = trends.dataset_labels.false / totalDataset;
  const aiFakeRate = aiTrends.ai_prediction_counts.FAKE / totalAI;

  // Simple approximation - closer rates indicate better accuracy
  const accuracy = Math.max(0, 100 - Math.abs(datasetFakeRate - aiFakeRate) * 100);
  return Math.min(100, accuracy);
};
