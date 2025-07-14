const express = require('express');
const router = express.Router();
const controller = require('../controllers/comentarioController');

router.get('/', controller.getComentarios);
router.get('/publicacion/:idPublicacion', controller.getComentariosByPublicacion);
router.post('/', controller.createComentario);
router.put('/:id', controller.updateComentario);
router.delete('/:id', controller.deleteComentario);

module.exports = router;
