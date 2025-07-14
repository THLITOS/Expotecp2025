const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const upload = require('../middleware/uploads');

router.get('/', usuarioController.getUsuarios);
router.get('/:idUsuario', usuarioController.getUsuarioById);

// ✅ RUTA PARA EDITAR PERFIL CON IMAGEN
router.put('/:idUsuario', upload.single('avatar'), usuarioController.updateUsuario);

module.exports = router;
