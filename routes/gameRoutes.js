const {Router} = require('express');
const gameController = require('../controllers/gameController');
const gameUrls = require('../constants/urls/gameUrls');
const {requireAuth} = require('../middlewares/authMiddleware')
const router = Router();

router.use(requireAuth);

router.get(gameUrls.CREATE_GAME_URL, gameController.createGame);

router.get(gameUrls.JOIN_GAME_URL, gameController.joinGame);

router.get(gameUrls.GAME_PAGE_URL, gameController.gamePage);

module.exports = router;