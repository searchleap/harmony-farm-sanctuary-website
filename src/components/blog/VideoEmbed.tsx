// VideoEmbed Component for Harmony Farm Sanctuary
// Responsive video embedding for YouTube, Vimeo, and direct video files

import React, { useState } from 'react';
import { Play, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface VideoEmbedProps {
  url: string;
  title?: string;
  thumbnail?: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  aspectRatio?: '16:9' | '4:3' | '1:1';
  className?: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({
  url,
  title = 'Video',
  thumbnail,
  autoPlay = false,
  muted = false,
  controls = true,
  aspectRatio = '16:9',
  className = ''
}) => {
  console.log('VideoEmbed rendering:', { url, title, aspectRatio });

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);

  // Detect video type and extract ID
  const getVideoDetails = (videoUrl: string) => {
    // YouTube detection
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = videoUrl.match(youtubeRegex);
    
    if (youtubeMatch) {
      return {
        type: 'youtube',
        id: youtubeMatch[1],
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}`
      };
    }

    // Vimeo detection
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
    const vimeoMatch = videoUrl.match(vimeoRegex);
    
    if (vimeoMatch) {
      return {
        type: 'vimeo',
        id: vimeoMatch[1],
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=${autoPlay ? 1 : 0}&muted=${muted ? 1 : 0}`
      };
    }

    // Direct video file
    return {
      type: 'direct',
      id: null,
      embedUrl: videoUrl
    };
  };

  const videoDetails = getVideoDetails(url);

  const aspectRatioClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square'
  };

  // Handle play button click for embedded videos
  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  // Generate thumbnail URL for YouTube videos
  const getYoutubeThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // Generate thumbnail URL for Vimeo videos (simplified)
  const getVimeoThumbnail = (videoId: string) => {
    return `https://vumbnail.com/${videoId}.jpg`;
  };

  const renderVideoPlayer = () => {
    if (videoDetails.type === 'direct') {
      return (
        <video
          src={url}
          title={title}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          className="w-full h-full object-cover"
          poster={thumbnail}
        />
      );
    }

    // For YouTube and Vimeo embeds
    if (!isPlaying && !autoPlay) {
      const thumbnailUrl = thumbnail || 
        (videoDetails.type === 'youtube' ? getYoutubeThumbnail(videoDetails.id!) :
         videoDetails.type === 'vimeo' ? getVimeoThumbnail(videoDetails.id!) : '');

      return (
        <div 
          className="relative w-full h-full cursor-pointer group"
          onClick={handlePlayClick}
        >
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
            </div>
          </div>
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
            {title}
          </div>
        </div>
      );
    }

    return (
      <iframe
        src={videoDetails.embedUrl}
        title={title}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  };

  return (
    <div className={`bg-black rounded-lg overflow-hidden shadow-lg ${className}`}>
      <div className={`relative ${aspectRatioClasses[aspectRatio]}`}>
        {renderVideoPlayer()}
      </div>
      
      {/* Video Controls for Direct Videos */}
      {videoDetails.type === 'direct' && isPlaying && (
        <div className="bg-gray-900 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:text-gray-300"
            >
              <Play className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-white hover:text-gray-300"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-white text-sm">{title}</span>
            <button className="text-white hover:text-gray-300">
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};