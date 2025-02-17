export interface Word {
  word: string;
  definition: string;
  partOfSpeech: string;
  example?: string;
}

export interface SavedWord extends Word {
  savedAt: string;
}