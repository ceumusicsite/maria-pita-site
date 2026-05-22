import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const VideoModal = ({ isOpen, onClose, videoUrl, videoTitle }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);
  if (!videoId) return null;

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
      id="video-modal-overlay"
    >
      <div 
        className="relative w-full max-w-5xl mx-4 aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl scale-100 transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
        id="video-modal-content"
      >
        {/* Header bar / Title */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center z-10">
          <h4 className="text-white font-heading font-medium text-lg truncate pr-8">
            {videoTitle}
          </h4>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Frame */}
        <iframe
          src={embedUrl}
          title={videoTitle || "YouTube video player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
          style={{ paddingTop: '56px' }}
        ></iframe>
      </div>
    </div>
  );
};
