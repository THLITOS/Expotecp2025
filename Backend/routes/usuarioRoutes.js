const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', usuarioController.getUsuarios);
router.get('/:idUsuario', usuarioController.getUsuarioById);

// RUTA PARA EDITAR PERFIL CON IMAGEN
router.put('/:idUsuario', upload.single('avatar'), usuarioController.updateUsuario);

module.exports = router;
