import express from "express";
import { googleAuth, signin, signout, signup } from "../controllers/auth.js";

const router = express.Router();

// Create a new user
router.post("/signup", signup)

// sign in
router.post("/signin", signin)

// sign out
router.post("/signout", signout)

// google sign in
router.post("/google", googleAuth)

export default router;