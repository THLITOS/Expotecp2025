// authController.js
const User = require('../models/Usuario');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { username, email, phone, password } = req.body;

  try {
    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Correo electrónico ya registrado' });
    }

    const newUser = new User({
      username,
      email,
      phone,
      passwordHash: password
    });

    await newUser.save();

    // Crear token JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, idUsuario: newUser._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Comparar contraseña ingresada con el hash guardado
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    // Crear token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, idUsuario: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };
