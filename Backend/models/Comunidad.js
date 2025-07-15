const mongoose = require('mongoose');

const comunidadSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  creadorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  miembros: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }],
  imagenUrl: {
    type: String,
    trim: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  file: { type: Buffer },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejor rendimiento
comunidadSchema.index({ creadorId: 1 });
comunidadSchema.index({ nombre: 'text', descripcion: 'text' });

module.exports = mongoose.model('Comunidad', comunidadSchema);
