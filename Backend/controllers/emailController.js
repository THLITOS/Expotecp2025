// controllers/emailController.js
const { sendWelcomeEmail } = require('../utils/mailer');

const soporte = async (req, res) => {
  const { email, asunto, categoria, descripcion } = req.body;

  try {
    await sendWelcomeEmail(email, asunto, categoria, descripcion);
    res.status(200).json({ message: 'Correo de bienvenida enviado correctamente' });
  } catch (err) {
    console.error("Error al enviar correo:", err.message);
    res.status(500).json({ message: 'Error al enviar el correo de bienvenida' });
  }
};

module.exports = { soporte };
