import { useCallback, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Film, FileVideo, X } from 'lucide-react';

interface VideoUploadProps {
  onFileUpload: (file: File) => void;
}

const VideoUpload = ({ onFileUpload }: VideoUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
      }
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
      }
    }
  }, []);

  const handleSubmit = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="glow-card">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center gap-2 justify-center text-2xl">
            <Film className="w-6 h-6 text-primary" />
            Upload Match Video
          </CardTitle>
          <CardDescription className="text-base">
            Select or drag & drop your football match footage to begin AI analysis
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {!selectedFile ? (
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-primary bg-primary/5 scale-105' 
                  : 'border-card-border hover:border-primary/50 hover:bg-surface/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="video/*"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="space-y-6">
                <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center">
                  <Upload className="w-12 h-12 text-white" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Drop your video here</h3>
                  <p className="text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  
                  <Button variant="outline" size="lg">
                    Choose Video File
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Supported formats: MP4, MOV, AVI, MKV</p>
                  <p>Maximum file size: 2GB</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected File Display */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-surface border border-card-border">
                <div className="p-3 rounded-lg bg-primary/10">
                  <FileVideo className="w-8 h-8 text-primary" />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold">{selectedFile.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type}
                  </p>
                </div>
                
                <Button variant="ghost" size="icon" onClick={clearFile}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Video Preview */}
              <div className="rounded-lg overflow-hidden bg-surface">
                <video
                  src={URL.createObjectURL(selectedFile)}
                  controls
                  className="w-full h-64 object-cover"
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath fill='%23374151' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z'/%3E%3C/svg%3E"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={clearFile}>
                  Choose Different File
                </Button>
                <Button variant="hero" size="lg" onClick={handleSubmit} className="group">
                  Start AI Analysis
                  <Upload className="w-4 h-4 group-hover:translate-y-[-2px] transition-transform" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-secondary flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold mb-2">1. Upload Video</h4>
            <p className="text-sm text-muted-foreground">Upload your complete match footage or key highlights</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-ai flex items-center justify-center">
              <Film className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold mb-2">2. AI Processing</h4>
            <p className="text-sm text-muted-foreground">Our AI analyzes every frame for tactical insights</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-primary flex items-center justify-center">
              <FileVideo className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold mb-2">3. Get Insights</h4>
            <p className="text-sm text-muted-foreground">Receive detailed analysis and strategic recommendations</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoUpload;