const router = require('express').Router();
const user = require('../controllers/userController');

router.get('/me', user.getMe);

module.exports = router;
