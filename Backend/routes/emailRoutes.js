const express = require('express');
const router = express.Router();
const { sendWelcomeEmail } = require('../utils/Mailer');

console.log('Ñ Tipo:', typeof sendWelcomeEmail);

router.post('/test-email', async (req, res) => {
  const { email, asunto, categoria, descripcion } = req.body;
  try {
    await sendWelcomeEmail(
      email,
      asunto || "Prueba",
      categoria || "Debug",
      descripcion || "Correo de prueba de Sout"
    );
    res.status(200).json({ message: 'Correo enviado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al enviar el correo', error: err.message });
  }
});

router.post('/send-support-email', async (req, res) => {
  const { to, asunto, categoria, descripcion } = req.body;

  try {
    await sendWelcomeEmail(
      to,
      asunto || "Sin asunto",
      categoria || "General",
      descripcion || ""
    );
    res.status(200).json({ message: 'Correo enviado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al enviar el correo', error: err.message });
  }
});

module.exports = router;