const { tryCatch } = require('bullmq');
const { Users } = require('../models');
const { generateOtp } = require('../utils/otp');
const { generateToken } = require('../utils/jwt');
const bcrypt = require('bcrypt');

exports.signup = async (req, res, next) => {
  try {
        const { name, mobile, email, password } = req.body;
        console.log('req.body: ', req.body)
        
        const existingMobile = await Users.findOne({where: {mobile: mobile}})
        if(existingMobile){
            return res.status(400).send({ status: false, msg: 'Mobile already exist' })
        }
        const existingEmail = await Users.findOne({where: {email: email}})
        if(existingEmail){
            return res.status(400).send({ status: false, msg: 'Email already exist' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('hashedPassword: ', hashedPassword)

        const payload = {
            name,
            mobile,
            email,
            password: hashedPassword,
        }
        const user = await Users.create(payload)
        // res.status(201).json(result.rows[0]);
        return res.status(201).json({
          message: 'User signup successfully',
          data: user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.sendOtp = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    const otp = generateOtp();
    await Users.update({ otp }, { where: { mobile } });
    return res.status(200).json({ success: true, otp: otp }); // Mock: return OTP directly
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyOtp = async (req, res, next) => {
try {
    const { mobile, otp } = req.body;
  const user = await Users.findOne({ where: { mobile, otp } });
  if (!user) return res.status(400).json({ success: false, message: 'Invalid OTP' });

  const token = generateToken({ id: user.id });
  await Users.update({ otp: null }, { where: { mobile } });
  return res.status(200).json({ success: true, token });
} catch (error) {
  res.status(500).json({ error: error.message });
}};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    const otp = generateOtp();
    await Users.update({ otp }, { where: { mobile } });
    return res.status(200).json({ success: true, otp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { otp, newPassword } = req.body;

    const user = await Users.findOne({ where: { otp } });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid OTP' });

    if (!newPassword) {
      return res.status(400).json({ success: false, message: 'New Password is required' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Users.update({ password: hashedPassword }, { where: { id: user.id } });

    return res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
