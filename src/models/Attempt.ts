import mongoose from 'mongoose';

const AttemptSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // Next-Auth context string email/id
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  testTitle: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  maxPossibleMarks: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  wrongAnswers: { type: Number, required: true },
  attemptedCount: { type: Number, required: true },
  selectedAnswersSnapshot: { type: Object, required: true }, // Store user selected grid map
  attemptedAt: { type: Date, default: Date.now }
});

export const Attempt = mongoose.models.Attempt || mongoose.model('Attempt', AttemptSchema);