const { Users } = require('../models');

exports.getMe = async (req, res) => {
  try {
    const user = await Users.findByPk(req.userId, { attributes: ['id', 'name', 'mobile', 'email', 'subscriptionTier'] });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }  
};
