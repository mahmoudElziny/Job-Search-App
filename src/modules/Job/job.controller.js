import { ObjectId } from "mongodb";

import jobModel from "../../../DB/models/job.model.js";
import { ErrorHandlerClass } from "../../utils/error-class.utils.js";
import companyModel from "../../../DB/models/company.model.js";
import { cloudinaryConfig } from "../../utils/cloudinary.utils.js"
import applicationModel from "../../../DB/models/application.model.js";


/**
 * addJob
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, newJob}
 * @description add new job to database 
 */
export const addJob = async (req, res, next) => {

    //distruct user (company HR) ID from request authUser
    const { _id } = req.authUser;
    //distruct job data from request body
    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;

    //find companyId for companyHR 
    const company = await companyModel.find({ companyHR: new ObjectId(_id) }).exec();

    //job object
    const job = {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy: new ObjectId(_id),
        companyId: new ObjectId(company[0]._id)
    }

    //add job to database
    const newJob = await jobModel.create(job);

    //success response
    return res.status(201).json({ message: "job created", job: newJob });
}

/**
 * updateJob
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, updatedJob}
 * @description update job data 
 */
export const updateJob = async (req, res, next) => {

    //distruct user id from request authUser
    const { _id } = req.authUser;
    //distruct job data from request body
    const newData = req.body;

    //find the job by addedBy id
    const isJobExists = await jobModel.findOne({ addedBy: new ObjectId(_id) });

    //check if job exists
    if (isJobExists) {
        //update job data
        const updatedJob = await jobModel.updateOne({ addedBy: new ObjectId(_id) }, {
            jobTitle: newData.jobTitle ? newData.jobTitle : isJobExists.jobTitle,
            jobLocation: newData.jobLocation ? newData.jobLocation : isJobExists.jobLocation,
            workingTime: newData.workingTime ? newData.workingTime : isJobExists.workingTime,
            seniorityLevel: newData.seniorityLevel ? newData.seniorityLevel : isJobExists.seniorityLevel,
            jobDescription: newData.jobDescription ? newData.jobDescription : isJobExists.jobDescription,
            technicalSkills: newData.technicalSkills ? newData.technicalSkills : isJobExists.technicalSkills,
            softSkills: newData.softSkills ? newData.softSkills : isJobExists.softSkills
        }, { new: true });

        // check if job updated successfully
        if (updatedJob) {
            //success response
            return res.status(202).json({ message: "job updated successfully", data: updatedJob });
        } else {
            //fail response 
            return next(new ErrorHandlerClass({ message: "something went wrong", statusCode: 400, position: "at updateJob api" }));
        }
    } else {
        //fail response if can not find job assoiated to this user
        return next(new ErrorHandlerClass({ message: "no job assosiated to this user", statusCode: 400, position: "at updateJob api" }));
    }
}

/**
 * deleteJob
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, deleteJob}
 * @description delete job data 
 */
export const deleteJob = async (req, res, next) => {

    //distruct user ID from request authUser
    const { _id } = req.authUser;
    //distruct job ID from request params
    const { jobId } = req.params;

    //find job and delete it
    const deleteJob = await jobModel.findOneAndDelete({ $and: [{ _id: new ObjectId(jobId) }, { addedBy: new ObjectId(_id) }] });

    //if job  deleted successfully
    if (deleteJob) {
        //success response
        return res.status(202).json({ message: "job deleted successfully", deleteJob });
    }

    //fail response if companyHR(_id) wrong or job Id wrong 
    return next(new ErrorHandlerClass({ message: "wrong companyHR Id or job Id ", statusCode: 400, position: "at deleteJob api" }));
}

/**
 * getAllJobsWithTheirCompanyInformation
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, jobsWithCompanies}
 * @description get all jobs with thier companies information
 */
export const getAllJobsWithTheirCompanyInformation = async (req, res, next) => {

    //find all jobs with their companies
    const jobsWithCompanies = await jobModel.aggregate([{
        $lookup:
        {
            from: "companies",
            localField: "companyId",
            foreignField: "_id",
            as: "company",
        }
    }]);

    //check if jobs found with thier companies
    if (jobsWithCompanies) {
        //sucess response
        return res.status(202).json({ message: "all jobs with their company's", jobsWithCompanies });
    }
    //fail response if any error happend
    return next(new ErrorHandlerClass({ message: "something went wrong", statusCode: 404, position: "at getAllJobsWithTheirCompanyInformation api" }));
}

/**
 * getAllJobsForASpecificCompany
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, jobsRelatedToCompany}
 * @description get all jobs for a Specific companies 
 */
export const getAllJobsForASpecificCompany = async (req, res, next) => {

    //distruct company Name from request query
    const { companyName } = req.query;

    //find company by name
    const company = await companyModel.findOne({ companyName });

    //check if company exists
    if (company) {
        //find jobs by company name 
        const jobs = await jobModel.find({ companyId: new ObjectId(company._id) }).exec();
        //success response
        return res.status(202).json({ message: "jobs related to the company name", jobsRelatedToCompany: { compnay: company, jobs: jobs } });
    } else {
        return next(new ErrorHandlerClass({ message: "no company found with this name", statusCode: 400, position: "at getAllJobsForASpecificCompany api" }));
    }

}


/**
 * getAllJobsThatMatchTheSelectedFilters
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, jobs}
 * @description get all jobs that match the selected filters by user
 */
export const getAllJobsThatMatchTheSelectedFilters = async (req, res, next) => {

    //distruct filters from request body 
    const filters = req.body;

    //find jobs with matched filters
    const jobs = await jobModel.find(filters).exec();

    //check if there is jobs matched the filters
    if (jobs.length != 0) {
        //success response
        return res.status(202).json({ message: "jobs matched", jobs: jobs });
    } else {
        //fail response or no result response
        return res.status(404).json({ message: "No jobs matched" });
    }
}

/**
 * applyToJob
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, addApplication}
 * @description user apply to job by creating job application
 */
export const applyToJob = async (req, res, next) => {

    // distruct user Id from request authUser
    const { _id } = req.authUser;

    //distruct application data from request file
    const { jobId, userTechSkills, userSoftSkills } = req.body; 

    //find compnay Id 
    const job = await jobModel.findById({_id: new ObjectId(jobId)});

    //send pdf file to cloudinary
    const CVfile = await cloudinaryConfig().uploader.upload(req.file.path,
        {
            //folder path on cloudinary
            folder: "Cloud/CV's",
            //file type
            resource_type: "image",
            //use original file name in public_id
            use_filename: true,
        }
    );

    if (CVfile) {
        //application object
        const application = {
            jobId: new ObjectId(jobId),
            userId: new ObjectId(_id),
            companyId: new ObjectId(job.companyId),
            userTechSkills,
            userSoftSkills,
            userResume: {
                asset_id: CVfile.asset_id,
                public_id: CVfile.public_id,
                secure_url: CVfile.secure_url
            },
        }
        //add new application to database
        const addApplication = await applicationModel.create(application);
        //success response
        return res.status(202).json({ message: "applied successfully", addApplication });
    } else {
        //fail response
        return next(new ErrorHandlerClass({message: "something went wrong with uploading the file", statusCode: 400, position: "at applyToJob api"}))
    }
}