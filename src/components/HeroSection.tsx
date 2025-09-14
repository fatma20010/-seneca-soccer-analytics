import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Zap, Brain, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden particles">
      {/* Animated Background */}
      <div className="absolute inset-0 hero-gradient opacity-90" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-ai-purple/20 rounded-full blur-xl animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-sky-blue/20 rounded-full blur-lg animate-float animate-delay-200" />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-pitch-green/20 rounded-full blur-xl animate-float animate-delay-400" />
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-ai-cyan/20 rounded-full blur-md animate-float animate-delay-300" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-scale-in">
            <Zap className="w-4 h-4 text-ai-purple" />
            <span className="text-sm font-medium">Powered by Advanced AI</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-bold mb-6 animate-fade-in-up">
            <span className="block">MatchMaster</span>
            <span className="block gradient-text">AI</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-8 max-w-4xl mx-auto animate-fade-in-up animate-delay-200">
            Revolutionize Football Coaching with
            <br />
            <span className="text-secondary font-semibold">AI-Powered Match Analysis</span>
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in-up animate-delay-300">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 backdrop-blur-sm border border-card-border">
              <Play className="w-4 h-4 text-primary" />
              <span className="text-sm">Video Analysis</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 backdrop-blur-sm border border-card-border">
              <Brain className="w-4 h-4 text-ai-purple" />
              <span className="text-sm">ML Scoring</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 backdrop-blur-sm border border-card-border">
              <Target className="w-4 h-4 text-secondary" />
              <span className="text-sm">Strategic Insights</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-400">
            <Button asChild variant="hero" size="xl" className="group">
              <Link to="/analyze">
                Start Analysis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button variant="glass" size="xl" className="group">
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-fade-in-up animate-delay-500">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-orbitron font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-orbitron font-bold text-secondary mb-2">24/7</div>
              <div className="text-muted-foreground">AI Processing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-orbitron font-bold text-ai-purple mb-2">1000+</div>
              <div className="text-muted-foreground">Teams Analyzed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full p-1">
          <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;