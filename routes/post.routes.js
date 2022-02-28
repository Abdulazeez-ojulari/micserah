const auth = require('../middlewares/auth');
const post = require('../controllers/post.controller');
const express = require('express');
const router = express.Router();

// router.get('/', (req, res) => {
//     res.send({ message: 'Welcome to JoRide'})
// })

router.get('/:feedId', auth, post.findByFeedId)

router.post('/', auth, post.create)

module.exports = router;