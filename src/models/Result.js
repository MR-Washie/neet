import mongoose from 'mongoose';

const NeetResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'NeetTest', required: true },
  submittedAt: { type: Date, default: Date.now },
  
  // Aggregate Performance Metrics (Max Score: 720)
  totalScore: { type: Number, required: true }, 
  totalCorrect: { type: Number, required: true },
  totalIncorrect: { type: Number, required: true },
  totalUnattempted: { type: Number, required: true },
  
  // Deep Subject Metrics for relative weak-spot data graphs
  subjectBreakdown: {
    physics: { score: Number, correct: Number, incorrect: Number },
    chemistry: { score: Number, correct: Number, incorrect: Number },
    biology: { score: Number, correct: Number, incorrect: Number } // Combined Botany + Zoology
  },
  
  // Snapshots of what they answered for analytics reviews
  finalResponses: { type: Map, of: String } // Schema format: { "questionObjectId": "B" }
});

export default mongoose.models.NeetResult || mongoose.model('NeetResult', NeetResultSchema);