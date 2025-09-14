import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, Video, Brain, MessageSquare, Target, Check, Download, Share, Play, BarChart3, Activity } from 'lucide-react';
import VideoUpload from '@/components/analysis/VideoUpload';
import ProcessingSteps from '@/components/analysis/ProcessingSteps';
import AnalysisResults from '@/components/analysis/AnalysisResults';
import LiveAnalysis from '@/components/analysis/LiveAnalysis';
import TestConnection from '@/components/analysis/TestConnection';
import { soccerAnalyticsApi, SoccerAnalyticsData, MatchPrediction } from '@/services/soccerAnalyticsApi';
import { useToast } from '@/hooks/use-toast';

export interface AnalysisData {
  videoMetrics: {
    duration: string;
    events: Array<{ type: string; time: string; description: string }>;
    highlights: string[];
  };
  mlScores: {
    teamA: { name: string; score: number; metrics: any };
    teamB: { name: string; score: number; metrics: any };
    playerRatings: Array<{ name: string; position: string; rating: number }>;
  };
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
    keywords: string[];
  };
  recommendations: {
    formation: string;
    tactics: string[];
    substitutions: string[];
    keyInsights: string[];
  };
  soccerAnalytics?: {
    total_distance_covered: number;
    average_speeds: Record<string, number>;
    max_speeds: Record<string, number>;
    ball_touches: Record<string, number>;
    pass_network: Record<string, number>;
    team_classification: Record<string, number>;
    analysis_duration: number;
    goals_detected: number;
  };
  matchPrediction?: MatchPrediction;
}

