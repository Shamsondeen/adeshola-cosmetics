const jwt = require('jsonwebtoken');

const createSendToken = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  const cookieExpireDays = Number(process.env.JWT_COOKIE_EXPIRE) || 7;
  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  // Avoid mutating the Mongoose document before serialization.
  const userData = user.toObject ? user.toObject() : { ...user };
  delete userData.password;

  return res.status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      data: userData
    });
};

module.exports = { createSendToken };
