const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWelcomeEmail = async (to, asunto, categoria, descripcion) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Nueva solicitud: ${asunto}`,
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>📬 Nueva solicitud recibida</h2>
        <p><strong>Correo usuario:</strong> ${to}</p>
        <p><strong>Categoría:</strong> ${categoria}</p>
        <p><strong>Descripción:</strong> ${descripcion}</p>
      </div>
    `
  };

  try {
    console.log('📤 Enviando correo a:', to);
    await transporter.sendMail(mailOptions);
    console.log('✅ Correo enviado con Gmail');
  } catch (error) {
    console.error('❌ Error con Gmail:', error.message);
    throw error;
  }
};

module.exports = { sendWelcomeEmail };