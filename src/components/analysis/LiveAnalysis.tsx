import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  Activity, 
  Users, 
  Target, 
  Zap,
  Eye,
  BarChart3,
  Timer,
  Settings
} from 'lucide-react';
import { soccerAnalyticsApi, LiveFrameData } from '@/services/soccerAnalyticsApi';

interface LiveAnalysisProps {
  uploadedFile: File | null;
  onAnalysisComplete: (results: any) => void;
  onError: (error: string) => void;
}

const LiveAnalysis = ({ uploadedFile, onAnalysisComplete, onError }: LiveAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFrame, setCurrentFrame] = useState<string | null>(null);
  const [liveStats, setLiveStats] = useState<any>(null);
  const [analysisTime, setAnalysisTime] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [performanceMode, setPerformanceMode] = useState<'fast' | 'balanced' | 'quality'>('fast');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // WebSocket event handlers
  const handleAnalysisStarted = useCallback((data: any) => {
    setIsAnalyzing(true);
    setShowInstructions(false);
    startTimeRef.current = Date.now();
    
    // Start timer
    intervalRef.current = setInterval(() => {
      setAnalysisTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  }, []);

  const handleFrameUpdate = useCallback((data: LiveFrameData) => {
    setCurrentFrame(`data:image/jpeg;base64,${data.frame}`);
    setLiveStats(data.stats);
    setFrameCount(data.stats.frame_count);
  }, []);

  const handleAnalysisComplete = useCallback((data: any) => {
    setIsAnalyzing(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Get final results
    soccerAnalyticsApi.getResults()
      .then(results => onAnalysisComplete(results))
      .catch(err => onError(err.message));
  }, [onAnalysisComplete, onError]);

  const handleAnalysisStopped = useCallback((data: any) => {
    setIsAnalyzing(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Get final results
    soccerAnalyticsApi.getResults()
      .then(results => onAnalysisComplete(results))
      .catch(err => onError(err.message));
  }, [onAnalysisComplete, onError]);

  const handleError = useCallback((data: any) => {
    setIsAnalyzing(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    onError(data.message);
  }, [onError]);

  // Setup polling for live frames and status updates
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    
    if (isAnalyzing) {
      pollInterval = setInterval(async () => {
        try {
          // Try to get current frame first
          try {
            const frameData = await soccerAnalyticsApi.getCurrentFrame();
            setCurrentFrame(`data:image/jpeg;base64,${frameData.frame}`);
            setLiveStats(frameData.stats);
            setFrameCount(frameData.stats.frame_count || frameCount + 1);
          } catch (frameError) {
            // If no frame available, just continue polling
            console.log('Waiting for frames...');
          }
          
          // Only check status but don't auto-stop - let user press ESC
          const status = await soccerAnalyticsApi.getStatus();
          
          // Only stop if explicitly stopped by user (ESC) and results are available
          if (!status.is_processing && status.has_results && !isAnalyzing) {
            const results = await soccerAnalyticsApi.getResults();
            handleAnalysisComplete({ results });
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      }, 500); // Poll every 500ms for more responsive live feed
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAnalyzing, handleAnalysisComplete, frameCount]);

  // Keyboard event handler for ESC key
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isAnalyzing) {
        handleStopAnalysis();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isAnalyzing]);

  const handleStartAnalysis = async () => {
    try {
      const response = await soccerAnalyticsApi.startAnalysis(performanceMode);
      console.log('Analysis started:', response);
      
      // Start the analysis UI
      setIsAnalyzing(true);
      setShowInstructions(false);
      startTimeRef.current = Date.now();
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setAnalysisTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
      
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to start analysis');
    }
  };

  const handleStopAnalysis = async () => {
    try {
      await soccerAnalyticsApi.stopAnalysis();
      
      // Stop the UI
      setIsAnalyzing(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Get results after a short delay
      setTimeout(async () => {
        try {
          const results = await soccerAnalyticsApi.getResults();
          onAnalysisComplete(results);
        } catch (error) {
          onError('Failed to get analysis results');
        }
      }, 1000);
      
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to stop analysis');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Instructions Card */}
      {showInstructions && (
        <Card className="glow-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Live Soccer Analysis
            </CardTitle>
            <CardDescription>
              Real-time AI analysis of your football match footage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">How it works:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Click "Start Live Analysis" to begin processing
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    Watch real-time analysis with live statistics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-ai-purple" />
                    Press ESC or click Stop to end and view results
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Analysis includes:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Player tracking and team classification
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Ball possession and pass detection
                  </li>
                  <li className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Performance metrics and events
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Control Panel */}
      <Card className="glow-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isAnalyzing ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="font-medium">
                  {isAnalyzing ? 'Live Analysis Running' : 'Ready to Analyze'}
                </span>
              </div>
              
              {isAnalyzing && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Timer className="w-4 h-4" />
                    {formatTime(analysisTime)}
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    {frameCount} frames
                  </div>
                </div>
              )}
            </div>

            {/* Performance Mode Selector */}
            {!isAnalyzing && (
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Performance Mode:</label>
                <div className="flex gap-2">
                  <Button
                    variant={performanceMode === 'fast' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPerformanceMode('fast')}
                    className="flex-1"
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Fast
                  </Button>
                  <Button
                    variant={performanceMode === 'balanced' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPerformanceMode('balanced')}
                    className="flex-1"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Balanced
                  </Button>
                  <Button
                    variant={performanceMode === 'quality' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPerformanceMode('quality')}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Quality
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {performanceMode === 'fast' && 'Lowest quality, fastest performance - recommended for large videos'}
                  {performanceMode === 'balanced' && 'Good balance of quality and performance'}
                  {performanceMode === 'quality' && 'Best quality, may be slower with large videos'}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2">
              {!isAnalyzing ? (
                <Button 
                  variant="hero" 
                  onClick={handleStartAnalysis}
                  className="group"
                  disabled={!uploadedFile}
                >
                  <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Start Live Analysis
                </Button>
              ) : (
                <Button 
                  variant="destructive" 
                  onClick={handleStopAnalysis}
                  className="group"
                >
                  <Square className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Stop Analysis (ESC)
                </Button>
              )}
            </div>
          </div>

          {isAnalyzing && (
            <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 animate-pulse">
              <div className="text-center">
                <div className="text-lg font-bold text-red-400 mb-1">
                  🔥 LIVE ANALYSIS RUNNING 🔥
                </div>
                <p className="text-sm">
                  <strong className="text-white">Press ESC</strong> to stop analysis and view detailed results
                </p>
                <div className="text-xs text-muted-foreground mt-1">
                  Video will loop continuously until you stop it
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

        {/* Live Analysis Display */}
        {isAnalyzing && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Live Video Feed */}
            <div className="lg:col-span-2">
              <Card className="glow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary animate-pulse" />
                    {currentFrame ? 'Live Soccer Analysis Feed' : 'Initializing Analysis...'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentFrame ? (
                    // Live video feed
                    <div className="relative rounded-lg overflow-hidden bg-black">
                      <img 
                        src={currentFrame} 
                        alt="Live Soccer Analysis" 
                        className="w-full h-auto"
                        style={{ maxHeight: '500px', objectFit: 'contain' }}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-red-600/80 text-white animate-pulse">
                          ● LIVE
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-black/50 text-white">
                          Frame {frameCount}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                          Same as: python scripts/run_realtime.py
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <div className="text-white text-sm bg-red-600/80 px-3 py-2 rounded animate-pulse">
                          Press <kbd className="bg-white text-black px-1 rounded">ESC</kbd> to stop
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Loading state
                    <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 p-12 text-center">
                      <div className="space-y-6">
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-primary flex items-center justify-center animate-pulse">
                          <Activity className="w-12 h-12 text-white" />
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Starting Analysis...</h3>
                          <p className="text-muted-foreground mb-4">
                            Loading video and initializing AI models
                          </p>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              <span>Loading YOLO Model</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                              <span>Initializing Tracker</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                              <span>Setting up Pipeline</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Live Statistics */}
            <div className="space-y-4">
              <Card className="glow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Live Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Processing Time</span>
                      <span>{formatTime(analysisTime)}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Frames Processed</span>
                      <span>{frameCount}</span>
                    </div>
                  </div>

                  {liveStats && (
                    <>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Goals Detected</span>
                          <span>{liveStats.goals || 0}</span>
                        </div>
                      </div>

                      {/* Ball Possession */}
                      {liveStats.possession && Object.keys(liveStats.possession).length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Ball Possession</h4>
                          {Object.entries(liveStats.possession).map(([team, percentage]) => (
                            <div key={team} className="mb-2">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Team {team === '0' ? 'A' : 'B'}</span>
                                <span>{Math.round(percentage as number)}%</span>
                              </div>
                              <Progress value={percentage as number} />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Match Events */}
                      {liveStats.events && (
                        <div>
                          <h4 className="font-medium mb-2">Match Events</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Yellow Cards</span>
                              <span>{liveStats.events.yellow_cards || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Red Cards</span>
                              <span>{liveStats.events.red_cards || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Free Kicks</span>
                              <span>{liveStats.events.free_kicks || 0}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Status</span>
                      <Badge variant="default" className="animate-pulse">
                        {currentFrame ? 'Live Feed Active' : 'Initializing...'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

            <Card className="glow-card">
              <CardContent className="p-4 text-center">
                <Zap className="w-8 h-8 mx-auto mb-2 text-ai-purple" />
                <p className="text-sm text-muted-foreground">
                  AI is analyzing every frame for tactical insights
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Placeholder when not analyzing */}
      {!currentFrame && !showInstructions && (
        <Card className="glow-card">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-primary flex items-center justify-center">
              <Play className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready for Live Analysis</h3>
            <p className="text-muted-foreground mb-6">
              Click "Start Live Analysis" to begin real-time processing of your football match
            </p>
            {uploadedFile && (
              <p className="text-sm text-muted-foreground">
                Video ready: <span className="font-medium">{uploadedFile.name}</span>
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LiveAnalysis;
