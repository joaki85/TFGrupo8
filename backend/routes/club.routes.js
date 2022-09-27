const router = require('express').Router(); // Enrutador
const clubCtrl = require('../controllers/club.controller');

// Club routes
router.get('/clubs', clubCtrl.getClubs);

module.exports = router;
