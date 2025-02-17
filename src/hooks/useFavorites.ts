import { useState, useEffect, useCallback } from 'react';
import type { Word, SavedWord } from '../types';

const STORAGE_KEY = 'favorite-words';

export function useFavorites() {
  const [favorites, setFavorites] = useState<SavedWord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((word: Word) => {
    setFavorites(prev => {
      if (prev.some(w => w.word === word.word)) return prev;
      return [...prev, { ...word, savedAt: new Date().toISOString() }];
    });
  }, []);

  const removeFavorite = useCallback((word: string) => {
    setFavorites(prev => prev.filter(w => w.word !== word));
  }, []);

  const isFavorite = useCallback((word: string) => {
    return favorites.some(w => w.word === word);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}