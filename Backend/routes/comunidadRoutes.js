const express = require('express');
const { crearComunidad, obtenerComunidades, unirseAComunidad, salirseDeComunidad, obtenerComunidadesPorUsuario } = require('../controllers/comunidadController');
const { verificarToken } = require('../middleware/authMiddleware'); 
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/', verificarToken, upload.single('imagen'), crearComunidad);
router.get('/', obtenerComunidades);
router.post('/:id/unirse', verificarToken, unirseAComunidad);
router.post('/:id/salirse', verificarToken, salirseDeComunidad);
router.get('/:id', obtenerComunidadesPorUsuario);

module.exports = router;
