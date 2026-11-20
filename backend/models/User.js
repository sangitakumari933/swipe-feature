import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    photo: { type: String, required: true },
    bio: { type: String, required: true },
    city: { type: String, required: true },
    isDemoUser: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);