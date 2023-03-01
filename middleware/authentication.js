const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('error');
    throw new UnauthenticatedError('Authentication invalid');
  }
  const token = authHeader.split(' ')[1];
  console.log('token', token);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);
    // attach the user to the job routes
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};

module.exports = auth;
