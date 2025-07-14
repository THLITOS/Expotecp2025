const Reaccion = require('../models/Reaccion');
const mongoose = require('mongoose');

exports.getAllReacciones = async (req, res) => {
  try {
    const reacciones = await Reaccion.find().populate('usuarioId', 'username');
    res.json(reacciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReaccionByAccion = async (req, res) => {
  try {
    const { idPublicacion, idUsuario } = req.params;
    const query = {
      usuarioId: new mongoose.Types.ObjectId(idUsuario),
      publicacionId: new mongoose.Types.ObjectId(idPublicacion),
    };

    const reaccion = await Reaccion.find(query);
    res.status(200).json(reaccion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLikesCount = async (req, res) => {
  try {
    const { idPublicacion } = req.params;
    const result = await Reaccion.aggregate([
      { $match: { publicacionId: new mongoose.Types.ObjectId(idPublicacion), like: true } },
      { $group: { _id: "$publicacionId", totalLikes: { $sum: 1 } } }
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDislikesCount = async (req, res) => {
  try {
    const { idPublicacion } = req.params;
    const result = await Reaccion.aggregate([
      { $match: { publicacionId: new mongoose.Types.ObjectId(idPublicacion), dislike: true } },
      { $group: { _id: "$publicacionId", totalDislikes: { $sum: 1 } } }
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSavedCount = async (req, res) => {
  try {
    const { idPublicacion } = req.params;
    const result = await Reaccion.aggregate([
      { $match: { publicacionId: new mongoose.Types.ObjectId(idPublicacion), isSaved: true } },
      { $group: { _id: "$publicacionId", totalSaved: { $sum: 1 } } }
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createReaccion = async (req, res) => {
  try {
    const nueva = new Reaccion(req.body);
    const guardada = await nueva.save();
    res.status(201).json(guardada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReaccion = async (req, res) => {
  try {
    const reaccion = await Reaccion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reaccion) return res.status(404).json({ error: 'No encontrada' });
    res.json(reaccion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReaccion = async (req, res) => {
  try {
    const resultado = await Reaccion.findByIdAndDelete(req.params.id);
    if (!resultado) return res.status(404).json({ error: 'No encontrada' });
    res.json({ mensaje: 'Reacción eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
