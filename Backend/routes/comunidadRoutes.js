const express = require('express');
const { crearComunidad, obtenerComunidades, unirseAComunidad, salirseDeComunidad, obtenerComunidadesPorUsuario } = require('../controllers/comunidadController');
const { verificarToken } = require('../middleware/authMiddleware'); // tu middleware de auth
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/', verificarToken, upload.single('imagen'), crearComunidad);
router.get('/', obtenerComunidades);
router.post('/:id/unirse', verificarToken, unirseAComunidad);
router.post('/:id/salirse', verificarToken, salirseDeComunidad);
router.get('/:id', obtenerComunidadesPorUsuario);

module.exports = router;
