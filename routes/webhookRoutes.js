const router = require('express').Router();
const { stripeWebhook } = require('../controllers/subscriptionController');

router.post('/', stripeWebhook);

module.exports = router;
