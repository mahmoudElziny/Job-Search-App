import { Router } from "express";

import { errorHandle } from "../../middlewares/error-handler.middleware.js";
import * as companyController from "./company.controller.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import {auth} from '../../middlewares/auth.middleware.js';
import { authorization } from "../../middlewares/authorization.middleware.js";
import { systemRoles, roles } from "../../utils/system-roles.utils.js";
import { addCompanySchema, deleteCompanySchema, getCompanyDataByNameSchema, getCompanyDataSchema, updateCompanySchema, getAllApplicationsForSpecificJobSchema} from "./company.schema.js";

const router = Router();

//addCompany
router.post("/addCompany", auth(), authorization(systemRoles.COMPANY_HR), validationMiddleware(addCompanySchema), errorHandle(companyController.addCompany) );
//updateCompany
router.patch("/updateCompany", auth(), authorization(systemRoles.COMPANY_HR), validationMiddleware(updateCompanySchema), errorHandle(companyController.updateCompany));
//deleteCompany
router.delete("/deleteCompany/:companyId", auth(), authorization(systemRoles.COMPANY_HR), validationMiddleware(deleteCompanySchema), errorHandle(companyController.deleteCompany));
//getCompanyData
router.get("/getCompanyData/:companyId", auth(), authorization(systemRoles.COMPANY_HR), validationMiddleware(getCompanyDataSchema), errorHandle(companyController.getCompanyData));
//getCompanyDataByName
router.get("/getCompanyDataByName", auth(), authorization(roles.USER_COMPANY_HR), validationMiddleware(getCompanyDataByNameSchema), errorHandle(companyController.getCompanyDataByName));
//getAllApplicationsForSpecificJob
router.get("/getAllApplicationsForSpecificJob/:jobId", auth(), authorization(systemRoles.COMPANY_HR), validationMiddleware(getAllApplicationsForSpecificJobSchema), errorHandle(companyController.getAllApplicationsForSpecificJob));

export default router;



