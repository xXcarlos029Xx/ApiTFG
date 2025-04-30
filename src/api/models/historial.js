import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'usuario', 
        required: true 
    },
    result: String,
    duration: Number,
    role: String,
    date: { 
        type: Date, 
        default: Date.now 
    }
});

export default mongoose.model("historial", historySchema);