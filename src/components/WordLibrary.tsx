import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Filter, SortAsc } from 'lucide-react';
import type { Word } from '../types';

interface WordLibraryProps {
  words: Word[];
  favorites: Word[];
  onToggleFavorite: (word: Word) => void;
}

export function WordLibrary({ words, favorites, onToggleFavorite }: WordLibraryProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'word' | 'partOfSpeech'>('word');

  const filteredWords = useMemo(() => {
    return words
      .filter((word) => {
        const matchesSearch = word.word.toLowerCase().includes(search.toLowerCase()) ||
                            word.definition.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || word.partOfSpeech === filter;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (sortBy === 'word') {
          return a.word.localeCompare(b.word);
        }
        return a.partOfSpeech.localeCompare(b.partOfSpeech);
      });
  }, [words, search, filter, sortBy]);

  const uniquePartOfSpeech = useMemo(() => {
    return Array.from(new Set(words.map(word => word.partOfSpeech)));
  }, [words]);

  return (
    <div className="w-full">
      <div className="bg-[#1a1a1a]/90 backdrop-blur-sm rounded-xl p-6 border border-[#FFE81F] shadow-[0_0_30px_rgba(255,232,31,0.2)] mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FFE81F]/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Search words or definitions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#FFE81F]/5 border border-[#FFE81F]/30 text-[#FFE81F] placeholder-[#FFE81F]/50 focus:border-[#FFE81F] focus:ring focus:ring-[#FFE81F]/20 focus:ring-opacity-50"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FFE81F]/60 w-4 h-4" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-[#FFE81F]/5 border border-[#FFE81F]/30 text-[#FFE81F] focus:border-[#FFE81F] focus:ring focus:ring-[#FFE81F]/20 focus:ring-opacity-50 appearance-none"
              >
                <option value="all">All Types</option>
                {uniquePartOfSpeech.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FFE81F]/60 w-4 h-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'word' | 'partOfSpeech')}
                className="pl-10 pr-4 py-2 rounded-lg bg-[#FFE81F]/5 border border-[#FFE81F]/30 text-[#FFE81F] focus:border-[#FFE81F] focus:ring focus:ring-[#FFE81F]/20 focus:ring-opacity-50 appearance-none"
              >
                <option value="word">Sort by Word</option>
                <option value="partOfSpeech">Sort by Type</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWords.map((word) => (
          <div
            key={word.word}
            className="bg-[#1a1a1a]/90 backdrop-blur-sm rounded-xl p-6 border border-[#FFE81F] shadow-[0_0_20px_rgba(255,232,31,0.2)] transition-all hover:shadow-[0_0_30px_rgba(255,232,31,0.3)]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#FFE81F]/10 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-[#FFE81F]" />
              </div>
              <h3 className="text-xl font-bold text-[#FFE81F]">{word.word}</h3>
            </div>
            
            <span className="inline-block px-3 py-1 rounded-full bg-[#FFE81F]/10 text-[#FFE81F] text-sm font-medium mb-2">
              {word.partOfSpeech}
            </span>
            
            <p className="text-[#FFE81F]/90 text-sm mt-2">{word.definition}</p>
            
            {word.example && (
              <p className="text-[#FFE81F]/70 text-sm italic mt-2">"{word.example}"</p>
            )}
            
            <button
              onClick={() => onToggleFavorite(word)}
              className={`mt-4 w-full py-2 px-4 rounded-lg transition-all ${
                favorites.includes(word)
                  ? 'bg-[#FFE81F]/20 text-[#FFE81F] border border-[#FFE81F] hover:shadow-[0_0_20px_rgba(255,232,31,0.3)]'
                  : 'bg-[#FFE81F]/5 text-[#FFE81F]/70 border border-[#FFE81F]/30 hover:border-[#FFE81F] hover:text-[#FFE81F] hover:bg-[#FFE81F]/10'
              }`}
            >
              {favorites.includes(word) ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
        ))}
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#FFE81F]/50">No words found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}