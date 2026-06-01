const { z } = require('zod');

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const registerSchema = credentialsSchema.extend({
  username: z.string().min(2).max(50).optional()
});

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ errors: error.issues || error.errors });
  }
};

module.exports = {
  validateLogin: validate(credentialsSchema),
  validateRegister: validate(registerSchema)
};
