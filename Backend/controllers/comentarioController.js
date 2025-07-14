const Comentario = require('../models/Comentario');
const mongoose = require('mongoose');

exports.getComentarios = async (req, res) => {
  try {
    const comentarios = await Comentario.find().populate('usuarioId', 'username');
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getComentariosByPublicacion = async (req, res) => {
  try {
    const { idPublicacion } = req.params;
    const comentarios = await Comentario.find({ publicacionId: new mongoose.Types.ObjectId(idPublicacion) })
      .populate('usuarioId', 'username');
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createComentario = async (req, res) => {
  try {
    const nuevo = new Comentario(req.body);
    const guardado = await nuevo.save();
    const actualizado = await Comentario.findById(guardado.id).populate('usuarioId', 'username');
    res.status(201).json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateComentario = async (req, res) => {
  try {
    const comentario = await Comentario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!comentario) return res.status(404).json({ error: 'Comentario no encontrado' });
    res.json(comentario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteComentario = async (req, res) => {
  try {
    const resultado = await Comentario.findByIdAndDelete(req.params.id);
    if (!resultado) return res.status(404).json({ error: 'Comentario no encontrado' });
    res.json({ mensaje: 'Comentario eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
