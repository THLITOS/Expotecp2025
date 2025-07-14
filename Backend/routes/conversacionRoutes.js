const express = require('express');
const router = express.Router();
const controller = require('../controllers/conversacionController');

router.get('/', controller.getConversaciones);
router.post('/', controller.createConversacion);
router.put('/:id', controller.updateConversacion);
router.post('/:id/mensaje', controller.addMensaje);
router.delete('/:id', controller.deleteConversacion);
router.get('/chats/:id', controller.getChatsByUser);

module.exports = router;
