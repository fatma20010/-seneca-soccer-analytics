import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Zap
} from 'lucide-react';
import { AnalysisData } from '@/pages/AnalyzePage';
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

  const sentimentData = [
    { name: 'Positive', value: data.sentiment.positive, color: '#10B981' },
    { name: 'Negative', value: data.sentiment.negative, color: '#EF4444' },
    { name: 'Neutral', value: data.sentiment.neutral, color: '#6B7280' }
  ];

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

      case 'sentiment':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glow-card">
                <CardHeader>
                  <CardTitle>Fan Sentiment Distribution</CardTitle>
                  <CardDescription>Analysis of social media reactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {sentimentData.map((entry, index) => (
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
                  <CardTitle>Trending Keywords</CardTitle>
                  <CardDescription>Most mentioned terms by fans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.sentiment.keywords.map((keyword, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-card-border">
                        <span className="font-medium">#{keyword}</span>
                        <Badge variant="secondary">
                          {Math.floor(Math.random() * 1000 + 100)} mentions
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
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