import user from "../models/usuarios.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const register = async (req, res) => {
  console.log(req.body);

  const { email, password, username } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const nuevoUser = new user({ username, email, password: hashedPassword });
    const userGuardado = await nuevoUser.save();
    res.json({
      message: "Usuario creado",
      username: nuevoUser.username,
      email: nuevoUser.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userFound = await user.findOne({ username });

    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    res.json({ message: "Login exitoso", username: userFound.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
