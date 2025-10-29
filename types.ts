
export enum GameMode {
  Practice = 'PRACTICE',
  Challenge = 'CHALLENGE',
}

export enum GameState {
  Home = 'HOME',
  Playing = 'PLAYING',
  Results = 'RESULTS',
}

export interface Question {
  id: number;
  incompleteSentence: string;
  infinitive: string;
  correctForm: string;
  tense: string;
  explanation: string;
}

export interface Answer {
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
}
