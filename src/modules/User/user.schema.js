import BaseJoi from 'joi';
import JoiDate from '@joi/date';

import { systemRoles } from "../../utils/system-roles.utils.js";
import {generalRules, objectIdRule} from "../../utils/general-rules.utils.js";

const Joi = BaseJoi.extend(JoiDate);

// user SignUp schema object to validate user data
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
    }),
}

// user updateAccount schema object to validate user data
export const userUpdateSchema = {
    body: Joi.object({
        firstName: Joi.string().min(3).max(10).trim().pattern(/^[a-zA-Z]+$/),
        lastName: Joi.string().min(3).max(10).trim().pattern(/^[a-zA-Z]+$/),
        email: Joi.string().email({minDomainSegments: 2, maxDomainSegments: 3}).trim(),
        recoveryEmail: Joi.string().email({minDomainSegments: 2, maxDomainSegments: 3}).trim(),
        DOB: Joi.date().format(['DD/MM/YYYY', 'DD-MM-YYYY']).less('now'),
        mobileNumber: Joi.string().pattern(/^01[0-2,5]{1}[0-9]{8}$/),
    }),
}

// user GetDataById schema object to validate user data
export const userGetDataByIdSchema = {
    query: Joi.object({
        _id: Joi.string().custom(objectIdRule).required(),
    })
}

// user updatePassword schema object to validate user data
export const userUpdatePasswordSchema = {
    body: Joi.object({
        password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required(),
        newPassword: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required(),
    }) 
}

// user updatePassword schema object to validate user data
export const userForgetPasswordSchema = {
    body: Joi.object({
        email: Joi.string().email({minDomainSegments: 2, maxDomainSegments: 3}).trim().required(),
    }) 
}

// user passwordReset schema object to validate user data
export const userPasswordResetSchema = {
    headers: Joi.object({
        email: Joi.string().email({minDomainSegments: 2, maxDomainSegments: 3}).trim().required(),
        otb: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
        newpassword: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required(),
        ...generalRules.Headers
    })
}

// user passwordReset schema object to validate user data
export const getAllAccountsAssociatedToSpecificRecoveryEmailSchema = {
    body: Joi.object({
        email: Joi.string().email({minDomainSegments: 2, maxDomainSegments: 3}).trim().required(),
    }) 
}
