import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Download, 
  Share, 
  RefreshCw, 
  Play, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  Star,
  Clock,
  Trophy,
  Zap,
  Search,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { AnalysisData } from '@/pages/AnalyzePage';
import { soccerAnalyticsApi, SentimentAnalysisData, TeamFeedbackData, MatchPrediction } from '@/services/soccerAnalyticsApi';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface AnalysisResultsProps {
  data: AnalysisData;
  onReset: () => void;
  uploadedFile: File | null;
}

const AnalysisResults = ({ data, onReset, uploadedFile }: AnalysisResultsProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Debug: Log the received data
  useEffect(() => {
    console.log('AnalysisResults received data:', data);
    console.log('Match prediction data:', data.matchPrediction);
  }, [data]);
  const [teamName, setTeamName] = useState('Barcelona');
  const [isAnalyzingSentiment, setIsAnalyzingSentiment] = useState(false);
  const [enhancedSentimentData, setEnhancedSentimentData] = useState<SentimentAnalysisData | null>(null);
  const [teamFeedback, setTeamFeedback] = useState<TeamFeedbackData | null>(null);
  const [sentimentError, setSentimentError] = useState<string | null>(null);

  // Use enhanced sentiment data if available, otherwise fallback to original data
  const currentSentimentData = enhancedSentimentData || {
    positive: data.sentiment.positive,
    negative: data.sentiment.negative,
    neutral: data.sentiment.neutral,
    keywords: data.sentiment.keywords,
    insights: [],
    recommendations: []
  };

  const sentimentChartData = [
    { name: 'Positive', value: currentSentimentData.positive, color: '#10B981' },
    { name: 'Negative', value: currentSentimentData.negative, color: '#EF4444' },
    { name: 'Neutral', value: currentSentimentData.neutral, color: '#6B7280' }
  ];

  // Load team feedback on component mount
  useEffect(() => {
    loadTeamFeedback();
  }, [teamName]);

  const loadTeamFeedback = async () => {
    try {
      const feedback = await soccerAnalyticsApi.getTeamFeedback(teamName);
      setTeamFeedback(feedback.data);
    } catch (error) {
      console.log('No team feedback available:', error);
    }
  };

  const analyzeSentiment = async () => {
    if (!teamFeedback) {
      setSentimentError('No team feedback data available');
      return;
    }

    setIsAnalyzingSentiment(true);
    setSentimentError(null);

    try {
      const result = await soccerAnalyticsApi.analyzeSentiment(teamName, teamFeedback);
      setEnhancedSentimentData(result.sentiment_analysis);
    } catch (error) {
      setSentimentError(error instanceof Error ? error.message : 'Sentiment analysis failed');
    } finally {
      setIsAnalyzingSentiment(false);
    }
  };

  const teamComparisonData = [
    { 
      metric: 'Overall Score', 
      teamA: data.mlScores.teamA.score, 
      teamB: data.mlScores.teamB.score 
    },
    { 
      metric: 'Possession', 
      teamA: data.mlScores.teamA.metrics.possession, 
      teamB: data.mlScores.teamB.metrics.possession 
    },
    { 
      metric: 'Pass Accuracy', 
      teamA: data.mlScores.teamA.metrics.accuracy, 
      teamB: data.mlScores.teamB.metrics.accuracy 
    }
  ];

  const radarData = [
    { subject: 'Attack', teamA: 85, teamB: 72, fullMark: 100 },
    { subject: 'Defense', teamA: 78, teamB: 88, fullMark: 100 },
    { subject: 'Midfield', teamA: 92, teamB: 75, fullMark: 100 },
    { subject: 'Set Pieces', teamA: 70, teamB: 85, fullMark: 100 },
    { subject: 'Pressing', teamA: 88, teamB: 70, fullMark: 100 },
    { subject: 'Creativity', teamA: 90, teamB: 68, fullMark: 100 }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'video', label: 'Video Analysis', icon: Play },
    { id: 'scoring', label: 'ML Scoring', icon: TrendingUp },
    { id: 'prediction', label: 'Match Prediction', icon: Target },
    { id: 'sentiment', label: 'Fan Sentiment', icon: Users },
    { id: 'recommendations', label: 'AI Insights', icon: Target }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Match Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="glow-card">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-orbitron font-bold text-primary mb-2">
                    {data.mlScores.teamA.score > data.mlScores.teamB.score ? data.mlScores.teamA.name : data.mlScores.teamB.name}
                  </div>
                  <div className="text-sm text-muted-foreground">Better Performance</div>
                </CardContent>
              </Card>

              <Card className="glow-card">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-secondary flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-orbitron font-bold text-secondary mb-2">
                    {data.videoMetrics.duration}
                  </div>
                  <div className="text-sm text-muted-foreground">Match Duration</div>
                </CardContent>
              </Card>

              <Card className="glow-card">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-ai flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-orbitron font-bold text-ai-purple mb-2">
                    {data.videoMetrics.events.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Key Events</div>
                </CardContent>
              </Card>
            </div>

            {/* Team Comparison Chart */}
            <Card className="glow-card">
              <CardHeader>
                <CardTitle>Team Performance Comparison</CardTitle>
                <CardDescription>ML-based performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={teamComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="metric" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="teamA" fill="#22C55E" name={data.mlScores.teamA.name} />
                    <Bar dataKey="teamB" fill="#3B82F6" name={data.mlScores.teamB.name} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tactical Radar */}
            <Card className="glow-card">
              <CardHeader>
                <CardTitle>Tactical Analysis</CardTitle>
                <CardDescription>Detailed tactical comparison across key areas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9CA3AF' }} />
                    <Radar 
                      name={data.mlScores.teamA.name} 
                      dataKey="teamA" 
                      stroke="#22C55E" 
                      fill="#22C55E" 
                      fillOpacity={0.2} 
                    />
                    <Radar 
                      name={data.mlScores.teamB.name} 
                      dataKey="teamB" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.2} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-6">
            <Card className="glow-card">
              <CardHeader>
                <CardTitle>Key Events Timeline</CardTitle>
                <CardDescription>AI-detected significant moments during the match</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.videoMetrics.events.map((event, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-surface border border-card-border">
                      <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary">{event.type}</Badge>
                          <span className="text-sm text-muted-foreground">{event.time}</span>
                        </div>
                        <p className="text-sm">{event.description}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4" />
                        Watch
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glow-card">
              <CardHeader>
                <CardTitle>Match Highlights</CardTitle>
                <CardDescription>Auto-generated highlight moments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {data.videoMetrics.highlights.map((highlight, index) => (
                    <div key={index} className="p-4 rounded-lg bg-surface border border-card-border text-center">
                      <div className="w-full h-24 bg-gradient-to-br from-primary to-primary-glow rounded-lg mb-3 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm font-medium">{highlight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'scoring':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    {data.mlScores.teamA.name}
                  </CardTitle>
                  <CardDescription>AI Performance Analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-orbitron font-bold text-primary mb-2">
                      {data.mlScores.teamA.score}/10
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Possession</span>
                        <span>{data.mlScores.teamA.metrics.possession}%</span>
                      </div>
                      <Progress value={data.mlScores.teamA.metrics.possession} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Pass Accuracy</span>
                        <span>{data.mlScores.teamA.metrics.accuracy}%</span>
                      </div>
                      <Progress value={data.mlScores.teamA.metrics.accuracy} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Total Passes</span>
                        <span>{data.mlScores.teamA.metrics.passes}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-secondary flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    {data.mlScores.teamB.name}
                  </CardTitle>
                  <CardDescription>AI Performance Analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-orbitron font-bold text-secondary mb-2">
                      {data.mlScores.teamB.score}/10
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Possession</span>
                        <span>{data.mlScores.teamB.metrics.possession}%</span>
                      </div>
                      <Progress value={data.mlScores.teamB.metrics.possession} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Pass Accuracy</span>
                        <span>{data.mlScores.teamB.metrics.accuracy}%</span>
                      </div>
                      <Progress value={data.mlScores.teamB.metrics.accuracy} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Total Passes</span>
                        <span>{data.mlScores.teamB.metrics.passes}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glow-card">
              <CardHeader>
                <CardTitle>Top Player Ratings</CardTitle>
                <CardDescription>ML-calculated individual player performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.mlScores.playerRatings.map((player, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-surface border border-card-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold">{player.name}</div>
                          <div className="text-sm text-muted-foreground">{player.position}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-orbitron font-bold text-primary">{player.rating}</div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'prediction':
        return (
          <div className="space-y-6">
            {/* Match Prediction Overview */}
            <Card className="glow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-ai flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  Neural Network Match Prediction
                </CardTitle>
                <CardDescription>
                  AI-powered outcome prediction based on video analysis features
                  {data.matchPrediction?.model_used && (
                    <span className="ml-2 text-xs px-2 py-1 rounded bg-ai-purple/20 text-ai-purple">
                      Model: {data.matchPrediction.model_used}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.matchPrediction ? (
                  <div className="space-y-6">
                    {/* Prediction Results */}
                    <div className="text-center">
                      <div className="text-4xl font-orbitron font-bold gradient-text mb-2">
                        {data.matchPrediction.predicted_outcome}
                      </div>
                      <div className="text-lg text-muted-foreground mb-4">
                        Predicted Outcome (Confidence: {(data.matchPrediction.confidence * 100).toFixed(1)}%)
                      </div>
                      
                      {/* Probability Bars */}
                      <div className="space-y-4 max-w-md mx-auto">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              Home Win
                            </span>
                            <span>{(data.matchPrediction.home_win_probability * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={data.matchPrediction.home_win_probability * 100} className="h-3" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              Draw
                            </span>
                            <span>{(data.matchPrediction.draw_probability * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={data.matchPrediction.draw_probability * 100} className="h-3" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              Away Win
                            </span>
                            <span>{(data.matchPrediction.away_win_probability * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={data.matchPrediction.away_win_probability * 100} className="h-3" />
                        </div>
                      </div>
                    </div>

                    {/* Prediction Visualization */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="glow-card">
                        <CardHeader>
                          <CardTitle className="text-lg">Outcome Probabilities</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Home Win', value: data.matchPrediction.home_win_probability * 100, color: '#10B981' },
                                  { name: 'Draw', value: data.matchPrediction.draw_probability * 100, color: '#F59E0B' },
                                  { name: 'Away Win', value: data.matchPrediction.away_win_probability * 100, color: '#3B82F6' }
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                <Cell fill="#10B981" />
                                <Cell fill="#F59E0B" />
                                <Cell fill="#3B82F6" />
                              </Pie>
                              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      <Card className="glow-card">
                        <CardHeader>
                          <CardTitle className="text-lg">Model Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Model Type:</span>
                              <span className="font-medium">{data.matchPrediction.model_used}</span>
                            </div>
                            {data.matchPrediction.features_used && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Features Used:</span>
                                <span className="font-medium">{data.matchPrediction.features_used}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Confidence:</span>
                              <span className="font-medium">{(data.matchPrediction.confidence * 100).toFixed(1)}%</span>
                            </div>
                            {data.matchPrediction.error && (
                              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                <p className="text-sm text-red-400">⚠️ {data.matchPrediction.error}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Feature Insights */}
                    <Card className="glow-card">
                      <CardHeader>
                        <CardTitle className="text-lg">Key Analysis Factors</CardTitle>
                        <CardDescription>Main factors contributing to the prediction</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="text-center p-4 rounded-lg bg-surface border border-card-border">
                            <div className="text-2xl font-bold text-primary mb-1">
                              {data.mlScores.teamA.metrics.possession || 50}%
                            </div>
                            <div className="text-sm text-muted-foreground">Home Possession</div>
                          </div>
                          <div className="text-center p-4 rounded-lg bg-surface border border-card-border">
                            <div className="text-2xl font-bold text-secondary mb-1">
                              {data.mlScores.teamA.metrics.accuracy || 0}%
                            </div>
                            <div className="text-sm text-muted-foreground">Pass Accuracy</div>
                          </div>
                          <div className="text-center p-4 rounded-lg bg-surface border border-card-border">
                            <div className="text-2xl font-bold text-ai-purple mb-1">
                              {data.soccerAnalytics?.goals_detected || 0}
                            </div>
                            <div className="text-sm text-muted-foreground">Goals Detected</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No ML Prediction Available</h3>
                    <p className="text-muted-foreground">
                      The neural network model prediction is not available for this analysis.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'sentiment':
        return (
          <div className="space-y-6">
            {/* Team Selection and Analysis Controls */}
            <Card className="glow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-ai-purple" />
                  AI Match Analysis
                </CardTitle>
                <CardDescription>Real-time analysis using your agent.py with Gemini AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Team Name</label>
                    <Input
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Enter team name (e.g., Barcelona)"
                      className="w-full"
                    />
                  </div>
                  <Button 
                    onClick={analyzeSentiment}
                    disabled={isAnalyzingSentiment || !teamFeedback}
                    className="flex items-center gap-2"
                  >
                    {isAnalyzingSentiment ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    {isAnalyzingSentiment ? 'Analyzing...' : 'Analyze Sentiment'}
                  </Button>
                </div>
                
                {sentimentError && (
                  <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-500">{sentimentError}</span>
                  </div>
                )}

                {teamFeedback && (
                  <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-sm text-green-500">
                      ✓ Found feedback data for {teamFeedback.team} ({teamFeedback.matches.length} matches)
                    </p>
                    <p className="text-xs text-green-400 mt-1">
                      {teamFeedback.matches.some(m => 
                        m.analysis.overall_feedback !== 'No data available for analysis.' && 
                        m.analysis.overall_feedback !== ''
                      ) ? 'Rich analysis data available' : 'Using AI-enhanced analysis based on team characteristics'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glow-card">
                <CardHeader>
                  <CardTitle>Sentiment Distribution</CardTitle>
                  <CardDescription>
                    {enhancedSentimentData ? 'AI-analyzed match feedback sentiment' : 'Analysis of social media reactions'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={sentimentChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {sentimentChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {sentimentChartData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: entry.color }} 
                        />
                        <span className="text-sm">{entry.name}: {entry.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glow-card">
                <CardHeader>
                  <CardTitle>Performance Keywords</CardTitle>
                  <CardDescription>
                    {enhancedSentimentData ? 'AI-identified key performance indicators' : 'Most mentioned terms by fans'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentSentimentData.keywords.map((keyword, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-card-border">
                        <span className="font-medium">#{keyword}</span>
                        <Badge variant="secondary">
                          {enhancedSentimentData ? 'AI-detected' : `${Math.floor(Math.random() * 1000 + 100)} mentions`}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Insights and Recommendations */}
            {enhancedSentimentData && (
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-ai-cyan" />
                      AI Insights
                    </CardTitle>
                    <CardDescription>Key observations from match analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {enhancedSentimentData.insights.map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-card-border">
                          <div className="w-6 h-6 rounded-full bg-ai-cyan/20 flex items-center justify-center mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-ai-cyan" />
                          </div>
                          <p className="text-sm">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-ai-purple" />
                      AI Recommendations
                    </CardTitle>
                    <CardDescription>Strategic suggestions based on analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {enhancedSentimentData.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-card-border">
                          <div className="w-6 h-6 rounded-full bg-ai-purple/20 flex items-center justify-center mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-ai-purple" />
                          </div>
                          <p className="text-sm">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );

      case 'recommendations':
        return (
          <div className="space-y-6">
            <Card className="glow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-ai-purple" />
                  Strategic Recommendations
                </CardTitle>
                <CardDescription>AI-generated tactical insights for future matches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      Recommended Formation
                    </h4>
                    <div className="p-4 rounded-lg bg-gradient-primary/10 border border-primary/20">
                      <div className="text-xl font-orbitron font-bold text-primary">
                        {data.recommendations.formation}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Based on tactical analysis and opponent weaknesses
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                      Tactical Adjustments
                    </h4>
                    <div className="space-y-2">
                      {data.recommendations.tactics.map((tactic, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-card-border">
                          <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-secondary" />
                          </div>
                          <p className="text-sm">{tactic}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-ai-purple" />
                      Substitution Strategy
                    </h4>
                    <div className="space-y-2">
                      {data.recommendations.substitutions.map((sub, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-card-border">
                          <div className="w-6 h-6 rounded-full bg-ai-purple/20 flex items-center justify-center mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-ai-purple" />
                          </div>
                          <p className="text-sm">{sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-ai-cyan" />
                      Key Insights
                    </h4>
                    <div className="space-y-2">
                      {data.recommendations.keyInsights.map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-card-border">
                          <div className="w-6 h-6 rounded-full bg-ai-cyan/20 flex items-center justify-center mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-ai-cyan" />
                          </div>
                          <p className="text-sm">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Results Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
          <BarChart3 className="w-4 h-4 text-success" />
          <span className="text-sm font-medium">Analysis Complete</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
          Match Analysis
          <br />
          <span className="gradient-text">Results</span>
        </h2>
        
        {uploadedFile && (
          <p className="text-muted-foreground">
            Analysis completed for: <span className="font-medium text-foreground">{uploadedFile.name}</span>
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button variant="hero" className="group">
          <Download className="w-4 h-4 group-hover:translate-y-[-2px] transition-transform" />
          Export Report
        </Button>
        <Button variant="pitch" className="group">
          <Share className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Share Results
        </Button>
        <Button variant="outline" onClick={onReset}>
          <RefreshCw className="w-4 h-4" />
          New Analysis
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 p-2 rounded-xl bg-surface border border-card-border">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2"
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in-up">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AnalysisResults;