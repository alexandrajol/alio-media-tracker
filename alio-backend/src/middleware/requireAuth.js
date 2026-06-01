const authService = require('../services/authService');

const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const user = await authService.authenticate(token);

  if (!user || user.role !== 'USER') {
    return res.status(401).json({ message: 'Authentication required' });
  }

  req.user = user;
  next();
};

module.exports = requireAuth;
