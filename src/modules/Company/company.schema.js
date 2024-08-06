import { systemRoles } from "../../utils/system-roles.utils.js";
import {generalRules, objectIdRule} from "../../utils/general-rules.utils.js";
import Joi from "joi";


// add Company schema object to validate company data
export const addCompanySchema = {
    body: Joi.object({
        companyName: Joi.string().min(3).max(30).trim().pattern(/^[a-zA-Z]+$/).required(),
        description: Joi.string().min(20).max(300).trim().required(),
        industry: Joi.string().min(3).max(50).trim().required(),
        address: Joi.string().min(5).max(200).trim().required(),
        numberOfEmployees: Joi.number().greater(10).less(201).required(),
        companyEmail: Joi.string().email({minDomainSegments: 2, maxDomainSegments: 3}).trim().required(),
    }),
}

// update Company schema object to validate company data
export const updateCompanySchema = {
    body: Joi.object({
        companyName: Joi.string().min(3).max(30).trim().pattern(/^[a-z A-Z]+$/),
        description: Joi.string().min(20).max(300).trim(),
        industry: Joi.string().min(3).max(50).trim(),
        address: Joi.string().min(5).max(200).trim(),
        numberOfEmployees: Joi.number().greater(10).less(201),
        companyEmail: Joi.string().email({minDomainSegments: 2, maxDomainSegments: 3}).trim(),
    }),
}

// delete Company schema object to validate company data
export const deleteCompanySchema = {
    params: Joi.object ({
            companyId: Joi.string().custom(objectIdRule).required(),
    })
}

export const getCompanyDataSchema = {
    params: Joi.object ({
        companyId: Joi.string().custom(objectIdRule).required(),
}) 
}