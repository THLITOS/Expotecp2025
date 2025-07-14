// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Asegura que puedas acceder a process.env.JWT_SECRET

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('🛡️ Auth header recibido:', authHeader);

  if (!authHeader) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1]; // Esperamos formato "Bearer <token>"
  if (!token) {
    return res.status(401).json({ error: 'Token mal formado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Usamos el secreto real del .env
    req.usuario = decoded; // Guardamos el usuario en el request
    console.log('✅ Token válido. Usuario ID:', decoded.id);
    next();
  } catch (error) {
    console.error('❌ Error al verificar token:', error.message);
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { verificarToken };
