import { useState, useEffect } from 'react';
import { NewsPost, TrendsData, AITrendsData, fetchPosts, fetchAllTrends } from '@/lib/api';

export default function TestData() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading data...');
        const postsData = await fetchPosts();
        const trendsData = await fetchAllTrends();
        
        console.log('Posts:', postsData);
        console.log('Trends:', trendsData);
        
        setPosts(postsData);
        setTrends(trendsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Data Test</h1>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold">Posts Count: {posts.length}</h2>
        <pre className="text-xs mt-2 overflow-auto">
          {JSON.stringify(posts.slice(0, 2), null, 2)}
        </pre>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold">Trends Data:</h2>
        <pre className="text-xs mt-2 overflow-auto">
          {JSON.stringify(trends, null, 2)}
        </pre>
      </div>
    </div>
  );
}
