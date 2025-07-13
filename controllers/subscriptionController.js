const stripe = require('../services/stripeService');
const { Users } = require('../models');

exports.subscribePro = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID, 
          quantity: 1
        }
      ],
      metadata: {
        userId: req.userId // for later reference in webhook
      },
      success_url: 'https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://yourdomain.com/cancel'
    });

    return res.status(201).json({ success: true, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ success: false, message: 'Stripe session creation failed' });
  }
};

exports.getSubscriptionStatus = async (req, res) => {
  try {
    console.log('req.userId 31:', req.userId)
    const user = await Users.findByPk(req.userId, {
      attributes: ['subscriptionTier']
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(500).json({
      success: true,
      subscription: user.subscriptionTier
    });
  } catch (error) {
    console.error('Error fetching subscription:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
