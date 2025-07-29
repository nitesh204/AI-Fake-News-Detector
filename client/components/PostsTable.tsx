import { useState } from 'react';
import { NewsPost } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostsTableProps {
  posts: NewsPost[];
  loading?: boolean;
}

export function PostsTable({ posts, loading = false }: PostsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [labelFilter, setLabelFilter] = useState<string>('all');

  // Filter posts based on search and filters
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = platformFilter === 'all' || post.platform === platformFilter;
    const matchesLabel = labelFilter === 'all' || post.dataset_label === labelFilter;
    
    return matchesSearch && matchesPlatform && matchesLabel;
  });

  const getLabelBadge = (label: 'real' | 'fake', prediction: 'real' | 'fake') => {
    const isCorrect = label === prediction;
    
    return (
      <div className="flex flex-col gap-1">
        <Badge 
          variant={label === 'real' ? 'default' : 'destructive'}
          className={cn(
            "text-xs",
            label === 'real' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
          )}
        >
          {label.toUpperCase()}
        </Badge>
        <Badge 
          variant="outline"
          className={cn(
            "text-xs",
            isCorrect ? 'border-green-500 text-green-700' : 'border-orange-500 text-orange-700'
          )}
        >
          AI: {prediction.toUpperCase()}
        </Badge>
      </div>
    );
  };

  const getConfidenceBar = (confidence?: number) => {
    if (!confidence) return null;
    
    const percentage = Math.round(confidence * 100);
    const color = confidence > 0.8 ? 'bg-green-500' : confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500';
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 max-w-20">
        <div 
          className={cn("h-2 rounded-full transition-all", color)}
          style={{ width: `${percentage}%` }}
        />
        <span className="text-xs text-muted-foreground mt-1 block">{percentage}%</span>
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>News Posts Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="Twitter">Twitter</SelectItem>
              <SelectItem value="Reddit">Reddit</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
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
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No posts match your search criteria
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                      {post.body}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline">{post.platform}</Badge>
                      <span>•</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Labels and AI Prediction */}
                  <div className="flex flex-col items-end gap-3 lg:w-48">
                    {getLabelBadge(post.dataset_label, post.ai_prediction)}
                    {getConfidenceBar(post.confidence)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {filteredPosts.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View More Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
