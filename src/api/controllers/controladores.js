import user from "../models/usuarios.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const nuevoUser = new user({ username, email, password: hashedPassword });
    await nuevoUser.save();

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

    const token = jwt.sign({ id: userFound._id, username: userFound.username }, "clave_secreta", { expiresIn: "2h" });

    res.json({ message: "Login exitoso", token, username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const postMatchResult = async (req, res) => {
  const { result, duration, role } = req.body;
  const username = req.user.username;

  try {
    const userDoc = await user.findOne({ username });
    if (!userDoc) return res.status(404).json({ message: "Usuario no encontrado" });

    // Actualizar stats
    userDoc.stats.gamesPlayed++;
    userDoc.stats.timePlayed += duration;
    userDoc.stats.roles[role]++;

    if (result === "win") userDoc.stats.wins++;
    else userDoc.stats.losses++;

    userDoc.stats.history.push({ result, duration, role });
    await userDoc.save();

    res.json({ message: "Resultado guardado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStats = async (req, res) => {
  const username = req.params.username;
  try {
    const userDoc = await user.findOne({ username });
    if (!userDoc) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ username, stats: userDoc.stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await user.find().sort({ "stats.wins": -1 }).limit(10).select("username stats.wins stats.gamesPlayed");
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
