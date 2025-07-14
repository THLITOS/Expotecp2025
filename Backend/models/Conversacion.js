const mongoose = require('mongoose');

//Tabla para guardar las conversaciones del chat
const conversacionSchema = new mongoose.Schema({
  participantes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }],
  mensajes: [{
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    remitente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    contenido: { type: String, required: true },
    fechaEnvio: { type: Date, default: Date.now }
  }],
  // Para optimizar la busqueda del ultimo mensaje
  ultimoMensaje: {
    remitente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    contenido: { type: String },
    fechaEnvio: { type: Date, default: Date.now }
  },
}, { timestamps: true });

module.exports = mongoose.model('Conversacion', conversacionSchema);

