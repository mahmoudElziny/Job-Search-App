import Joi from "joi";

import { objectIdRule } from "../../utils/general-rules.utils.js";




// add Job schema object to validate Job data
export const addJobSchema = {
    body: Joi.object({
        jobTitle: Joi.string().min(3).max(30).trim().pattern(/^[a-z A-Z]+$/).required(),
        jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid').trim().required(),
        workingTime: Joi.string().valid('part-time', 'full-time').trim().required(),
        seniorityLevel: Joi.string().valid('junior', 'mid-level', 'senior-team-lead', 'CTO').trim().required(),
        jobDescription: Joi.string().min(5).trim().required(),
        technicalSkills: Joi.array().items(Joi.string().required()).required(),
        softSkills: Joi.array().items(Joi.string().required()).required()
    }),
}

// update job schema object to validate job data
export const updateJobSchema = {
    body: Joi.object({
        jobTitle: Joi.string().min(3).max(30).trim().pattern(/^[a-z A-Z]+$/),
        jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid').trim(),
        workingTime: Joi.string().valid('part-time', 'full-time').trim(),
        seniorityLevel: Joi.string().valid('junior', 'mid-level', 'senior-team-lead', 'CTO').trim(),
        jobDescription: Joi.string().min(5).trim(),
        technicalSkills: Joi.array().items(Joi.string().required()),
        softSkills: Joi.array().items(Joi.string().required())
    }),
}

// delete job schema object to validate job data
export const deleteJobSchema = {
    params: Joi.object ({
        jobId: Joi.string().custom(objectIdRule).required(),
    })
}

//get All Jobs For a Specific Company schema to validate data
export const getAllJobsForASpecificCompanySchema = {
    query: Joi.object ({
        companyName: Joi.string().min(3).max(30).trim().pattern(/^[a-z A-Z]+$/).required(),
    })
}

//get All Jobs That Match The selected Filters Schema to validate data
export const getAllJobsThatMatchTheSelectedFiltersSchema = {
    body: Joi.object({
        workingTime: Joi.string().valid('part-time', 'full-time').trim(),
        jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid').trim(),
        seniorityLevel: Joi.string().valid('junior', 'mid-level', 'senior-team-lead', 'CTO').trim(),
        jobTitle: Joi.string().min(3).max(30).trim().pattern(/^[a-z A-Z]+$/),
        technicalSkills: Joi.array().items(Joi.string().required())
    }).min(1)
}

//apply to Job Schema to validate application data
export const applyToJobSChema = {
    body:Joi.object({
        jobId: Joi.string().custom(objectIdRule).required(),
        userTechSkills: Joi.array().items(Joi.string().required()).required(),
        userSoftSkills: Joi.array().items(Joi.string().required()).required(),
    })
}