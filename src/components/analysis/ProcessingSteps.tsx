import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Brain, MessageSquare, Target, Check, Loader2 } from 'lucide-react';

interface ProcessingStep {
  id: string;
  title: string;
  icon: any;
  description: string;
}

interface ProcessingStepsProps {
  currentStep: number;
  steps: ProcessingStep[];
  uploadedFile: File | null;
}

const ProcessingSteps = ({ currentStep, steps, uploadedFile }: ProcessingStepsProps) => {
  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'processing';
    return 'pending';
  };

  const getStepContent = (stepId: string) => {
    switch (stepId) {
      case 'video':
        return {
          details: [
            'Extracting frames and analyzing video quality',
            'Detecting player movements and ball tracking',
            'Identifying key events and tactical formations',
            'Generating highlight timestamps'
          ],
          progress: 'Analyzing 4.2GB match footage...'
        };
      case 'ml':
        return {
          details: [
            'Calculating player performance metrics',
            'Evaluating team tactical efficiency',
            'Comparing against historical data',
            'Generating performance heatmaps'
          ],
          progress: 'Running ML models on player data...'
        };
      case 'sentiment':
        return {
          details: [
            'Collecting fan comments and social media posts',
            'Analyzing emotional sentiment patterns',
            'Identifying key opinion trends',
            'Correlating sentiment with match events'
          ],
          progress: 'Processing 15,000+ fan reactions...'
        };
      case 'recommendations':
        return {
          details: [
            'Synthesizing all analysis data',
            'Generating strategic recommendations',
            'Creating tactical formation suggestions',
            'Preparing actionable insights report'
          ],
          progress: 'AI generating strategic insights...'
        };
      default:
        return { details: [], progress: '' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* File Info */}
      {uploadedFile && (
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Video className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Processing: {uploadedFile.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB • Estimated completion: 3-5 minutes
                </p>
              </div>
              <Badge variant="secondary" className="pulse-glow">
                Processing
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Steps */}
      <div className="space-y-4">
        {steps.slice(1).map((step, index) => {
          const actualIndex = index + 1;
          const status = getStepStatus(actualIndex);
          const content = getStepContent(step.id);
          const IconComponent = step.icon;

          return (
            <Card 
              key={step.id} 
              className={`glow-card transition-all duration-500 ${
                status === 'processing' ? 'border-primary shadow-glow scale-105' :
                status === 'completed' ? 'border-success' :
                'border-card-border'
              }`}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg flex items-center justify-center ${
                    status === 'completed' ? 'bg-success text-white' :
                    status === 'processing' ? 'bg-primary text-white' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {status === 'completed' ? (
                      <Check className="w-6 h-6" />
                    ) : status === 'processing' ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <IconComponent className="w-6 h-6" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {step.title}
                      <Badge variant={
                        status === 'completed' ? 'default' :
                        status === 'processing' ? 'secondary' :
                        'outline'
                      }>
                        {status === 'completed' ? 'Complete' :
                         status === 'processing' ? 'Processing' :
                         'Pending'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              {status === 'processing' && (
                <CardContent className="pt-0 animate-fade-in-up">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-surface/50 border border-card-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-sm font-medium">{content.progress}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Current Tasks:</h5>
                      <ul className="space-y-1">
                        {content.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className={`w-2 h-2 rounded-full ${
                              idx === 0 ? 'bg-primary animate-pulse' :
                              idx === 1 ? 'bg-primary/50' :
                              'bg-muted'
                            }`} />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              )}

              {status === 'completed' && (
                <CardContent className="pt-0">
                  <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                    <div className="flex items-center gap-2 text-success">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Step completed successfully</span>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Fun Facts During Processing */}
      <Card className="glass-card">
        <CardContent className="p-6 text-center">
          <h4 className="font-semibold mb-2">Did you know?</h4>
          <p className="text-sm text-muted-foreground">
            Our AI analyzes over 1,000 data points per second of footage, including player positions, 
            ball trajectory, and tactical formations to provide you with comprehensive insights.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingSteps;