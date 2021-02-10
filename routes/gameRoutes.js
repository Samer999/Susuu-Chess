const {Router} = require('express');
const gameController = require('../controllers/gameController');
const {urls} = require('../constants/urls/gameUrls');
const {requireAuth} = require('../middlewares/authMiddleware')
const router = Router();

router.get(urls.CREATE_GAME_URL, gameController.createGame);

router.get(urls.JOIN_GAME_URL, gameController.joinGame);

router.get(urls.GAME_PAGE_URL, gameController.gamePage);

module.exports = router;