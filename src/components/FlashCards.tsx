import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Repeat, ChevronLeft, ChevronRight, RefreshCw, Bookmark, BookmarkCheck } from 'lucide-react';
import { words } from '../data/words';
import { useFavorites } from '../hooks/useFavorites';
import type { Word } from '../types';

function ShortcutHint({ shortcut }: { shortcut: string }) {
  return (
    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 transition-opacity group-hover:opacity-100">
      {shortcut}
    </span>
  );
}

const styles = `
  @keyframes cardEntrance {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes cardExit {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(-100%);
    }
  }

  @keyframes cardShake {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-1deg); }
    75% { transform: rotate(1deg); }
  }

  @keyframes glow {
    0% { box-shadow: 0 0 5px rgba(79, 70, 229, 0.2); }
    50% { box-shadow: 0 0 20px rgba(79, 70, 229, 0.4); }
    100% { box-shadow: 0 0 5px rgba(79, 70, 229, 0.2); }
  }

  .mode-indicator {
    animation: glow 2s infinite;
    background: rgba(79, 70, 229, 0.1);
    border: 1px solid rgba(79, 70, 229, 0.2);
  }

  .flashcard-wrapper {
    perspective: 1000px;
  }

  .flashcard-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
    animation: glow 3s infinite;
  }

  .flashcard-inner:hover {
    animation: cardShake 0.5s ease-in-out;
  }

  .flashcard-flipped {
    transform: rotateY(180deg);
  }

  .flashcard-front,
  .flashcard-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    transition: all 0.3s ease;
  }

  .flashcard-back {
    transform: rotateY(180deg);
  }

  .flashcard-content {
    transform: scale(1);
    transition: transform 0.3s ease;
  }

  .flashcard-inner:hover .flashcard-content {
    transform: scale(1.02);
  }

  .bookmark-btn {
    transform: scale(1);
    transition: transform 0.2s ease;
  }

  .bookmark-btn:hover {
    transform: scale(1.2);
  }

  .flashcard-enter {
    animation: cardEntrance 0.5s ease-out;
  }

  .flashcard-exit {
    animation: cardExit 0.5s ease-in;
  }
`;

