import React from 'react';
import { BookOpen, Volume2, RefreshCw, Bookmark, Share2, BookmarkCheck } from 'lucide-react';
import type { Word } from '../types';

interface WordCardProps {
  word: Word;
  onNewWord: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

export function WordCard({ word, onNewWord, onToggleFavorite, isFavorite }: WordCardProps) {
  return (
    <div className="bg-[#1a1a1a]/90 backdrop-blur-sm rounded-2xl p-8 border border-[#FFE81F] shadow-[0_0_30px_rgba(255,232,31,0.2)] transition-all hover:shadow-[0_0_40px_rgba(255,232,31,0.3)]">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#FFE81F]/10 p-3 rounded-xl">
            <BookOpen className="w-6 h-6 text-[#FFE81F]" />
          </div>
          <h2 className="text-3xl font-bold text-[#FFE81F]">{word.word}</h2>
        </div>
        <button
          onClick={onToggleFavorite}
          className="p-2 rounded-lg hover:bg-[#FFE81F]/10 text-[#FFE81F] transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <BookmarkCheck className="w-6 h-6" />
          ) : (
            <Bookmark className="w-6 h-6" />
          )}
        </button>
      </div>
      
      <span className="inline-block px-3 py-1 rounded-full bg-[#FFE81F]/10 text-[#FFE81F] text-sm font-medium mb-4">
        {word.partOfSpeech}
      </span>
      
      <p className="text-[#FFE81F]/90 text-lg mb-4">{word.definition}</p>
      
      {word.example && (
        <p className="text-[#FFE81F]/70 text-md italic mb-6">"{word.example}"</p>
      )}
      
      <div className="flex justify-end">
        <button
          onClick={onNewWord}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFE81F]/10 text-[#FFE81F] border border-[#FFE81F] hover:shadow-[0_0_20px_rgba(255,232,31,0.3)] transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          New Word
        </button>
      </div>
    </div>
  );
}