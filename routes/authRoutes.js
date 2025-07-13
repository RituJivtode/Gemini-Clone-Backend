const router = require('express').Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../utils/jwt');

router.post('/signup', authController.signup);
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/forgot-password', authController.forgotPassword);
router.post('/change-password', verifyToken, authController.changePassword);

module.exports = router;
