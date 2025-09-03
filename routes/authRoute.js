import express from 'express';
import {forgotPasswordController, getOrdersController, loginController, registerController, updateProfileController} from '../controllers/authController.js'
import { isAdmin, requireSignIn } from './../middlewares/authMiddleware.js';


const router = express.Router()


// router.post('/register', registerController)

router.route("/register").post(registerController)

router.route("/login").post(loginController);

// forgot password route

router.post('/forgot-password', forgotPasswordController);


router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ok: true});

})



router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ok: true});
})



router.put('/profile', requireSignIn, updateProfileController);



router.get("/orders", requireSignIn, getOrdersController);

export default router;


