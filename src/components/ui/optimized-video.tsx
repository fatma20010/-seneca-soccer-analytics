import React, { forwardRef, VideoHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedVideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  className?: string;
  preload?: 'none' | 'metadata' | 'auto';
  loading?: 'lazy' | 'eager';
}

const OptimizedVideo = forwardRef<HTMLVideoElement, OptimizedVideoProps>(
  ({ 
    src, 
    poster, 
    className, 
    preload = 'metadata', 
    loading = 'lazy',
    ...props 
  }, ref) => {
    return (
      <video
        ref={ref}
        className={cn(
          "w-full h-auto rounded-lg shadow-lg",
          className
        )}
        preload={preload}
        poster={poster}
        playsInline
        {...props}
      >
        <source src={src} type="video/mp4" />
        <p className="text-muted-foreground">
          Your browser doesn't support video playback. 
          <a href={src} className="text-primary hover:underline ml-1">
            Download the video
          </a>
        </p>
      </video>
    );
  }
);

OptimizedVideo.displayName = 'OptimizedVideo';

export { OptimizedVideo };

