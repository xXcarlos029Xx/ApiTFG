import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'usuario', 
        required: true 
    },
    gamesPlayed: { 
        type: Number, 
        default: 0 
    },
    wins: { 
        type: Number, 
        default: 0 
    },
    losses: { 
        type: Number, 
        default: 0 
    },
    timePlayed: { 
        type: Number, 
        default: 0 
    },
    roles: {
        chaser: { 
            type: Number, 
            default: 0 
        },
        escapist: { 
            type: Number, 
            default: 0 
        }
    }
});

export default mongoose.model("estadistica", statsSchema);