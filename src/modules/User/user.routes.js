import { Router } from "express";

import { errorHandle } from "../../middlewares/error-handler.middleware.js";
import * as userController from "./user.controller.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { userForgetPasswordSchema, userGetDataByIdSchema, userPasswordResetSchema, userRegistrationSchema, userUpdatePasswordSchema, userUpdateSchema, getAllAccountsAssociatedToSpecificRecoveryEmailSchema } from "./user.schema.js";
import {auth} from '../../middlewares/auth.middleware.js'

const router = Router();

//signUp router 
router.post("/signUp", validationMiddleware(userRegistrationSchema), errorHandle(userController.signUp));
//signIn router 
router.patch("/signIn", errorHandle(userController.signIn));
//updateAccount
router.patch("/updateAccount", auth(), validationMiddleware(userUpdateSchema), errorHandle(userController.updateAccount) );
//deleteAccount
router.delete("/deleteAccount", auth(), errorHandle(userController.deleteAccount) );
//getUserData
router.get("/getUserData", auth(), errorHandle(userController.getUserData) );
//getAnyUserDatabyId
router.get("/getAnyUserDatabyId", validationMiddleware(userGetDataByIdSchema), errorHandle(userController.getAnyUserDatabyId) );
//updatePassword
router.patch("/updatePassword", auth(), validationMiddleware(userUpdatePasswordSchema), errorHandle(userController.updatePassword) );
//forgetPassword
router.patch("/forgetPassword", validationMiddleware(userForgetPasswordSchema), errorHandle(userController.forgetPassword));
//passwordReset
router.patch("/passwordReset", validationMiddleware(userPasswordResetSchema), errorHandle(userController.passwordReset));
//get All Accounts Associated To a Specific RecoveryEmail
router.get("/getAllAccountsAssociatedToSpecificRecoveryEmail", validationMiddleware(getAllAccountsAssociatedToSpecificRecoveryEmailSchema), errorHandle(userController.getAllAccountsAssociatedToSpecificRecoveryEmail));



export default router;