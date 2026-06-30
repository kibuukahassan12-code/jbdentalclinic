import React, { useEffect } from 'react';
import Stories from 'react-insta-stories';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const StoryViewerModal = ({
  isOpen,
  onClose,
  stories = [],
  storyIndex = 0,
  onPrevGroup,
  onNextGroup,
  hasPrevGroup = false,
  hasNextGroup = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrevGroup) onPrevGroup();
      if (e.key === 'ArrowRight' && hasNextGroup) onNextGroup();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onPrevGroup, onNextGroup, hasPrevGroup, hasNextGroup]);

  if (!isOpen || !stories || stories.length === 0) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      {/* Top Header Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-200 z-[60] outline-none ring-2 ring-transparent hover:ring-[#7FD856]"
        aria-label="Close stories"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Buttons for Desktop */}
      {hasPrevGroup && (
        <button
          onClick={onPrevGroup}
          className="hidden md:flex absolute left-8 lg:left-16 text-white/60 hover:text-[#7FD856] bg-white/5 hover:bg-white/10 p-4 rounded-full transition-all duration-200 z-[60]"
          aria-label="Previous story category"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {hasNextGroup && (
        <button
          onClick={onNextGroup}
          className="hidden md:flex absolute right-8 lg:right-16 text-white/60 hover:text-[#7FD856] bg-white/5 hover:bg-white/10 p-4 rounded-full transition-all duration-200 z-[60]"
          aria-label="Next story category"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Story Player Container */}
      <div 
        className="relative w-full max-w-[420px] aspect-[9/16] h-[100dvh] md:h-[80vh] md:max-h-[740px] bg-black md:rounded-2xl md:overflow-hidden md:shadow-2xl md:border md:border-white/10 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Stories
          stories={stories}
          defaultInterval={4500}
          width="100%"
          height="100%"
          currentIndex={storyIndex}
          onAllStoriesEnd={onNextGroup || onClose}
          keyboardNavigation={true}
          storyContainerStyles={{
            borderRadius: 'inherit',
            overflow: 'hidden',
            backgroundColor: '#000000',
          }}
          progressContainerStyles={{
            paddingTop: '12px',
          }}
        />
      </div>
    </div>
  );
};

export default StoryViewerModal;
