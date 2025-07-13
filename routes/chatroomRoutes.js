const router = require('express').Router();
const ctrl = require('../controllers/chatroomController');
const { verifyToken } = require('../utils/jwt');

router.post('/', verifyToken, ctrl.createChatroom);
router.get('/', verifyToken, ctrl.listChatrooms);
router.get('/:id', verifyToken, ctrl.getChatroomById);
router.post('/:id/message', verifyToken, ctrl.sendMessage);

module.exports = router;
