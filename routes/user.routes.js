const user = require('../controllers/user.controller.js');
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');
const express = require('express');
const router = express.Router();

router.post('/signup', user.signup);

router.post('/login', user.login);

router.get('/confirmation/:email/:token', user.confirmEmail);

router.get('/', auth, authAdmin, user.findAll)

router.get('/profile', auth, user.findByUserId);

module.exports = router;