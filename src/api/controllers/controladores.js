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
  const { email, password } = req.body;

  try {
    const usuario = await user.findOne({ email });
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecta) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token, username: usuario.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const actualizarEstadisticas = async (req, res) => {
  const userId = req.user.id;
  const { result, duration, role } = req.body;

  try {
    const estad = await estadistica.findOne({ userId });
    if (!estad) return res.status(404).json({ message: "Estadísticas no encontradas" });

    estad.gamesPlayed += 1;
    if (result === "victoria") estad.wins += 1;
    else estad.losses += 1;
    estad.timePlayed += duration;
    estad.roles[role] += 1;

    await estad.save();

    const nuevaEntrada = new historial({
      userId,
      result,
      duration,
      role
    });

    await nuevaEntrada.save();

    res.json({ message: "Estadísticas actualizadas" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const user = await user.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const stats = await estadistica.findOne({ userId: user._id });
    if (!stats) return res.status(404).json({ message: "Estadísticas no encontradas" });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistorial = async (req, res) => {
  try {
    const user = await user.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const history = await historial.find({ userId: user._id }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
