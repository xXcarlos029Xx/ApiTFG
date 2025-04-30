import user from "../models/usuarios.js";
import estadistica from "../models/estadisticas.js";
import historial from "../models/historial.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const nuevoUser = new user({ username, email, password: hashedPassword });
    const savedUser = await nuevoUser.save();

    const nuevaEstadistica = new estadistica({ userId: savedUser._id });
    await nuevaEstadistica.save();

    res.json({ message: "Usuario creado", username, email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userFound = await user.findOne({ username });
    if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: userFound._id, username: userFound.username }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, username: userFound.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const actualizarEstadisticas = async (req, res) => {
  const { userId, resultado, duracion, rol } = req.body;

  try {
    const estad = await estadistica.findOne({ userId });
    if (!estad) return res.status(404).json({ message: "Estadísticas no encontradas" });

    estad.gamesPlayed += 1;
    if (resultado === "victoria") estad.wins += 1;
    else estad.losses += 1;
    estad.timePlayed += duracion;
    estad.roles[rol] += 1;

    await estad.save();

    const nuevaEntrada = new historial({
      userId,
      result: resultado,
      duration: duracion,
      role: rol
    });

    await nuevaEntrada.save();

    res.json({ message: "Estadísticas actualizadas" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStats = async (req, res) => {
  const { username } = req.params;

  try {
    const userFound = await user.findOne({ username });
    if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

    const stats = await estadistica.findOne({ userId: userFound._id });
    if (!stats) return res.status(404).json({ message: "Estadísticas no encontradas" });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistorial = async (req, res) => {
  const { username } = req.params;

  try {
    const userFound = await user.findOne({ username });
    if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

    const historialList = await historial.find({ userId: userFound._id }).sort({ date: -1 });
    res.json(historialList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};