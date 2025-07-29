import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Database, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TrendsData, AITrendsData, getTotalPosts, getFakeNewsPercentage, getAIAccuracy } from '@/lib/api';

interface SimpleTrendsChartProps {
  datasetTrends: TrendsData;
  aiTrends: AITrendsData;
  loading?: boolean;
}

export function SimpleTrendsChart({ datasetTrends, aiTrends, loading = false }: SimpleTrendsChartProps) {
  // Prepare data for comparison chart
  const comparisonData = [
    {
      category: 'Real News',
      dataset: datasetTrends.dataset_labels.true,
      ai_prediction: aiTrends.ai_prediction_counts.REAL,
    },
    {
      category: 'Fake News',
      dataset: datasetTrends.dataset_labels.false,
      ai_prediction: aiTrends.ai_prediction_counts.FAKE,
    },
  ];

  // Calculate metrics
  const totalPosts = getTotalPosts(datasetTrends);
  const fakeNewsPercentage = getFakeNewsPercentage(datasetTrends);
  const aiAccuracy = getAIAccuracy(datasetTrends, aiTrends);
  const totalAI = aiTrends.ai_prediction_counts.REAL + aiTrends.ai_prediction_counts.FAKE;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold">{totalPosts.toLocaleString()}</p>
              </div>
              <Database className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fake News Rate</p>
                <p className="text-2xl font-bold text-red-600">{fakeNewsPercentage.toFixed(1)}%</p>
              </div>
              <div className="h-8 w-8 text-red-500">⚠️</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Predictions</p>
                <p className="text-2xl font-bold">{totalAI.toLocaleString()}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Est. Accuracy</p>
                <p className="text-2xl font-bold text-green-600">{aiAccuracy.toFixed(1)}%</p>
              </div>
              <div className="h-8 w-8 text-green-500">✅</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparison Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Dataset vs AI Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="dataset" fill="#10b981" name="Dataset" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ai_prediction" fill="#3b82f6" name="AI Prediction" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Model Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Real News Detection</span>
                <Badge className="bg-green-50 text-green-700 border-green-200">
                  {((aiTrends.ai_prediction_counts.REAL / totalAI) * 100).toFixed(1)}%
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Fake News Detection</span>
                <Badge className="bg-red-50 text-red-700 border-red-200">
                  {((aiTrends.ai_prediction_counts.FAKE / totalAI) * 100).toFixed(1)}%
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Precision</span>
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                  {aiAccuracy.toFixed(1)}%
                </Badge>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-green-600">Model Status: Active</p>
                <p className="text-xs text-gray-500">
                  Last updated: 2 minutes ago
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
