import { Router } from "express";

import { errorHandle } from "../../middlewares/error-handler.middleware.js";
import * as jobController from "./job.controller.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import {auth} from '../../middlewares/auth.middleware.js';
import { authorization } from "../../middlewares/authorization.middleware.js";
import { systemRoles, roles } from "../../utils/system-roles.utils.js";
import { addJobSchema, updateJobSchema, deleteJobSchema, getAllJobsForASpecificCompanySchema, getAllJobsThatMatchTheSelectedFiltersSchema, applyToJobSChema} from "./job.schema.js";
import { multerHost } from "../../middlewares/multer.middleware.js"
import { extentions } from "../../utils/file-extentions.utils.js";

const router = Router();

//addJob
router.post("/addJob", auth(), authorization(systemRoles.COMPANY_HR), validationMiddleware(addJobSchema), errorHandle(jobController.addJob) );
//updateJob
router.patch("/updateJob", auth(), authorization(systemRoles.COMPANY_HR), validationMiddleware(updateJobSchema), errorHandle(jobController.updateJob) );
//deleteJob
router.delete("/deleteJob/:jobId", auth(), authorization(systemRoles.COMPANY_HR), validationMiddleware(deleteJobSchema), errorHandle(jobController.deleteJob));
//getAllJobsWithTheirCompanyInformation
router.get("/getAllJobsWithTheirCompanyInformation", auth(), authorization(roles.USER_COMPANY_HR), errorHandle(jobController.getAllJobsWithTheirCompanyInformation) )
//getAllJobsForASpecificCompany
router.get("/getAllJobsForASpecificCompany", auth(), authorization(roles.USER_COMPANY_HR), validationMiddleware(getAllJobsForASpecificCompanySchema), errorHandle(jobController.getAllJobsForASpecificCompany) )
//getAllJobsThatMatchTheSelectedFilters 
router.get("/getAllJobsThatMatchTheSelectedFilters", auth(), authorization(roles.USER_COMPANY_HR), validationMiddleware(getAllJobsThatMatchTheSelectedFiltersSchema), errorHandle(jobController.getAllJobsThatMatchTheSelectedFilters) )
//applyToJob
router.post("/applyToJob",
    auth(),
    authorization(systemRoles.USER),
    multerHost({allowedExtentions: extentions.Documents}).single("userResume"),
    validationMiddleware(applyToJobSChema),
    errorHandle(jobController.applyToJob) );


export default router;