const AnalyzePage = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [progress, setProgress] = useState(0);
  const [useRealAnalysis, setUseRealAnalysis] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const steps = [
    { id: 'upload', title: 'Upload Video', icon: Upload, description: 'Upload your match footage' },
    { id: 'live', title: 'Live Analysis', icon: Activity, description: 'Real-time soccer analytics' },
    { id: 'video', title: 'Video Processing', icon: Video, description: 'AI analyzes video content' },
    { id: 'ml', title: 'ML Scoring', icon: Brain, description: 'Machine learning evaluation' },
    { id: 'sentiment', title: 'Sentiment Analysis', icon: MessageSquare, description: 'Fan opinion analysis' },
    { id: 'recommendations', title: 'AI Recommendations', icon: Target, description: 'Strategic insights generated' }
  ];

  const handleFileUpload = useCallback(async (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    
    try {
      // Upload file to backend
      await soccerAnalyticsApi.uploadVideo(file);
      
      toast({
        title: "Video uploaded successfully",
        description: "Choose your analysis type to continue.",
      });
      
      setCurrentStep(1);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload video",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [toast]);

  const simulateAnalysis = async () => {
    setIsProcessing(true);
    setProgress(0);

    // Simulate processing steps
    for (let step = 1; step < steps.length; step++) {
      setCurrentStep(step);
      
      // Simulate progress for current step
      for (let i = 0; i <= 100; i += 10) {
        setProgress((step - 1) * 20 + i * 0.2);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Mock analysis results
    const mockResults: AnalysisData = {
      videoMetrics: {
        duration: '90:00',
        events: [
          { type: 'Goal', time: '23:45', description: 'Team A scores from penalty' },
          { type: 'Yellow Card', time: '34:12', description: 'Player #7 cautioned for tackle' },
          { type: 'Goal', time: '67:30', description: 'Team B equalizes with header' },
          { type: 'Substitution', time: '75:00', description: 'Team A brings on fresh striker' }
        ],
        highlights: ['Goal at 23:45', 'Critical save at 45:20', 'Goal at 67:30']
      },
      mlScores: {
        teamA: { 
          name: 'Team Alpha', 
          score: 7.8, 
          metrics: { possession: 58, passes: 432, accuracy: 84 }
        },
        teamB: { 
          name: 'Team Beta', 
          score: 7.2, 
          metrics: { possession: 42, passes: 376, accuracy: 79 }
        },
        playerRatings: [
          { name: 'Player #10', position: 'Midfielder', rating: 8.5 },
          { name: 'Player #9', position: 'Forward', rating: 8.2 },
          { name: 'Player #4', position: 'Defender', rating: 7.8 }
        ]
      },
      sentiment: {
        positive: 45,
        negative: 25,
        neutral: 30,
        keywords: ['exciting', 'disappointed', 'great save', 'poor defense']
      },
      recommendations: {
        formation: '4-3-3',
        tactics: [
          'Increase wing play to exploit weak flanks',
          'Press higher up the pitch in second half',
          'Use quick counter-attacks after defensive actions'
        ],
        substitutions: [
          'Bring on fresh legs in midfield around 60th minute',
          'Consider defensive midfielder if leading by 70th minute'
        ],
        keyInsights: [
          'Team shows vulnerability to fast counter-attacks',
          'Left flank offers most attacking opportunities',
          'Set pieces are a major strength to leverage'
        ]
      },
      soccerAnalytics: {
        total_distance_covered: 15000,
        average_speeds: { '1': 2.5, '2': 3.1, '3': 2.8, '4': 2.9 },
        max_speeds: { '1': 8.5, '2': 9.2, '3': 7.8, '4': 8.9 },
        ball_touches: { '1': 45, '2': 23, '3': 38, '4': 19 },
        pass_network: { '1': 25, '2': 15, '3': 20, '4': 10 },
        team_classification: { '1': 1, '2': 0, '3': 1, '4': 0 },
        analysis_duration: 120,
        goals_detected: 2
      },
      matchPrediction: {
        home_win_probability: 0.65,
        draw_probability: 0.20,
        away_win_probability: 0.15,
        predicted_outcome: 'Home Win',
        confidence: 0.65,
        model_used: 'mock_neural_network',
        features_used: 16
      }
    };

    setAnalysisData(mockResults);
    setIsProcessing(false);
    setProgress(100);
  };

  // Real analysis handlers
  const handleRealAnalysisComplete = useCallback((results: SoccerAnalyticsData) => {
    console.log('Analysis results received:', results);
    console.log('Match prediction in results:', results.matchPrediction);
    
    setAnalysisData(results as AnalysisData);
    setIsProcessing(false);
    setProgress(100);
    setCurrentStep(steps.length - 1);
    
    toast({
      title: "Analysis complete!",
      description: `Your soccer match analysis is ready. ${results.matchPrediction ? 'ML predictions included!' : 'No ML predictions available.'}`,
    });
  }, [toast, steps.length]);

  const handleAnalysisError = useCallback((error: string) => {
    toast({
      title: "Analysis failed",
      description: error,
      variant: "destructive",
    });
    setIsProcessing(false);
  }, [toast]);

  const startRealAnalysis = () => {
    setUseRealAnalysis(true);
    setCurrentStep(1); // Go to live analysis step
  };

  const startMockAnalysis = () => {
    setUseRealAnalysis(false);
    setCurrentStep(2); // Skip live analysis, go to traditional processing
    simulateAnalysis();
  };

  const resetAnalysis = () => {
    setUploadedFile(null);
    setCurrentStep(0);
    setIsProcessing(false);
    setAnalysisData(null);
    setProgress(0);
    setUseRealAnalysis(false);
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <BarChart3 className="w-4 h-4 text-ai-purple" />
            <span className="text-sm font-medium">Match Analysis Pipeline</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">
            AI-Powered Football
            <br />
            <span className="gradient-text">Match Analysis</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload your match footage and let our advanced AI analyze every aspect of the game to provide strategic insights.
          </p>
        </div>

        {/* Progress Overview */}
        {(currentStep > 0 || isProcessing) && (
          <Card className="glow-card mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-5 h-5 text-success" />
                    )}
                    Analysis Progress
                  </CardTitle>
                  <CardDescription>
                    {isProcessing ? 'Processing your match footage...' : 'Analysis completed successfully'}
                  </CardDescription>
                </div>
                <Badge variant={isProcessing ? "secondary" : "default"}>
                  {Math.round(progress)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {steps.map((step, index) => (
                  <div key={step.id} className={`text-center ${index <= currentStep ? 'opacity-100' : 'opacity-50'}`}>
                    <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      index < currentStep ? 'bg-success text-white' :
                      index === currentStep ? 'bg-primary text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index < currentStep ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-xs font-medium">{step.title}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connection Test (temporary) */}
        {currentStep === 0 && !analysisData && (
          <div className="space-y-8">
            <TestConnection />
            <VideoUpload onFileUpload={handleFileUpload} />
          </div>
        )}

        {/* Analysis Type Selection */}
        {currentStep === 1 && uploadedFile && !isProcessing && !useRealAnalysis && !analysisData && (
          <Card className="glow-card max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Choose Analysis Type</CardTitle>
              <CardDescription>
                Select how you want to analyze your football match footage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Real-time Analysis */}
                <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer group" onClick={startRealAnalysis}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Activity className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Live Soccer Analytics</h3>
                    <p className="text-muted-foreground mb-4">
                      Real-time analysis with player tracking, possession, and tactical insights. 
                      Press ESC to stop and view results.
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                      <li>• Player detection and tracking</li>
                      <li>• Ball possession analysis</li>
                      <li>• Performance metrics</li>
                      <li>• Event detection</li>
                    </ul>
                    <Button variant="hero" className="w-full">
                      Start Live Analysis
                    </Button>
                  </CardContent>
                </Card>

                {/* Traditional Analysis */}
                <Card className="border-secondary/20 hover:border-secondary/40 transition-colors cursor-pointer group" onClick={startMockAnalysis}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Traditional Analysis</h3>
                    <p className="text-muted-foreground mb-4">
                      Comprehensive analysis including ML scoring, sentiment analysis, 
                      and strategic recommendations.
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                      <li>• ML-based team scoring</li>
                      <li>• Fan sentiment analysis</li>
                      <li>• Strategic recommendations</li>
                      <li>• Detailed match insights</li>
                    </ul>
                    <Button variant="pitch" className="w-full">
                      Start Traditional Analysis
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Live Analysis */}
        {currentStep === 1 && useRealAnalysis && !analysisData && (
          <LiveAnalysis 
            uploadedFile={uploadedFile}
            onAnalysisComplete={handleRealAnalysisComplete}
            onError={handleAnalysisError}
          />
        )}

        {/* Traditional Processing Steps */}
        {currentStep > 1 && isProcessing && !useRealAnalysis && (
          <ProcessingSteps 
            currentStep={currentStep} 
            steps={steps} 
            uploadedFile={uploadedFile}
          />
        )}

        {/* Results */}
        {analysisData && !isProcessing && (
          <AnalysisResults 
            data={analysisData} 
            onReset={resetAnalysis}
            uploadedFile={uploadedFile}
          />
        )}
      </div>
    </div>
  );
};

export default AnalyzePage;