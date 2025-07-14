const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path'); 

// Cargar variables de entorno
dotenv.config();

// Crear app
const app = express();

// Middleware para CORS
const allowedOrigins = [
  'http://localhost:4200',
  'https://expotecp2025f.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


// Middleware para JSON
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/publicaciones', require('./routes/publicacionRoutes'));
app.use('/api/reacciones', require('./routes/reaccionRoutes'));
app.use('/api/comentarios', require('./routes/comentarioRoutes'));
app.use('/api/conversaciones', require('./routes/conversacionRoutes'));
app.use('/api/comunidades', require('./routes/comunidadRoutes'));
app.use('/api/email', require('./routes/emailRoutes'));

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
