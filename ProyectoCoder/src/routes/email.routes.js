import { Router } from "express";
import { deleteInactiveUsers  } from '../controllers/user.controller.js';

const router = Router();

router.get("/", deleteInactiveUsers );

export default router;