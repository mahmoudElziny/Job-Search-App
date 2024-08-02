import { Router } from "express";

import { errorHandle } from "../../middlewares/error-handler.middleware.js";
import * as userController from "./user.controller.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { userRegistrationSchema } from "./user.schema.js";

const router = Router();

//signUp router 
router.post("/signUp", validationMiddleware(userRegistrationSchema), errorHandle(userController.signUp));




export default router;