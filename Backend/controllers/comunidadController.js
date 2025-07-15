const Comunidad = require('../models/Comunidad');
const fs = require('fs');

exports.crearComunidad = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const creadorId = req.usuario.id;

    // Verificar límite de comunidades por usuario
    const count = await Comunidad.countDocuments({ creadorId });
    if (count >= 3) {
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          console.warn('⚠️ No se pudo eliminar imagen:', err.message);
        }
      }
      return res.status(400).json({ error: 'Solo puedes crear hasta 3 comunidades' });
    }

   /*
    const imagenUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : null;*/

      const file = req.file?.buffer || null;

    const comunidad = new Comunidad({
      nombre,
      descripcion,
      creadorId,
      file
    });

    await comunidad.save();
    res.status(201).json(comunidad);
  } catch (error) {
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.warn('⚠️ No se pudo eliminar imagen tras error:', err.message);
      }
    }
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerComunidades = async (req, res) => {
  try {
    const comunidades = await Comunidad.find()
      .populate('creadorId', 'username')
      .populate('miembros', 'username');

    res.json(comunidades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerComunidadesPorUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.id;

    const comunidades = await Comunidad.find({ miembros: usuarioId })
      .populate('creadorId', 'username')
      .populate('miembros', 'username');

    res.json(comunidades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unirseAComunidad = async (req, res) => {
  try {
    const comunidadId = req.params.id;
    const usuarioId = req.usuario.id;

    const comunidad = await Comunidad.findById(comunidadId);
    if (!comunidad) {
      return res.status(404).json({ error: 'Comunidad no encontrada' });
    }

    if (comunidad.miembros.includes(usuarioId)) {
      return res.status(400).json({ error: 'Ya eres miembro de esta comunidad' });
    }

    comunidad.miembros.push(usuarioId);
    await comunidad.save();

    res.json({ message: 'Te uniste a la comunidad', comunidad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.salirseDeComunidad = async (req, res) => {
  try {
    const comunidadId = req.params.id;
    const usuarioId = req.usuario.id;

    const comunidad = await Comunidad.findById(comunidadId);
    if (!comunidad) {
      return res.status(404).json({ error: 'Comunidad no encontrada' });
    }

    if (!comunidad.miembros.includes(usuarioId)) {
      return res.status(400).json({ error: 'No eres miembro de esta comunidad' });
    }

    comunidad.miembros = comunidad.miembros.filter(id => id.toString() !== usuarioId);
    await comunidad.save();

    res.json({ message: 'Saliste de la comunidad', comunidad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
