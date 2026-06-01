const authService = require('../services/authService');

const getBearerToken = (req) => {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
};

exports.register = async (req, res) => {
  try {
    const session = await authService.register(req.body);
    res.status(201).json(session);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const session = await authService.login(req.body);
    res.json(session);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.me = async (req, res) => {
  const user = await authService.authenticate(getBearerToken(req));

  if (!user) {
    return res.status(401).json({ message: 'Session expired or invalid' });
  }

  res.json({ user });
};

exports.logout = async (req, res) => {
  await authService.logout(getBearerToken(req));
  res.status(204).send();
};
