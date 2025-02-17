import React from 'react';
import { BookOpen, Trash2 } from 'lucide-react';
import type { SavedWord, Word } from '../types';

interface FavoritesListProps {
  favorites: SavedWord[];
  onRemove: (word: string) => void;
  onToggleFavorite: (word: Word) => void;
}

export function FavoritesList({ favorites, onRemove, onToggleFavorite }: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#FFE81F]/70">No holocrons stored yet. Click the bookmark icon to save words you want to preserve!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {favorites.map((word) => (
        <div
          key={word.word}
          className="bg-[#1a1a1a]/90 backdrop-blur-sm rounded-xl p-6 border border-[#FFE81F] shadow-[0_0_20px_rgba(255,232,31,0.2)] transition-all hover:shadow-[0_0_30px_rgba(255,232,31,0.3)]"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-[#FFE81F]/10 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-[#FFE81F]" />
              </div>
              <h3 className="text-xl font-bold text-[#FFE81F]">{word.word}</h3>
            </div>
            <button
              onClick={() => onRemove(word.word)}
              className="p-2 rounded-lg hover:bg-[#FF0000]/10 text-[#FF0000]/70 hover:text-[#FF0000] transition-colors"
              aria-label="Remove from holocron"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <span className="inline-block px-3 py-1 rounded-full bg-[#FFE81F]/10 text-[#FFE81F] text-sm font-medium mb-2">
            {word.partOfSpeech}
          </span>
          
          <p className="text-[#FFE81F]/90 text-sm mt-2">{word.definition}</p>
          
          {word.example && (
            <p className="text-[#FFE81F]/70 text-sm italic mt-2">"{word.example}"</p>
          )}
          
          <div className="mt-3 pt-3 border-t border-[#FFE81F]/20">
            <p className="text-xs text-[#FFE81F]/50">
              Archived on {new Date(word.savedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}