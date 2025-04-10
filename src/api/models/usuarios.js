import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  stats: {
    gamesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    timePlayed: { type: Number, default: 0 }, // segundos
    roles: {
      chaser: { type: Number, default: 0 },
      escapist: { type: Number, default: 0 }
    },
    history: [
      {
        result: String,
        duration: Number,
        role: String,
        date: { type: Date, default: Date.now }
      }
    ]
  }
});

export default mongoose.model("usuario", userSchema);