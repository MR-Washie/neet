export interface QuestionSchema {
  _id?: string;
  id?: number;
  questionText?: string;
  imageUrl: string;
  options: string[];
  correctOptionIndex: number;
  subject: string;
  topic?: string;
}

export interface TestSchema {
  _id: string;
  title: string;
  duration: number;
  questions: QuestionSchema[];
}

export interface AttemptHistoryRecord {
  _id: string;
  testId: string;
  testTitle: string;
  totalMarks: number;
  maxPossibleMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  attemptedCount: number;
  selectedAnswersSnapshot: Record<string, number>;
  attemptedAt: string;
}

export type QuestionStatus = 'NOT_VISITED' | 'NOT_ANSWERED' | 'ANSWERED' | 'MARKED_FOR_REVIEW' | 'ANSWERED_AND_MARKED';
