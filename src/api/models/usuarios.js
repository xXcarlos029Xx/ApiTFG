import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:{
        type:String, 
        required:true, 
        trim:true,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    }
})

export default mongoose.model("usuario", userSchema);