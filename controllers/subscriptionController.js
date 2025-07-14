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


exports.stripeWebhook = async (req, res) => {
    try {
        const sig = req.headers['stripe-signature'];

        let event;
        try {
            event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error('Webhook signature error:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        console.log('event.data.object 45: ', event.data.object)
        console.log('event.type 46:', event.type)

        //Handle subscription success
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.metadata?.userId;

            if (userId) {
            await Users.update({ subscriptionTier: 'PRO' }, { where: { id: userId } });
            console.log(`User ${userId} upgraded to PRO`);
            }
        }

        // Handle subscription cancellation
        if (event.type === 'customer.subscription.deleted') {
          const subscription = event.data.object;
          const userId = subscription.metadata?.userId;

          if (userId) {
            await Users.update({ subscriptionTier: 'BASIC' }, { where: { id: userId } });
            console.log(`User ${userId} downgraded to BASIC due to cancellation`);
          }
        }

        // Handle payment failure
        if (event.type === 'invoice.payment_failed') {
          const subscription = event.data.object.subscription;
          const userId = event.data.object?.lines?.data?.[0]?.metadata?.userId;

          if (userId) {
            await Users.update({ subscriptionTier: 'BASIC' }, { where: { id: userId } });
            console.log(`Payment failed. User ${userId} downgraded to BASIC`);
          }
        }
        return res.status(200).send('Webhook received');   
    } catch (error) {
        console.error('Error in stripe webhook payment event :', error.message);
        return res.status(500).json({ success: false, message: 'Server error' });
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
