const crypto = require('crypto');
const prisma = require('../config/prismaClient');

const SESSION_TIMEOUT_MINUTES = parseInt(process.env.SESSION_TIMEOUT_MINUTES || '15');

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedHash) => {
  if (!storedHash) return false;

  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;

  const candidate = crypto.scryptSync(password, salt, 64);
  const stored = Buffer.from(key, 'hex');

  return stored.length === candidate.length && crypto.timingSafeEqual(stored, candidate);
};

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  username: user.username,
  role: user.role
});

const createSession = async (userId) => {
  const token = crypto.randomBytes(32).toString('hex');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TIMEOUT_MINUTES * 60 * 1000);

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      sessionTokenHash: hashToken(token),
      sessionExpiresAt: expiresAt,
      lastActiveAt: now
    }
  });

  return {
    token,
    expiresAt,
    user: sanitizeUser(user)
  };
};

async function register({ email, username, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (existing) {
    const error = new Error('Email is already registered');
    error.statusCode = 409;
    throw error;
  }

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      username: username?.trim() || normalizedEmail.split('@')[0],
      passwordHash: hashPassword(password),
      role: 'USER'
    }
  });

  return createSession(user.id);
}

async function login({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  return createSession(user.id);
}

async function authenticate(token) {
  if (!token) return null;

  const user = await prisma.user.findFirst({
    where: { sessionTokenHash: hashToken(token) }
  });

  if (!user || !user.sessionExpiresAt || user.sessionExpiresAt <= new Date()) {
    return null;
  }

  const now = new Date();
  const sessionExpiresAt = new Date(now.getTime() + SESSION_TIMEOUT_MINUTES * 60 * 1000);

  const refreshed = await prisma.user.update({
    where: { id: user.id },
    data: {
      lastActiveAt: now,
      sessionExpiresAt
    }
  });

  return sanitizeUser(refreshed);
}

async function logout(token) {
  if (!token) return;

  await prisma.user.updateMany({
    where: { sessionTokenHash: hashToken(token) },
    data: {
      sessionTokenHash: null,
      sessionExpiresAt: null
    }
  });
}

module.exports = { register, login, authenticate, logout };