export function FlashCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [shuffledWords, setShuffledWords] = useState<Word[]>(() => [...words].sort(() => Math.random() - 0.5));
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const currentWord = shuffledWords[currentIndex];

  // Fixed timing and added error prevention
  const handleNext = useCallback(() => {
    setIsFlipped(false);
    requestAnimationFrame(() => {
      setCurrentIndex((prev) => (prev + 1) % shuffledWords.length);
    });
  }, [shuffledWords.length]);

  const handlePrevious = useCallback(() => {
    setIsFlipped(false);
    requestAnimationFrame(() => {
      setCurrentIndex((prev) => (prev - 1 + shuffledWords.length) % shuffledWords.length);
    });
  }, [shuffledWords.length]);

  const handleShuffle = useCallback(() => {
    setIsFlipped(false);
    const newWords = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(newWords);
    setCurrentIndex(0);
  }, []);

  const handleReverse = useCallback(() => {
    setIsReversed(prev => !prev);
    setIsFlipped(false);
  }, []);

  const handleFlip = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(prev => !prev);
  }, []);

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(currentWord.word)) {
      removeFavorite(currentWord.word);
    } else {
      addFavorite(currentWord);
    }
  }, [currentWord, addFavorite, removeFavorite, isFavorite]);

  // Improved keyboard handling
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent default behavior for these keys
      if (['ArrowRight', 'ArrowLeft', 'r', 't', ' ', 'b'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key.toLowerCase() === 'r') {
        handleShuffle();
      } else if (e.key === ' ' || e.key.toLowerCase() === 'f') {
        setIsFlipped(prev => !prev);
      } else if (e.key.toLowerCase() === 't') {
        handleReverse();
      } else if (e.key.toLowerCase() === 'b') {
        if (isFavorite(currentWord.word)) {
          removeFavorite(currentWord.word);
        } else {
          addFavorite(currentWord);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleNext, handlePrevious, handleShuffle, handleReverse, currentWord, addFavorite, removeFavorite, isFavorite]);

  if (!currentWord) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <style>{styles}</style>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Flash Cards</h2>
        <p className="text-gray-600 mb-2">
          Click the card to reveal. {currentIndex + 1} of {shuffledWords.length}
        </p>
        <p className="text-sm text-gray-500 mb-2 mode-indicator inline-block px-3 py-1 rounded-full">
          Mode: {isReversed ? 'Definition → Word' : 'Word → Definition'}
        </p>
      </div>

      <div className="relative w-full aspect-[3/2] flashcard-wrapper mb-8">
        <div 
          className={`flashcard-inner ${isFlipped ? 'flashcard-flipped' : ''} ${
            currentIndex === 0 ? 'flashcard-enter' : ''
          }`}
          onClick={handleFlip}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              handleFlip(e as unknown as React.MouseEvent);
            }
          }}
        >
          <div className="flashcard-front bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center cursor-pointer relative">
            <button
              onClick={handleToggleFavorite}
              className="bookmark-btn absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={isFavorite(currentWord.word) ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite(currentWord.word) ? (
                <BookmarkCheck className="w-6 h-6 text-indigo-600" />
              ) : (
                <Bookmark className="w-6 h-6 text-gray-400 hover:text-indigo-600" />
              )}
            </button>
            <div className="flashcard-content">
              {isReversed ? (
                <>
                  <p className="text-xl text-gray-700 mb-6">{currentWord.definition}</p>
                  <p className="text-gray-500 italic">What's this word?</p>
                </>
              ) : (
                <>
                  <h3 className="text-4xl font-bold text-gray-800 mb-4">{currentWord.word}</h3>
                  <p className="text-gray-500 italic">{currentWord.partOfSpeech}</p>
                </>
              )}
            </div>
            <div className="absolute bottom-4 text-xs text-gray-400">
              Press Space to flip
            </div>
          </div>

          <div className="flashcard-back bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center cursor-pointer relative">
            <button
              onClick={handleToggleFavorite}
              className="bookmark-btn absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={isFavorite(currentWord.word) ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite(currentWord.word) ? (
                <BookmarkCheck className="w-6 h-6 text-indigo-600" />
              ) : (
                <Bookmark className="w-6 h-6 text-gray-400 hover:text-indigo-600" />
              )}
            </button>
            <div className="flashcard-content">
              {isReversed ? (
                <>
                  <h3 className="text-4xl font-bold text-gray-800 mb-4">{currentWord.word}</h3>
                  <p className="text-gray-600 italic">"{currentWord.example}"</p>
                </>
              ) : (
                <>
                  <p className="text-xl text-gray-700 mb-6">{currentWord.definition}</p>
                  <p className="text-gray-600 italic">"{currentWord.example}"</p>
                </>
              )}
            </div>
            <div className="absolute bottom-4 text-xs text-gray-400">
              Press Space to flip back
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <div className="inline-flex flex-wrap justify-center gap-4 bg-gray-50 px-6 py-3 rounded-xl">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white rounded shadow-sm text-xs font-medium text-gray-600">←</kbd>
            <span className="text-sm text-gray-500">Previous</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white rounded shadow-sm text-xs font-medium text-gray-600">→</kbd>
            <span className="text-sm text-gray-500">Next</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white rounded shadow-sm text-xs font-medium text-gray-600">Space</kbd>
            <span className="text-sm text-gray-500">Flip</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white rounded shadow-sm text-xs font-medium text-gray-600">R</kbd>
            <span className="text-sm text-gray-500">Shuffle</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white rounded shadow-sm text-xs font-medium text-gray-600">T</kbd>
            <span className="text-sm text-gray-500">Toggle Mode</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white rounded shadow-sm text-xs font-medium text-gray-600">B</kbd>
            <span className="text-sm text-gray-500">Bookmark</span>
          </div>
        </div>
      </div>
    </div>
  );
} 