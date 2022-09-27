const userCtrl = require('../controllers/user.controller');

const router = require('express').Router(); // Enrutador

// User Routes

router.post('/post_user', userCtrl.postUser);

router.post('/update_user', userCtrl.updateUser);

router.get('/user_profile', userCtrl.getUserProfile);

module.exports = router;
