import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Shield, RefreshCw, Database, Brain, TrendingUp } from 'lucide-react'
import { SimpleTrendsChart } from '@/components/SimpleTrendsChart'
import { SimplePostsTable } from '@/components/SimplePostsTable'
import {
  NewsPost, TrendsData, AITrendsData,
  fetchAllTrends, getTotalPosts, getFakeNewsPercentage, checkAPIConnection
} from '@/lib/api'

// Enhanced glass styles & accent classes
const dashboardWrapper = `
  min-h-screen 
  bg-gradient-to-br from-emerald-50 via-indigo-50 to-white/80
  px-2 pb-16`;

const glassCard = `
  backdrop-blur-2xl bg-white/70 rounded-3xl shadow-2xl
  border border-gray-200 hover:shadow-xl transition-all
`

const animatedPulse =
  "relative overflow-visible before:content-[''] before:absolute before:inset-0 before:rounded-xl before:bg-green-400/20 before:animate-pulse before:opacity-80"

// Modern accent for dashboard title
const animatedTitle = `
  bg-gradient-to-r from-red-500 via-red-600 to-red-500
  bg-clip-text text-transparent inline-block
  font-extrabold drop-shadow-lg
`


export default function SimpleDashboard() {
  const [currentPosts, setCurrentPosts] = useState<NewsPost[]>([])
  const [datasetTrends, setDatasetTrends] = useState<TrendsData>({
    dataset_labels: { "false": 0, "true": 0 },
    platforms: {},
    regions: {}
  })
  const [aiTrends, setAITrends] = useState<AITrendsData>({
    ai_prediction_counts: { "FAKE": 0, "REAL": 0 }
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isUsingMockData, setIsUsingMockData] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const isAPIAvailable = await checkAPIConnection()
      setIsUsingMockData(!isAPIAvailable)
      const trendsData = await fetchAllTrends()
      setDatasetTrends(trendsData.dataset)
      setAITrends(trendsData.ai)
      setLastUpdated(new Date())
    } catch (error) {
      setIsUsingMockData(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handlePostsUpdate = (posts: NewsPost[]) => setCurrentPosts(posts)
  const handleRefresh = () => loadData()

  return (
    <div className={dashboardWrapper}>
      {/* Header */}
      <div className="backdrop-blur bg-white/70 sticky top-0 z-10 border-b border-indigo-100 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-7">
            <div className="flex gap-4 items-center">
              <span className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 via-emerald-100 to-white shadow">
                <Shield className="h-7 w-7 text-emerald-600" />
              </span>
              <div>
                <h1 className={`text-3xl md:text-4xl ${animatedTitle}`}>FakeNews Dashboard</h1>
                <p className="text-gray-600 tracking-tight text-sm md:text-base mt-1 font-medium">
                  Real-time misinformation detection &amp; analytics
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-3 mt-4 md:mt-0">
              {isUsingMockData ? (
                <Badge className="relative bg-gradient-to-tr from-orange-400 via-orange-600 to-pink-500 text-white border-none shadow animate-pulse">
                  Demo Mode
                </Badge>
              ) : (
                <Badge className={`bg-gradient-to-tr from-green-400 via-green-500 to-green-500 text-black border-black shadow-md ${animatedPulse}`}>
                  Live Data
                </Badge>
              )}
              <span className="text-xs md:text-sm text-gray-500" title={lastUpdated.toLocaleString()}>
                {lastUpdated.toLocaleTimeString()}
              </span>
              <Button
                onClick={handleRefresh}
                disabled={loading}
                size="sm"
                variant="outline"
                className="gap-2 border-0 rounded-lg shadow hover:scale-[1.06] focus:ring-2 focus:ring-indigo-400 transition"
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin text-emerald-600' : 'text-gray-400'}`} />
                <span className={loading ? 'text-emerald-700/80' : 'text-gray-700'}>Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto max-w-7xl px-2 md:px-8 py-9 space-y-10">
        {isUsingMockData && (
          <Card className="border-0 bg-gradient-to-r from-orange-50 via-yellow-50 to-white/90 shadow-lg rounded-2xl">
            <CardContent className="p-5 flex flex-row items-center gap-3">
              <span className="text-2xl animate-bounce">⚠️</span>
              <div>
                <p className="font-medium text-orange-700">
                  Demo Mode Active
                </p>
                <p className="text-xs text-orange-600">
                  Backend unavailable. Showing mock data for demo purposes.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <Card className={glassCard + ' border-0'}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold text-gray-900">Detection Engine</CardTitle>
              <Brain className="h-5 w-5 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-black text-green-700">AI Powered</span>
              <p className="text-xs text-gray-500">Advanced ML algorithms for content analysis</p>
            </CardContent>
          </Card>

          <Card className={glassCard + ' border-0'}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold text-gray-900">Total Posts Analyzed</CardTitle>
              <Database className="h-5 w-5 text-sky-700" />
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-black text-gray-900">{getTotalPosts(datasetTrends).toLocaleString()}</span>
              <p className="text-xs text-gray-500">Across multiple social platforms</p>
            </CardContent>
          </Card>

          <Card className={glassCard + ' border-0'}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold text-gray-900">Misinformation Rate</CardTitle>
              <TrendingUp className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-black text-red-500">{getFakeNewsPercentage(datasetTrends).toFixed(1)}%</span>
              <p className="text-xs text-gray-500">Of analyzed content flagged as fake</p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-4" />

        {/* Trends Chart */}
        <section className={glassCard + " p-6 border-0"}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-indigo-700" />
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Trend Analysis</h2>
          </div>
          <SimpleTrendsChart
            datasetTrends={datasetTrends}
            aiTrends={aiTrends}
            loading={loading}
          />
        </section>

        <Separator className="my-4" />

        {/* Posts Table Section */}
        <section className={glassCard + " p-6 border-0"}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-pink-700" />
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                Content Analysis
              </h2>
            </div>
            <Badge className="bg-sky-100 text-sky-700 border-sky-300 font-mono rounded-lg shadow">
              <Database className="h-4 w-4" /> {currentPosts.length} posts loaded
            </Badge>
          </div>
          <SimplePostsTable
            onDataUpdate={handlePostsUpdate}
            loading={loading}
          />
        </section>
      </div>
    </div>
  )
}
