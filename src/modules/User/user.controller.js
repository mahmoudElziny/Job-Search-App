import { compareSync, hashSync } from "bcrypt";
import userModel from "../../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmailService } from "../../services/send-email.service.js";
import { ErrorHandlerClass } from "../../utils/error-class.utils.js";
import { ObjectId } from 'mongodb';

//signUp
/**
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, user}
 * @description create new user
 */
export const signUp = async (req, res, next) => {
    
    //distruct user info fields from body 
    const { firstName, lastName, email, password, recoveryEmail, DOB, mobileNumber, role, status } = req.body;
    
    //ensure that required fields initialized
    if ( firstName && lastName && email && password && recoveryEmail && DOB && mobileNumber) {

        //ensure that email is not exists
        const isEmailExists = await userModel.findOne({ email });
        
        if (isEmailExists) {
            return next( new ErrorHandlerClass({
                message:"Email already exists",
                statusCode: 409,
                position: "at registration api",
                data: email
                })
            );
        }
        
        //hashing the password
        const hashedPassword = hashSync(password, 12);
        
        //create new user object
        const userObject = new userModel({
            firstName,
            lastName,
            userName: firstName.toLowerCase() + lastName.toLowerCase(),
            email,
            password: hashedPassword,
            recoveryEmail,
            DOB,
            mobileNumber,
            role,
            status,
            OTB: 123456,
            OTBExpireDate: new Date()
        });  
        
        //creating and saving new user object to database
        const user = await userObject.save();
        
        return res.status(201).json({ message: "user created", user });

    } else {
        return next(new ErrorHandlerClass({
            message: "Initialize All Fields",
            statusCode: 400,
            position: "at registration api"
        }  
        ));
    }
}