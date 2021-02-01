const {Router} = require('express');
const authController = require('../controllers/authController');
const authUrls = require('../constants/urls/authUrls');

const router = Router();


router.get(authUrls.SIGN_IN_URL, authController.sign_in_get);
router.post(authUrls.SIGN_IN_URL, authController.sign_in_post);

router.get(authUrls.SIGN_UP_URL, authController.sign_up_get);
router.post(authUrls.SIGN_UP_URL, authController.sign_up_post);

router.get(authUrls.SIGN_OUT_URL, authController.sign_out);


module.exports = router;