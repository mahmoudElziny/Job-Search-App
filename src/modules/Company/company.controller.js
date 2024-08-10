import { ObjectId } from "mongodb";

import companyModel from "../../../DB/models/company.model.js";
import jobModel from "../../../DB/models/job.model.js";
import { ErrorHandlerClass } from "../../utils/error-class.utils.js";
import applicationModel from "../../../DB/models/application.model.js";

/**
 * addCompany
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, newCompany}
 * @description add new company to database
 */
export const addCompany = async (req, res, next) => {

    //distruct user (company HR) ID from request authUser
    const { _id } = req.authUser;
    //distruct company data from request body
    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;

    //company object
    const company = {
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        companyHR: new ObjectId(_id)
    }

    //check if company Exists already
    const isCompanyExists = await companyModel.findOne({ companyEmail });
    //if company not exists
    if (!isCompanyExists) {
        //add company to database
        const newCompany = await companyModel.create(company);
        //success response
        return res.status(201).json({ message: "company created", company: newCompany });
    }

    // if company already exists
    return next(new ErrorHandlerClass({ message: "company already exists", statusCode: 400, position: "at addCompany api" }));
}

/**
 * updateCompany
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, updatedCompany}
 * @description update company data 
 */
export const updateCompany = async (req, res, next) => {

    //distruct user id from request authUser
    const { _id } = req.authUser;
    //distruct company data from request body
    const newData = req.body;

    //find the company by companyHR
    const isCompanyExists = await companyModel.findOne({ companyHR: new ObjectId(_id) });

    //check if company exists
    if (isCompanyExists) {
        //update company data
        const updatedCompany = await companyModel.updateOne({ companyHR: new ObjectId(_id) }, {
            companyName: newData.companyName ? newData.companyName : isCompanyExists.companyName,
            description: newData.description ? newData.description : isCompanyExists.description,
            industry: newData.industry ? newData.industry : isCompanyExists.industry,
            address: newData.address ? newData.address : isCompanyExists.address,
            numberOfEmployees: newData.numberOfEmployees ? newData.numberOfEmployees : isCompanyExists.numberOfEmployees,
            companyEmail: newData.companyEmail ? newData.companyEmail : isCompanyExists.companyEmail,
        }, { new: true });

        // check if company updated successfully
        if (updatedCompany) {
            //success response
            return res.status(202).json({ message: "company updated successfully", data: updatedCompany });
        } else {
            //fail response if any error happend
            return next(new ErrorHandlerClass({ message: "something went wrong", statusCode: 400, position: "at updateCompany api" }));
        }

    } else {
        //fail response if can not find company assoiated to this user
        return next(new ErrorHandlerClass({ message: "no company assosiated to this user", statusCode: 400, position: "at updateCompany api" }));
    }
}

/**
 * deleteCompany
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, deleteCompany}
 * @description delete company from database
 */
export const deleteCompany = async (req, res, next) => {

    //distruct user ID from request authUser
    const { _id } = req.authUser;
    //distruct company ID from params
    const { companyId } = req.params;

    //find company and delete it
    const deleteCompany = await companyModel.findOneAndDelete({ $and: [{ _id: new ObjectId(companyId) }, { companyHR: new ObjectId(_id) }] });

    //if company deleted successfully
    if (deleteCompany) {
        //success response
        return res.status(202).json({ message: "company deleted successfully", deleteCompany });
    }

    //fail response if companyHR wrong or company Id wrong 
    return next(new ErrorHandlerClass({ message: "wrong companyHR Id or company Id ", statusCode: 400, position: "at deleteCompany api" }));
}

/**
 * getCompanyData
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, companyWithRelatedJobs{compayData, jobs}}
 * @description get Company Data by ID and it's related jobs 
 */
export const getCompanyData = async (req, res, next) => {

    //distruct company Id from request params
    const { companyId } = req.params;
    //distruct companyHR Id from request authUser 
    const { _id } = req.authUser;

    //find company by companyId and user Id 
    const company = await companyModel.findOne({ $and: [{ companyHR: new ObjectId(_id) }, { _id: new ObjectId(companyId) }] });

    //check if company found with HR user Id is the same in companyHR Id
    if (company) {

        //find jobs related to the company using companyHR 
        const jobs = await jobModel.find({ addedBy: new ObjectId(_id) }).exec();

        //success response
        return res.status(202).json({
            message: "company found", companyWithRelatedJobs: {
                companyData: company,
                jobs: jobs
            }
        });
    } else {
        //fail response
        return next(new ErrorHandlerClass({ message: "Wrong HR user Id or companyHR Id", statusCode: 400, position: "at getCompanyData api" }));
    }
}

/**
 * getCompanyDataByName
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, company}
 * @description get Company Data by name 
 */
export const getCompanyDataByName = async (req, res, next) => {

    //distruct company name from request body
    const { companyName } = req.body;

    //find company by companyName 
    const company = await companyModel.findOne({ companyName });

    //check if company found 
    if (company) {
        //success response
        return res.status(202).json({ message: "company found", company: company });
    } else {
        //fail response
        return next(new ErrorHandlerClass({ message: "no company found with this name", statusCode: 400, position: "at getCompanyDataByName api" }));
    }


}

/**
 * getAllApplicationsForSpecificJob
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, applicationsForAJob}
 * @description get All Applications For Specific Job (only CompanyHR can access his job applications)
 */
export const getAllApplicationsForSpecificJob = async (req, res, next) => {
    
    //distruct userId (companyHR) from request authUser
    const { _id } = req.authUser;
    //distruct jobId from request params
    const { jobId } = req.params;
    
    //find the job and check if te companyHR posted it 
    const isCompanyHRPostedThisJob = await jobModel.findOne({ _id: new ObjectId(jobId), addedBy: new ObjectId(_id) });
    
    //check if the companyHR has no access to this jo applications
    if (isCompanyHRPostedThisJob) {
        //find the applications for this job 
        const applicationsForAJob = await applicationModel.aggregate([{
            $match: {
                $and: [{ jobId: new ObjectId(jobId) }]
            }
        }, {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userData"
            }
        }]);

        //check if there is applications found
        if (applicationsForAJob.length != 0) {
            //success response
            return res.status(202).json({ message: "appplications for this job", applicationsForAJob });
        }else{
            //fail response if the companyHR has no access to this jo applications
            return next(new ErrorHandlerClass({ message: "the job has no applications", statusCode: 400, position: "at getAllApplicationsForSpecificJob api" }));
        }

    } else {
        //fail response if the companyHR has no access to this job applications or can not find this job
        return next(new ErrorHandlerClass({ message: "you have no access to this job applications or job not found", statusCode: 400, position: "at getAllApplicationsForSpecificJob api" }));
    }

}
