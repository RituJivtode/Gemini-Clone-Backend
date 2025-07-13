const router = require('express').Router();
const { subscribePro, getSubscriptionStatus } = require('../controllers/subscriptionController');
const { verifyToken } = require('../utils/jwt');

router.post('/pro', verifyToken, subscribePro);
router.get('/status', verifyToken, getSubscriptionStatus);

module.exports = router;
