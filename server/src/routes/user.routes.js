import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = new Router();

router
    .route("/register")
    .post(userController.registerUser);

router
    .route("/login")
    .post(userController.loginUser);

router
    .route("/logout")
    .post(verifyJWT, userController.logoutUser);

router
    .route("/changePassword")
    .post(verifyJWT, userController.changeUserPassword);

router
    .route("/getCurrentUser")
    .get(verifyJWT, userController.getCurrentUser);

router
    .route("/updateAvatar")
    .post(verifyJWT, upload.single("avatar"), userController.updateAvatar);

router.route('/registerWithGoogle').post(userController.registerWithGoogle)
router.route('/loginWithGoogle').post(userController.loginWithGoogle)

router.route('/verifyOTP').post(userController.verifyOtp);

export default router;
