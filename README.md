# ⚽ Soccer Analytics Platform with AI-Powered Match Predictions

A comprehensive real-time soccer analytics platform that combines computer vision, machine learning, and modern web technologies to provide deep insights into football matches. Features live video analysis, player tracking, team performance metrics, and neural network-powered match outcome predictions.

![Soccer Analytics Platform](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Python](https://img.shields.io/badge/Python-3.8+-yellow)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![License](https://img.shields.io/badge/License-MIT-green)
# Dataset Link : https://www.kaggle.com/datasets/shreyamainkar/football-soccer-videos-dataset?select=114.mp4
## 🚀 Features

### 🎥 Real-Time Video Analysis
- **Player & Ball Detection**: YOLOv8-based object detection with ByteTrack tracking
- **Team Classification**: Automatic jersey color clustering for team assignment
- **Possession Tracking**: Real-time ball possession percentages
- **Pass Detection**: Intelligent pass event detection and network analysis
- **Performance Metrics**: Player speeds, distances, touches, and movement patterns

### 🤖 AI-Powered Match Predictions
- **Neural Network Integration**: Custom ML model for match outcome predictions
- **Feature Extraction**: 16 key metrics automatically extracted from video analysis
- **Probability Analysis**: Home Win, Draw, Away Win predictions with confidence scores
- **Real-time Updates**: Live predictions during match analysis

### 📊 Advanced Analytics Dashboard
- **Interactive Visualizations**: Charts, graphs, and heatmaps
- **Performance Scoring**: Team and player rating systems
- **Event Detection**: Goals, cards, free kicks, and penalties
- **Export Capabilities**: Analysis reports and data export

### 🎯 Modern Web Interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live analysis with WebSocket connections
- **Intuitive UI**: Clean, professional interface with shadcn/ui components
- **Multi-tab Results**: Organized analysis results across multiple views

## 🏗️ Architecture

### Frontend (React + TypeScript)
```
src/
├── components/
│   ├── analysis/          # Analysis-specific components
│   │   ├── AnalysisResults.tsx
│   │   ├── LiveAnalysis.tsx
│   │   ├── VideoUpload.tsx
│   │   └── ProcessingSteps.tsx
│   ├── ui/               # Reusable UI components
│   └── FeaturesSection.tsx
├── pages/
│   ├── Index.tsx         # Landing page
│   └── AnalyzePage.tsx   # Main analysis interface
├── services/
│   └── soccerAnalyticsApi.ts  # API integration
└── hooks/                # Custom React hooks
```

### Backend (Python + Flask)
```
soccer-analytics-pipeline/
├── src/soccer_analytics/
│   ├── modules/
│   │   ├── detection.py      # YOLO object detection
│   │   ├── tracking.py       # ByteTrack player tracking
│   │   ├── team_classifier.py # Team assignment
│   │   ├── possession.py     # Ball possession analysis
│   │   ├── passes.py         # Pass detection
│   │   ├── performance.py    # Player metrics
│   │   └── goal_detection.py # Goal event detection
│   ├── ml_predictor.py       # Neural network predictions
│   ├── pipeline.py           # Main processing pipeline
│   └── config.py             # Configuration management
├── simple_web_app.py         # Flask API server
└── scripts/
    ├── run_realtime.py       # Real-time analysis
    └── dataset_download.py   # Sample data download
```

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern UI framework
- **TypeScript 5.8.3** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **React Query** - Server state management
- **React Router** - Client-side routing

### Backend
- **Python 3.8+** - Core processing language
- **Flask** - Lightweight web framework
- **OpenCV** - Computer vision processing
- **YOLOv8** - Object detection model
- **ByteTrack** - Multi-object tracking
- **scikit-learn** - Machine learning utilities
- **NumPy/Pandas** - Data processing

### ML/AI
- **Neural Networks** - Match outcome prediction
- **Computer Vision** - Player and ball detection
- **Clustering Algorithms** - Team classification
- **Feature Engineering** - Performance metrics extraction

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/soccer-analytics-platform.git
cd soccer-analytics-platform
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Backend Setup
```bash
# Navigate to backend directory
cd soccer-analytics-pipeline

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download YOLO model
wget https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt
```

### 4. Start the Backend Server
```bash
# Start the Flask API server
python simple_web_app.py
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📖 Usage Guide

### Video Analysis
1. **Upload Video**: Drag and drop or select a soccer match video
2. **Configure Analysis**: Choose analysis type (Quick/Full)
3. **Start Processing**: Watch real-time analysis progress
4. **View Results**: Explore multiple analysis tabs

### Analysis Tabs
- **Overview**: Summary of key metrics and insights
- **Video Analysis**: Detailed performance statistics
- **ML Scoring**: Team and player performance ratings
- **Match Prediction**: AI-powered outcome predictions 🎯
- **Fan Sentiment**: Social media sentiment analysis
- **AI Insights**: Advanced tactical recommendations

### Real-time Analysis
```bash
# Run real-time analysis from webcam
python scripts/run_realtime.py --source 0

# Run analysis on video file
python scripts/run_realtime.py --source path/to/video.mp4
```

## 🧠 Machine Learning Integration

### Neural Network Predictions
The platform includes a sophisticated ML system for match outcome predictions:

```python
# Example prediction output
{
  "home_win_probability": 0.65,
  "draw_probability": 0.20,
  "away_win_probability": 0.15,
  "predicted_outcome": "Home Win",
  "confidence": 0.65,
  "model_used": "neural_network",
  "features_used": 16
}
```

### Feature Extraction
Automatically extracts 16 key features from video analysis:
- Possession percentages (home vs away)
- Pass counts and accuracy
- Player speeds (average and maximum)
- Distance covered
- Ball touches
- Goals detected

## ⚙️ Configuration

### Performance Optimization
Edit `soccer-analytics-pipeline/src/soccer_analytics/config.py`:

```python
# Key configuration options
frame_resize_width = 640        # Reduce for faster processing
detect_interval = 2             # Run YOLO every N frames
team_update_interval = 30       # Team clustering frequency
model.conf_threshold = 0.5      # Detection confidence threshold
```

### Environment Variables
```bash
# Optional environment variables
export FLASK_ENV=development
export MODEL_PATH=./neural_net_model.pkl
export YOLO_MODEL=yolov8n.pt
```

## 🧪 Testing

### Frontend Tests
```bash
npm run test
npm run lint
```

### Backend Tests
```bash
cd soccer-analytics-pipeline
python -m pytest tests/
python test_ml_integration.py
```

### API Testing
```bash
# Test API endpoints
python test_api.py
python test_full_integration.py
```

## 📊 Performance

### Optimization Tips
1. **Reduce Frame Size**: Set `frame_resize_width=640` for faster processing
2. **Frame Skipping**: Use `detect_interval=2` to run detection every 2nd frame
3. **Team Clustering**: Increase `team_update_interval` to reduce computation
4. **Model Selection**: Use `yolov8n.pt` for CPU-only environments

### System Requirements
- **Minimum**: 8GB RAM, 4-core CPU
- **Recommended**: 16GB RAM, 8-core CPU, GPU for real-time processing
- **Storage**: 2GB for models and dependencies

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Ensure code passes linting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **YOLOv8** by Ultralytics for object detection
- **ByteTrack** for multi-object tracking
- **OpenCV** for computer vision processing
- **React** and **Vite** for the modern frontend
- **Flask** for the lightweight backend

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/soccer-analytics-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/soccer-analytics-platform/discussions)
- **Documentation**: [Wiki](https://github.com/yourusername/soccer-analytics-platform/wiki)

## 🗺️ Roadmap

### Upcoming Features
- [ ] **GPU Acceleration**: CUDA support for real-time processing
- [ ] **Advanced Tactics**: Formation analysis and tactical insights
- [ ] **Player Recognition**: Individual player identification
- [ ] **Mobile App**: React Native mobile application
- [ ] **Cloud Deployment**: AWS/Azure deployment guides
- [ ] **API Documentation**: OpenAPI/Swagger documentation
- [ ] **Multi-language Support**: Internationalization
- [ ] **Advanced Analytics**: Heat maps and movement patterns

### Version History
- **v1.0.0** - Initial release with basic video analysis
- **v1.1.0** - Added neural network predictions
- **v1.2.0** - Enhanced UI and real-time processing
- **v2.0.0** - Complete rewrite with modern architecture

---

<div align="center">

**Built with ❤️ for the beautiful game**

[⭐ Star this repo](https://github.com/yourusername/soccer-analytics-platform) | [🐛 Report Bug](https://github.com/yourusername/soccer-analytics-platform/issues) | [💡 Request Feature](https://github.com/yourusername/soccer-analytics-platform/issues)

</div>
