import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Database, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { NewsPost, FiltersData, fetchFilters, fetchPosts, PostsParams } from '@/lib/api';

interface SimplePostsTableProps {
  onDataUpdate?: (posts: NewsPost[]) => void;
  loading?: boolean;
}

export function SimplePostsTable({ onDataUpdate, loading = false }: SimplePostsTableProps) {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [labelFilter, setLabelFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FiltersData>({ languages: [], platforms: [], regions: [] });

  useEffect(() => {
    const loadFilters = async () => {
      const filtersData = await fetchFilters();
      setFilters(filtersData);
    };
    loadFilters();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const params: PostsParams = {
        page: currentPage,
        limit: limit,
      };

      if (platformFilter !== 'all') params.platform = platformFilter;
      if (regionFilter !== 'all') params.region = regionFilter;
      if (labelFilter !== 'all') params.label = labelFilter === 'real' ? 'true' : 'false';
      if (searchTerm.trim()) params.search = searchTerm.trim();

      console.log('Loading posts with params:', params);
      const postsData = await fetchPosts(params);
      setPosts(postsData);

      if (onDataUpdate) {
        onDataUpdate(postsData);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [currentPage, platformFilter, regionFilter, labelFilter]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    loadPosts();
  };

  const handleRefresh = () => {
    loadPosts();
  };

  // Posts are already filtered by backend, no need for client-side filtering
  const filteredPosts = posts;

  const getLabelBadge = (label: boolean, prediction: 'REAL' | 'FAKE') => {
    const labelText = label ? 'REAL' : 'FAKE';
    const isCorrect = (label === true && prediction === 'REAL') || (label === false && prediction === 'FAKE');

    return (
      <div className="flex flex-col gap-1">
        <Badge
          className={
            label
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }
        >
          {labelText}
        </Badge>
        <Badge
          variant="outline"
          className={
            isCorrect
              ? 'border-green-500 text-green-700'
              : 'border-orange-500 text-orange-700'
          }
        >
          AI: {prediction}
        </Badge>
      </div>
    );
  };



  if (loading && posts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>News Posts Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          News Posts Analysis
          <Badge variant="outline" className="ml-auto">
            {filteredPosts.length} posts
          </Badge>
        </CardTitle>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9"
            />
          </div>

          <Button onClick={handleSearch} disabled={isLoading} className="gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
          
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {filters.platforms.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {filters.regions
                .filter(region => {
                  // Filter out dash-only regions and empty strings
                  return region &&
                         region.trim() !== '' &&
                         !region.match(/^-+$/) && // Remove entries that are only dashes
                         region.length > 1; // Remove single character entries
                })
                .sort() // Sort alphabetically
                .map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select value={labelFilter} onValueChange={setLabelFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Label" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Labels</SelectItem>
              <SelectItem value="real">Real</SelectItem>
              <SelectItem value="fake">Fake</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleRefresh} disabled={isLoading} variant="outline" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No posts match your search criteria
            </div>
          ) : (
            filteredPosts.map((post, index) => (
              <div key={`${post.title}-${post.date}-${index}`} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full lg:w-32 h-20 object-cover rounded mb-3 lg:float-right lg:ml-4"
                      />
                    )}
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {post.body}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <Badge variant="outline">{post.platform}</Badge>
                      <span>•</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      {post.region && (
                        <>
                          <span>•</span>
                          <span>{post.region}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Labels and AI Prediction */}
                  <div className="flex flex-col items-end gap-3 lg:w-48">
                    {getLabelBadge(post.label, post.ai_prediction)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Pagination Controls */}
        {filteredPosts.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || isLoading}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <span className="text-sm text-gray-600">
                Page {currentPage} • {filteredPosts.length} posts
              </span>

              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={filteredPosts.length < limit || isLoading}
                className="gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" className="gap-2">
              <Database className="h-4 w-4" />
              Export Results
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
