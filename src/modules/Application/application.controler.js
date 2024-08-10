import excelJS from "exceljs"
import { ObjectId } from "mongodb";
import path from "path";

import { ErrorHandlerClass } from "../../utils/error-class.utils.js";
import applicationModel from "../../../DB/models/application.model.js";


/**
 * applicationsForASpecificCompanyOnASpecificDayAndCreatesAnExcelSheet
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} returns {status, message, path}
 * @description create excel sheet that collects the applications for a specific company on a specific day
 */
export const applicationsForASpecificCompanyOnASpecificDayAndCreatesAnExcelSheet = async (req, res, next) => {
    
    //distruct companyId and date from request body
    const { companyId, date } = req.body;
    
    //find applications for specific company
    const applications = await applicationModel.find({companyId: new ObjectId(companyId)}).exec();
    
    //array for applications that matched the date
    let applicationsMatchedDate = [];
    
    //filter apllications that match the date given by user
    applications.forEach(function (object) {

        if(object.createdAt.toISOString().slice(0,10) == date.toString()){
            // pushing application object that matched the condition
            applicationsMatchedDate.push(object);
        } 
        
    });
    
    //fail response if can not find applications
    if(applicationsMatchedDate.length == 0){
        return next(new ErrorHandlerClass({message: "no applications matched the date or no applications for this company",statusCode:400, position: "at applicationsForASpecificCompanyOnASpecificDayAndCreatesAnExcelSheet api"}));
    }
    

    const workbook = new excelJS.Workbook();  // Create a new workbook
    const worksheet = workbook.addWorksheet("My Applications"); // New Worksheet
    const path1 = path.resolve("./src/modules/Application/upload");  // Path to download excel
    // Column for data in excel. key must match data key
    worksheet.columns = [
        { header: "s_no", key: "s_no", width: 20 },
        { header: "_id", key: "_id", width: 20 },
        { header: "jobId", key: "jobId", width: 20 },
        { header: "userId", key: "userId", width: 20 },
        { header: "userTechSkills", key: "userTechSkills", width: 40 },
        { header: "userSoftSkills", key: "userSoftSkills", width: 40 },
        { header: "userResume", key: "userResume", width: 20 },
        { header: "createdAt", key: "createdAt", width: 20 },
        { header: "updatedAt", key: "updatedAt", width: 20 },

    ];

    // Looping through User data
    let counter = 1;
    applicationsMatchedDate.forEach((app) => {
        app.s_no = counter;
        worksheet.addRow(app); // Add data in worksheet
        counter++;
    });

    // Making first line in excel bold
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });
        //write to the excel file
        const data = await workbook.xlsx.writeFile(`${path1}/applications.xlsx`)
            .then(() => {
                //success response
                res.status(202).json({
                    status: "success",
                    message: "file successfully downloaded",
                    path: `${path1}/applications.xlsx`,
                });
            });
    

}
