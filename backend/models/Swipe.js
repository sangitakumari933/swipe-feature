import mongoose from 'mongoose';

const swipeSchema = new mongoose.Schema(
  {
    swiperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    swipedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    action: {
      type: String,
      enum: ['like', 'pass'],
      required: true
    }
  },
  { timestamps: true }
);

// Prevent duplicate swipes between the same two users
swipeSchema.index({ swiperId: 1, swipedId: 1 }, { unique: true });

export default mongoose.model('Swipe', swipeSchema);