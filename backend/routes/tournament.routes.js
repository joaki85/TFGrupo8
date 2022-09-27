const router = require('express').Router(); // Enrutador
const tournamentCtrl = require('../controllers/tournament.controller');

// Tournament Routes

router.get('/tournaments', tournamentCtrl.getTournaments);

router.get('/tournament_list', tournamentCtrl.getTournamentList);

router.get('/tournament_fav', tournamentCtrl.getTournamentFav);

router.post('/post_tournament', tournamentCtrl.postTournament);

router.post('/update_tournament', tournamentCtrl.updateTournament);

module.exports = router;
