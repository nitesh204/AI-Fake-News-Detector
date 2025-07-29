import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendsData, AITrendsData } from '@/lib/api';
import { TrendingUp, TrendingDown, Brain, Database, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TrendsChartProps {
  datasetTrends: TrendsData;
  aiTrends: AITrendsData;
  loading?: boolean;
}

export function TrendsChart({ datasetTrends, aiTrends, loading = false }: TrendsChartProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Prepare data for comparison chart
  const comparisonData = [
    {
      category: 'Real News',
      dataset: datasetTrends.real_count,
      ai_prediction: aiTrends.ai_real_count,
    },
    {
      category: 'Fake News',
      dataset: datasetTrends.fake_count,
      ai_prediction: aiTrends.ai_fake_count,
    },
  ];

  // Prepare data for pie charts
  const datasetPieData = [
    { name: 'Real', value: datasetTrends.real_count, color: '#10b981' },
    { name: 'Fake', value: datasetTrends.fake_count, color: '#ef4444' },
  ];

  const aiPieData = [
    { name: 'Real', value: aiTrends.ai_real_count, color: '#3b82f6' },
    { name: 'Fake', value: aiTrends.ai_fake_count, color: '#f59e0b' },
  ];

  // Calculate accuracy metrics
  const totalDataset = datasetTrends.real_count + datasetTrends.fake_count;
  const totalAI = aiTrends.ai_real_count + aiTrends.ai_fake_count;
  const fakeNewsPercentage = ((datasetTrends.fake_count / totalDataset) * 100).toFixed(1);
  const aiAccuracyApprox = (((Math.min(datasetTrends.real_count, aiTrends.ai_real_count) + Math.min(datasetTrends.fake_count, aiTrends.ai_fake_count)) / totalDataset) * 100).toFixed(1);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'dataset' ? 'Dataset' : 'AI Prediction'}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-bold">{totalDataset.toLocaleString()}</p>
              </div>
              <Database className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fake News Rate</p>
                <p className="text-2xl font-bold text-red-600">{fakeNewsPercentage}%</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Predictions</p>
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
                <p className="text-sm font-medium text-muted-foreground">Est. Accuracy</p>
                <p className="text-2xl font-bold text-green-600">{aiAccuracyApprox}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
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
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="dataset" fill="#10b981" name="Dataset" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ai_prediction" fill="#3b82f6" name="AI Prediction" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Dataset Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Dataset Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={datasetPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {datasetPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Posts']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Predictions Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Predictions Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={aiPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {aiPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Predictions']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Model Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Real News Detection</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {((aiTrends.ai_real_count / datasetTrends.real_count) * 100).toFixed(1)}%
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Fake News Detection</span>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {((aiTrends.ai_fake_count / datasetTrends.fake_count) * 100).toFixed(1)}%
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Precision</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {aiAccuracyApprox}%
                </Badge>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                * Metrics are approximated based on label distribution comparison
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
