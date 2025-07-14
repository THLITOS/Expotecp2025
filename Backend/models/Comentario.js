const mongoose = require('mongoose');

//Tabla para guardar los comentarios de las publicaciones
const comentarioSchema = new mongoose.Schema({
  publicacionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Publicaciones', required: true },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  mensaje: { type: String, required: true },
  comentarioPadreID: { type: mongoose.Schema.Types.ObjectId, ref: 'Comentario' },
  fecha: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Comentario', comentarioSchema);

