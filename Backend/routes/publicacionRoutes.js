const express = require('express');
const router = express.Router();
const publicacionController = require('../controllers/publicacionController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('archivo'), publicacionController.crearPublicacion);
router.get('/', publicacionController.getPublicaciones);
router.put('/:id', publicacionController.updatePublicacion);
router.get('/:id/archivo', publicacionController.getArchivoPublicacion);
router.delete('/:id', publicacionController.deletePublicacion);

module.exports = router;
