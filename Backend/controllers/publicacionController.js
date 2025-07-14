const Publicaciones = require('../models/Publicaciones');
const mongoose = require('mongoose');

exports.crearPublicacion = async (req, res) => {
  try {
    const nuevaPublicacion = new Publicaciones({
      usuarioId: req.body.usuarioId,
      titulo: req.body.titulo,
      contenido: req.body.contenido,
      tipoContenido: req.body.tipoContenido,
      archivoUrl: req.body.archivoUrl || '',
      file: req.file?.buffer || null,
      mimeType: req.file?.mimetype || null,
      fechaPublicacion: new Date(),
      comunidad: req.body.comunidad
    });
    const guardada = await nuevaPublicacion.save();
    const actualizada = await Publicaciones.findById(guardada.id)
      .select('-file')
      .populate('usuarioId', 'username');
    res.status(201).json(actualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPublicaciones = async (req, res) => {
  try {
    const publicaciones = await Publicaciones.find()
      .select('-file')
      .populate('usuarioId', 'username')
      .sort({ fechaPublicacion: -1 });
    res.json(publicaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePublicacion = async (req, res) => {
  try {
    const publicacion = await Publicaciones.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!publicacion) return res.status(404).json({ error: 'No encontrada' });
    res.json(publicacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getArchivoPublicacion = async (req, res) => {
  try {
    const publicacion = await Publicaciones.findById(req.params.id);
    if (!publicacion || !publicacion.file) {
      return res.status(404).send('Archivo no encontrado');
    }
    res.set('Content-Type', publicacion.mimeType || 'application/octet-stream');
    res.send(publicacion.file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePublicacion = async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await Publicaciones.findByIdAndDelete(id);
    if (!resultado) return res.status(404).json({ error: 'Publicación no encontrada' });
    res.json({ mensaje: 'Publicación eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
