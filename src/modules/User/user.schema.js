import BaseJoi from 'joi';
import JoiDate from '@joi/date';

import { systemRoles } from "../../utils/system-roles.utils.js";

const Joi = BaseJoi.extend(JoiDate);

// user schema object to validate user data
export const userRegistrationSchema = {
    body: Joi.object({
        firstName: Joi.string().min(3).max(10).trim().pattern(/^[a-zA-Z]+$/).required(),
        lastName: Joi.string().min(3).max(10).trim().pattern(/^[a-zA-Z]+$/).required(),
        email: Joi.string().email({minDomainSegments: 2, maxDomainSegments: 3}).trim().required(),
        password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required(),
        recoveryEmail: Joi.string().email({minDomainSegments: 2, maxDomainSegments: 3}).trim().required(),
        DOB: Joi.date().format(['DD/MM/YYYY', 'DD-MM-YYYY']).less('now').required(),
        mobileNumber: Joi.string().pattern(/^01[0-2,5]{1}[0-9]{8}$/).required(),
        role: Joi.string().valid(systemRoles.USER, systemRoles.COMPANY_HR),
        status: Joi.string().valid('online', 'offline'),
    }),
}