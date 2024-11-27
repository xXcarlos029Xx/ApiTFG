import mongoose from 'mongoose';

export const connectDB = async() => {
    try {
        await mongoose.connect("mongodb+srv://Carlos:ROOTroot@tfg.nqk85.mongodb.net/TFG");
        console.log("Base de Datos conectada");
    } catch (error) {
        console.log(error);
    }
}