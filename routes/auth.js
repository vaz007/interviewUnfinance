import express from "express";
import {
     register, login, forgotPassword, resetPassword, updateUserDetails, updatePassword
} from "../controllers/auth";

import  {protect} from "../middleware/auth.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:resetToken", resetPassword);
router.put("/updateDetails/",protect,  updateUserDetails);
router.put("/updatePassword/",protect,  updatePassword);

module.exports = router;