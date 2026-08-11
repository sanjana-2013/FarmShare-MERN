import { Router, type IRouter } from "express";
import { getCurrentUser, logIn, signUp } from "../controllers/authController";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

router.post("/auth/signup", signUp);
router.post("/auth/login", logIn);
router.get("/auth/me", requireAuth, getCurrentUser);

export default router;