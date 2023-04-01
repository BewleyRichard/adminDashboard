import express from "express"
import { register } from "../controllers/authController.js";
import { login } from "../controllers/authController.js";

// Auth routes. 
const router = express.Router();

router.post("/register", register)
router.post("/login", login)

export default router