import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Brain, MessageSquare, Target, ArrowRight, Play, BarChart3, Users } from 'lucide-react';

const features = [
  {
    icon: Video,
    title: "Video Processing",
    description: "Upload match footage and let AI break it down frame-by-frame for key events like goals, fouls, and tactical movements.",
    details: [
      "Automatic event detection",
      "Player tracking & movement analysis", 
      "Highlight generation",
      "Frame-by-frame breakdown"
    ],
    color: "text-primary",
    gradient: "from-pitch-green to-pitch-green-light"
  },
  {
    icon: Brain,
    title: "ML Scoring",
    description: "Machine learning algorithms score players and teams on metrics like passing accuracy, defensive strength, and offensive opportunities.",
    details: [
      "Player performance ratings",
      "Team tactical analysis",
      "Statistical insights",
      "Comparative benchmarking"
    ],
    color: "text-ai-purple",
    gradient: "from-ai-purple to-ai-purple-light"
  },
  {
    icon: MessageSquare,
    title: "Fan Sentiment Analysis",
    description: "Analyze real-time fan reactions from social media or comments to gauge team morale and public opinion.",
    details: [
      "Social media monitoring",
      "Sentiment classification",
      "Emotion tracking",
      "Fan engagement metrics"
    ],
    color: "text-secondary",
    gradient: "from-sky-blue to-sky-blue-light"
  },
  {
    icon: Target,
    title: "LLM Recommendations",
    description: "Our advanced LLM generates personalized game plans, suggesting formations, substitutions, and strategies to turn losses into wins.",
    details: [
      "Strategic game plans",
      "Formation recommendations",
      "Player substitution advice",
      "Tactical adjustments"
    ],
    color: "text-ai-cyan",
    gradient: "from-ai-cyan to-ai-cyan-light"
  }
];

const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <BarChart3 className="w-4 h-4 text-ai-purple" />
            <span className="text-sm font-medium">AI-Powered Features</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-orbitron font-bold mb-6">
            Complete Football
            <br />
            <span className="gradient-text">Analysis Suite</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From video processing to strategic recommendations, our AI platform provides everything coaches need to analyze matches and improve team performance.
          </p>
        </div>

        {/* Interactive Feature Grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
          {/* Feature Cards */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`glow-card cursor-pointer transition-all duration-300 ${
                  activeFeature === index 
                    ? 'border-primary shadow-glow scale-105' 
                    : 'hover:border-card-border'
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.gradient} bg-opacity-20`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                {activeFeature === index && (
                  <CardContent className="pt-0 animate-fade-in-up">
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className={`w-1.5 h-1.5 rounded-full ${feature.color.replace('text-', 'bg-')}`} />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Feature Visualization */}
          <div className="relative">
            <div className="glow-card p-8 text-center">
              <div className={`w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${features[activeFeature].gradient} flex items-center justify-center`}>
                {(() => {
                  const IconComponent = features[activeFeature].icon;
                  return <IconComponent className="w-12 h-12 text-white" />;
                })()}
              </div>
              
              <h3 className="text-2xl font-orbitron font-bold mb-4">
                {features[activeFeature].title}
              </h3>
              
              <p className="text-muted-foreground mb-6">
                {features[activeFeature].description}
              </p>

              <Button variant="pitch" className="group">
                <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                View Demo
              </Button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-ai-purple/10 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-secondary/10 rounded-full blur-lg" />
          </div>
        </div>

        {/* Process Timeline */}
        <div className="glow-card p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-orbitron font-bold mb-2">How It Works</h3>
            <p className="text-muted-foreground">Four simple steps to revolutionize your coaching strategy</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center relative">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                  {(() => {
                    const IconComponent = feature.icon;
                    return <IconComponent className="w-8 h-8 text-white" />;
                  })()}
                </div>
                
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description.split('.')[0]}.</p>
                
                {index < features.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-3 w-6 h-6 text-muted-foreground/50" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;