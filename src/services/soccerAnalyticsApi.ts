/**
 * Soccer Analytics API Service
 * Handles communication with the Python backend for video analysis
 */

import { io, Socket } from 'socket.io-client';

const API_BASE_URL = 'http://localhost:5000/api';
const WEBSOCKET_URL = 'http://localhost:5000';

export interface SoccerAnalyticsData {
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
}

export interface AnalysisStatus {
  is_processing: boolean;
  has_video: boolean;
  has_results: boolean;
}

export interface LiveFrameData {
  frame: string; // base64 encoded image
  stats: {
    frame_count: number;
    processing_time: number;
    possession: Record<number, number>;
    pass_stats: any;
    events: any;
    goals: number;
    performance: any;
  };
}

class SoccerAnalyticsApiService {
  private socket: Socket | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  /**
   * Upload video file for analysis
   */
  async uploadVideo(file: File): Promise<{ message: string; filename: string; path: string }> {
    const formData = new FormData();
    formData.append('video', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  }

  /**
   * Start video analysis
   */
  async startAnalysis(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/start_analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start analysis');
    }

    return response.json();
  }

  /**
   * Stop video analysis (ESC equivalent)
   */
  async stopAnalysis(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/stop_analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to stop analysis');
    }

    return response.json();
  }

  /**
   * Get analysis results
   */
  async getResults(): Promise<SoccerAnalyticsData> {
    const response = await fetch(`${API_BASE_URL}/results`);

    if (!response.ok) {
      throw new Error('Failed to get results');
    }

    return response.json();
  }

  /**
   * Get current processing status
   */
  async getStatus(): Promise<AnalysisStatus> {
    const response = await fetch(`${API_BASE_URL}/status`);

    if (!response.ok) {
      throw new Error('Failed to get status');
    }

    return response.json();
  }

  /**
   * Get current frame during live analysis
   */
  async getCurrentFrame(): Promise<LiveFrameData> {
    const response = await fetch(`${API_BASE_URL}/current_frame`);

    if (!response.ok) {
      throw new Error('No frame data available');
    }

    return response.json();
  }

  /**
   * Connect to WebSocket for real-time updates (disabled for now)
   */
  connectWebSocket(): void {
    console.log('WebSocket disabled - using polling instead');
    return; // Disabled for now
    
    if (this.socket) {
      return; // Already connected
    }

    this.socket = io(WEBSOCKET_URL);

    this.socket.on('connected', (data) => {
      console.log('Connected to Soccer Analytics:', data.message);
      this.emit('connected', data);
    });

    this.socket.on('analysis_started', (data) => {
      console.log('Analysis started:', data.message);
      this.emit('analysis_started', data);
    });

    this.socket.on('frame_update', (data: LiveFrameData) => {
      this.emit('frame_update', data);
    });

    this.socket.on('analysis_complete', (data) => {
      console.log('Analysis complete:', data.message);
      this.emit('analysis_complete', data);
    });

    this.socket.on('analysis_stopped', (data) => {
      console.log('Analysis stopped:', data.message);
      this.emit('analysis_stopped', data);
    });

    this.socket.on('error', (data) => {
      console.error('Analysis error:', data.message);
      this.emit('error', data);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Soccer Analytics');
      this.emit('disconnected', {});
    });
  }

  /**
   * Disconnect WebSocket
   */
  disconnectWebSocket(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Send stop analysis via WebSocket
   */
  sendStopAnalysis(): void {
    if (this.socket) {
      this.socket.emit('stop_analysis');
    }
  }

  /**
   * Add event listener
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to listeners
   */
  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }
}

// Export singleton instance
export const soccerAnalyticsApi = new SoccerAnalyticsApiService();
