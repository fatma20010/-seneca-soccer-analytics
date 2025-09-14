import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileVideo, 
  Download, 
  Zap, 
  Settings, 
  ExternalLink,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const VideoCompressionGuide = () => {
  const compressionTools = [
    {
      name: "HandBrake",
      type: "Desktop App",
      url: "https://handbrake.fr/",
      description: "Free, open-source video transcoder",
      recommended: true,
      settings: "H.264, CRF 23, 720p/1080p"
    },
    {
      name: "FFmpeg",
      type: "Command Line",
      url: "https://ffmpeg.org/",
      description: "Powerful multimedia framework",
      recommended: false,
      settings: "-crf 23 -preset fast -movflags +faststart"
    },
    {
      name: "Online Converter",
      type: "Web Tool",
      url: "https://www.freeconvert.com/video-compressor",
      description: "Browser-based compression",
      recommended: false,
      settings: "H.264, Medium quality, 720p"
    }
  ];

  const ffmpegCommand = `ffmpeg -i input.mp4 -vcodec h264 -acodec aac -crf 23 -preset fast -movflags +faststart output.mp4`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="glow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Video Optimization Guide
          </CardTitle>
          <CardDescription>
            Compress your videos for faster upload and smoother analysis
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Why Compress */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Why Compress Videos?</h4>
                <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
                  <li>• Faster upload times (10x smaller files)</li>
                  <li>• Smoother real-time analysis</li>
                  <li>• Better browser performance</li>
                  <li>• Reduced bandwidth usage</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Optimal Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Recommended Settings</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="glass-card">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">✅ Optimal</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Resolution: 720p (1280x720)</li>
                    <li>• Codec: H.264</li>
                    <li>• CRF: 23-25</li>
                    <li>• Format: MP4</li>
                    <li>• Target: 50-100MB for 10min video</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 text-red-600 dark:text-red-400">❌ Avoid</h4>
                  <ul className="text-sm space-y-1">
                    <li>• 4K resolution (too large)</li>
                    <li>• Uncompressed formats</li>
                    <li>• Very low quality (CRF > 30)</li>
                    <li>• Old codecs (MPEG-2, etc.)</li>
                    <li>• Files larger than 500MB</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Compression Tools</h3>
            <div className="space-y-3">
              {compressionTools.map((tool, index) => (
                <Card key={index} className={`glass-card ${tool.recommended ? 'ring-2 ring-primary/20' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{tool.name}</h4>
                          <Badge variant={tool.recommended ? "default" : "secondary"}>
                            {tool.type}
                          </Badge>
                          {tool.recommended && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{tool.description}</p>
                        <p className="text-xs font-mono bg-surface px-2 py-1 rounded">
                          {tool.settings}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FFmpeg Command */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick FFmpeg Command</h3>
            <div className="p-4 rounded-lg bg-surface border border-card-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Copy this command:</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(ffmpegCommand)}
                >
                  Copy
                </Button>
              </div>
              <code className="text-sm font-mono text-primary break-all">
                {ffmpegCommand}
              </code>
              <p className="text-xs text-muted-foreground mt-2">
                This creates an optimized MP4 with fast start for web streaming
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-1">Performance Tip</h4>
                <p className="text-sm text-yellow-600 dark:text-yellow-300">
                  Videos larger than 100MB may cause slow performance during live analysis. 
                  Consider compressing before upload for the best experience.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoCompressionGuide;

