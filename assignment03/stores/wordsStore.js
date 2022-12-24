import create from "zustand";
import { devtools, persist } from "zustand/middleware";

const wordsStore = (set) => ({
  words: [],
  setWords: (newWords) => {
    set((state) => ({
      words: newWords
    }));
  },
  addWord: (word) => {
    set((state) => ({
      words: [...state.words, word]
    }));
  },
  deleteWord: (word) => {
    set((state) => ({
      words: state.words.filter((a) => a != word)
    }));
  },
});

const useWordsStore = create(
  devtools(
    persist(wordsStore, {
      name: "words",
    })
  )
);

export default useWordsStore;
