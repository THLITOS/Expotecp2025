const mongoose = require('mongoose');
//Tabla para guardar las publicaciones
const publicacionSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  titulo: String,
  contenido: String,
  tipoContenido: { type: String, enum: ['foto', 'video', 'mixto'], required: true },
  archivoUrl: String,
  fechaPublicacion: { type: Date, default: Date.now },
  file: Buffer, //Guardar el archivo
  mimeType: String, //Guardar el tipo de archivo
  comunidad: [String],
});

module.exports = mongoose.model('Publicaciones', publicacionSchema);