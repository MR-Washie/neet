import mongoose from 'mongoose';

const UserProgressSchema = new mongoose.Schema({
  // Links directly to the NextAuth 'users' collection item via its ObjectId
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'NeetTest', required: true },
  
  startedAt: { type: Date, default: Date.now },
  lastSyncedAt: { type: Date, default: Date.now },
  timeRemainingInSeconds: { type: Number, default: 10800 }, // Countdown initialized at 180 mins (10800 seconds)
  isSubmitted: { type: Boolean, default: false }, // Locks data after final submit
  
  // Storing student answers as a key-value Map makes atomic sync updates extremely lightweight
  // Key will be the string representation of the Question ID
  responses: {
    type: Map,
    of: new mongoose.Schema({
      selectedOption: { type: String, enum: ['A', 'B', 'C', 'D', null], default: null },
      status: { 
        type: String, 
        enum: ['ANSWERED', 'MARKED_FOR_REVIEW', 'SKIPPED', 'NOT_VISITED'], 
        default: 'NOT_VISITED' 
      },
      timeSpentInSeconds: { type: Number, default: 0 } // Track time optimization mechanics per question
    }, { _id: false })
  }
});

// Composite Indexing: A student can only have exactly ONE unique live progress session running per test
UserProgressSchema.index({ userId: 1, testId: 1 }, { unique: true });

export default mongoose.models.UserProgress || mongoose.model('UserProgress', UserProgressSchema);