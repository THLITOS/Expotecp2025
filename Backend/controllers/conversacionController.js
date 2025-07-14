const Conversacion = require('../models/Conversacion');
const mongoose = require('mongoose');
const { formatTimeAgo, formatMessageTimestamp } = require('../utils/formatters');

exports.getConversaciones = async (req, res) => {
  try {
    const conversaciones = await Conversacion.find()
      .populate('usuarioOrigenId', 'username')
      .populate('usuarioDestinoId', 'username');
    res.json(conversaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createConversacion = async (req, res) => {
  try {
    const [u1, u2] = req.body.participantes;
    const exist1 = await Conversacion.findOne({ participantes: [u1, u2] });
    const exist2 = await Conversacion.findOne({ participantes: [u2, u1] });

    if (exist1 || exist2) {
      return res.status(201).json({});
    }

    const nueva = new Conversacion(req.body);
    const guardada = await nueva.save();
    res.status(201).json(guardada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addMensaje = async (req, res) => {
  try {
    const { id } = req.params;
    const { remitente, contenido } = req.body;
    const conversacion = await Conversacion.findById(id);
    const nuevoMensaje = {
      remitente,
      contenido,
      fechaEnvio: new Date()
    };

    conversacion.mensajes.push(nuevoMensaje);
    conversacion.ultimoMensaje = { ...nuevoMensaje };
    const guardada = await conversacion.save();
    res.status(201).json(guardada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateConversacion = async (req, res) => {
  try {
    const conversacion = await Conversacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!conversacion) return res.status(404).json({ error: 'No encontrada' });
    res.json(conversacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteConversacion = async (req, res) => {
  try {
    const resultado = await Conversacion.findByIdAndDelete(req.params.id);
    if (!resultado) return res.status(404).json({ error: 'No encontrada' });
    res.json({ mensaje: 'Conversación eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChatsByUser = async (req, res) => {
  try {
    const { id } = req.params;

    const conversaciones = await Conversacion.find({
      participantes: new mongoose.Types.ObjectId(id)
    }).populate('participantes', 'username avatarUrl')
      .sort({ 'ultimoMensaje.fechaEnvio': -1 })
      .lean();

    const chatsFormateados = await Promise.all(conversaciones.map(async (conv) => {
      const otroParticipante = conv.participantes.find(p => p._id.toString() !== id);
      if (!otroParticipante) return null;

      const lastMessage = conv.ultimoMensaje?.contenido || 'No hay mensajes aún';
      const lastMessageDate = conv.ultimoMensaje?.fechaEnvio || conv.createdAt;

      const messages = conv.mensajes.map(msg => ({
        id: msg._id.toString(),
        text: msg.contenido,
        timestamp: formatMessageTimestamp(msg.fechaEnvio),
        isMine: msg.remitente.toString() === id
      }));

      const avatarUrl = otroParticipante.avatarUrl || 'https://static.vecteezy.com/system/resources/previews/013/446/485/non_2x/colored-design-icon-of-user-chat-vector.jpg';

      return {
        id: conv._id.toString(),
        name: otroParticipante.username,
        lastMessage,
        timeAgo: formatTimeAgo(lastMessageDate),
        avatarUrl,
        unread: false,
        messages
      };
    }));

    const filtered = chatsFormateados.filter(c => c !== null);
    res.status(200).json({ chats: filtered });

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los chats', error: error.message });
  }
};
