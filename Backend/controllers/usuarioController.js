const Usuario = require('../models/Usuario');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');

exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsuarioById = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const usuario = await Usuario.findById(idUsuario);
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ ACTUALIZAR PERFIL DE USUARIO
exports.updateUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const { username, email, phone, newPassword } = req.body;
    const avatar = req.file ? req.file.path : null;

    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar campos si están presentes
    if (username) usuario.username = username;
    if (email) usuario.email = email;
    if (phone) usuario.phone = phone;

    // Si viene imagen, guardar nueva y borrar la anterior si existe
    if (avatar) {
      if (usuario.avatar && fs.existsSync(usuario.avatar)) {
        fs.unlinkSync(usuario.avatar); // borrar anterior
      }
      usuario.avatar = avatar;
    }

    // Si viene nueva contraseña, encriptarla
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      usuario.passwordHash = hashedPassword;
    }

    await usuario.save();

    res.status(200).json({ message: 'Perfil actualizado correctamente', usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
