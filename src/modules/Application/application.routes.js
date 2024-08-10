import { Router } from "express";

import { errorHandle } from "../../middlewares/error-handler.middleware.js";
import * as applicationController from "./application.controler.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import {auth} from '../../middlewares/auth.middleware.js';
import { authorization } from "../../middlewares/authorization.middleware.js";
import { systemRoles } from "../../utils/system-roles.utils.js";
import { applicationsForASpecificCompanyOnASpecificDayAndCreatesAnExcelSheetSchema } from "./application.schema.js";


const router = Router();

//applicationsForASpecificCompanyOnASpecificDayAndCreatesAnExcelSheet
router.get("/applicationsForASpecificCompanyOnASpecificDayAndCreatesAnExcelSheet",
    auth(),
    authorization(systemRoles.COMPANY_HR),
    validationMiddleware(applicationsForASpecificCompanyOnASpecificDayAndCreatesAnExcelSheetSchema),
    errorHandle(applicationController.applicationsForASpecificCompanyOnASpecificDayAndCreatesAnExcelSheet),
);


export default router;

