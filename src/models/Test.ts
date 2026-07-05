// import mongoose from 'mongoose';

// const QuestionSchema = new mongoose.Schema({
//   questionNumber: { type: Number, required: true }, // 1 to 180
//   subject: { type: String, enum: ['Physics', 'Chemistry', 'Botany', 'Zoology'], required: true },
//   chapter: { type: String, required: true }, // e.g., "Optics", "Genetics"
//   questionText: { type: String, required: true },
//   imageUrl: { type: String, default: null }, // For physics diagrams or biology figures
//   options: [
//     {
//       optionLetter: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
//       text: { type: String, required: true }
//     }
//   ],
//   correctOption: { type: String, enum: ['A', 'B', 'C', 'D'], required: true, select: false } // Hidden from students during the live test!
// });

// const NeetTestSchema = new mongoose.Schema({
//   testTitle: { type: String, required: true }, // e.g., "NEET Grand Mock Test - 01"
//   description: { type: String },
//   totalQuestions: { type: Number, default: 180 },
//   durationInMinutes: { type: Number, default: 180 },
//   questions: [QuestionSchema], // Array containing exactly 180 questions
//   pdfDownloadUrl: { type: String, default: null }, // Optional: S3 link for downloading test paper
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.models.NeetTest || mongoose.model('NeetTest', NeetTestSchema);

import mongoose, { Schema, Document, model, models } from 'mongoose';

// Single individual sub-question entity layout
interface IQuestion {
  imageUrl: string;
  options: string[];
  correctOptionIndex: number;
  subject: string;
  topic?: string;
}

// Complete Mock Test profile interface schema mapping
export interface ITest extends Document {
  title: string;
  duration: number; // Duration inside total minutes
  questions: IQuestion[];
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  imageUrl: { type: String, required: true},
  options: { type: [String], required: true, validate: [arrayLimit, 'Options count must be exactly 4'] },
  correctOptionIndex: { type: Number, required: true, min: 0, max: 3 },
  subject: { type: String, required: true, enum: ['Biology', 'Physics', 'Chemistry'] },
  topic: { type: String, default: '' }
});

function arrayLimit(val: string[]) {
  return val.length === 4;
}

const TestSchema = new Schema<ITest>({
  title: { type: String, required: true, trim: true },
  duration: { type: Number, required: true, default: 180 },
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now }
});

// Prevention from double compiling in server runtime execution states
export const Test = models.Test || model<ITest>('Test', TestSchema);