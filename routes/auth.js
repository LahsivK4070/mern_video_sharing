import express from "express";
import { googleAuth, signin, signup } from "../controllers/auth.js";

const router = express.Router();

// Create a new user
router.post("/signup", signup)

// sign in
router.post("/signin", signin)

// google sign in
router.post("/google", googleAuth)

export default router;