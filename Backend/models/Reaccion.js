const mongoose = require('mongoose');

//Tabla para registrar reacciones
const reaccionSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  publicacionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Publicaciones', required: true },
  like: { type: Boolean, default: false },
  dislike: { type: Boolean, default: false },
  isSaved: { type: Boolean, default: false },
  fecha: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Reaccion', reaccionSchema);