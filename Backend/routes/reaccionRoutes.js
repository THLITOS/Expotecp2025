const express = require('express');
const router = express.Router();
const controller = require('../controllers/reaccionController');

router.get('/', controller.getAllReacciones);
router.get('/reaciones-by-accion/:idPublicacion/:idUsuario', controller.getReaccionByAccion);
router.get('/likes-count/:idPublicacion', controller.getLikesCount);
router.get('/dislikes-count/:idPublicacion', controller.getDislikesCount);
router.get('/saved-count/:idPublicacion', controller.getSavedCount);
router.post('/', controller.createReaccion);
router.put('/:id', controller.updateReaccion);
router.delete('/:id', controller.deleteReaccion);

module.exports = router;
