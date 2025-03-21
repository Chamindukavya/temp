export type RankingQuestion = {
  question: string;
 
  answer: string;
  description?: string;
  choices: string[]; // Must have 5 or 8 choices
};

export type BestChoiceQuestion = {
  question: string;
  
  answer: string;
  description?: string;
  choices: string[]; // Must have 5 or 8 choices
};

export type SJTQuestion = {
  question: string;
  type: "ranking" | "best_choice";
  answer: string;
  description?: string;
  choices: string[]; // Must have 5 or 8 choices
};



export type SJTPaper = {
  _id: string;
  title: string;
  paperDescription: string;
  subject: string;
  questions: SJTQuestion[];
  timeLimit: number;
  createdAt?: Date;
};
