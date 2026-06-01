const express = require('express');
const controller = require('../controllers/authController');
const { validateLogin, validateRegister } = require('../validators/authValidator');

const router = express.Router();

router.post('/register', validateRegister, controller.register);
router.post('/login', validateLogin, controller.login);
router.get('/me', controller.me);
router.post('/logout', controller.logout);

module.exports = router;
