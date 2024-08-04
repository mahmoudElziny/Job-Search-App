import { compareSync, hashSync } from "bcrypt";
import userModel from "../../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmailService } from "../../services/send-email.service.js";
import { ErrorHandlerClass } from "../../utils/error-class.utils.js";
import { ObjectId } from 'mongodb';


/**
 * signUp
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
    if (firstName && lastName && email && password && recoveryEmail && DOB && mobileNumber) {

        //ensure that email is not exists
        const isEmailExists = await userModel.findOne({ email });

        if (isEmailExists) {
            return next(new ErrorHandlerClass({
                message: "Email already exists",
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


/**
 * SignIn
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, token}
 * @description user signIn and generate his token
 */
export const signIn = async (req, res, next) => {

    //distructing user signIn data from body
    const { email, recoveryEmail, mobileNumber, password } = req.body;

    //check if user signning in data exists
    if ((email || recoveryEmail || mobileNumber) && password) {

        //finding the user and update his status
        const user = await userModel.findOneAndUpdate({ $or: [{ email }, { recoveryEmail }, { mobileNumber }] }, { status: 'online' }, { new: true });

        //if user not found 
        if (!user) {
            return next(new ErrorHandlerClass({ message: "Invalid login credentials", statusCode: 404, position: "at SignIn api" }));
        }

        //password hashing
        const passCheck = compareSync(password, user.password);

        //check the password 
        if (!passCheck) {
            return next(new ErrorHandlerClass({ message: "Invalid login credentials, password wrong", statusCode: 404, position: "at signIn api" }));
        }

        //create user token with signuture & expiration date
        const token = jwt.sign(
            {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                DOB: user.DOB,
                role: user.role,
                status: user.status
            },
            "accessToken",
            {
                expiresIn: "20d"
            }
        );

        //success response for signIn
        res.status(200).json({ message: "User signed in", token });

    } else {
        return next(new ErrorHandlerClass({ message: "Initialize All Fields", statusCode: 400, position: "at signIn api" }));
    }
}

/**
 * updateAccount
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, userUpdated}
 * @description user update account data
 */
export const updateAccount = async (req, res, next) => {

    //distruct user id from authUser
    const user = req.authUser;
    //distruct user data to be updated from body
    const newData = req.body;

    //find the user by ID and update user data
    const userUpdated = await userModel.findByIdAndUpdate({ _id: new ObjectId(user._id) }, {
        firstName: newData.firstName ? newData.firstName : user.firstName,
        lastName: newData.lastName ? newData.lastName : user.lastName,
        email: newData.email ? newData.email : user.email,
        mobileNumber: newData.mobileNumber ? newData.mobileNumber : user.mobileNumber,
        recoveryEmail: newData.recoveryEmail ? newData.recoveryEmail : user.recoveryEmail,
        DOB: newData.DOB ? newData.DOB : user.DOB,
    }, { new: true });

    //success response if user successfully found 
    if (userUpdated) {
        return res.status(202).json({ message: "user updated successfully", data: userUpdated });
    }

    //if any error happend passes it to error handler middleware
    return next(new ErrorHandlerClass({ message: "wrong user Id", position: "at updateAccount api", statusCode: 400 }));

}

/**
 * deleteAccount
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, userUpdated}
 * @description delete user account 
 */
export const deleteAccount = async (req, res, next) => {

    //distruct user ID from authUser
    const {_id} = req.authUser;
    
    //find the user by ID to be deleted
    const user = await userModel.findByIdAndDelete( {_id: new ObjectId(_id)}); 
    
    //return success response if user found 
    if(user){
        return res.status(202).json({ message: "user deleted successfully", data: user} );
    }
    
    //if any error happend passes to error handler middleware
    return next(new ErrorHandlerClass({message: "wrong user Id",position:"at deleteAccount api",statusCode:400}) );

}

/**
 * getUserData
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, user}
 * @description get user account data
 */
export const getUserData = async (req, res, next) => {

     //distruct user ID from authUser
    const { _id } = req.authUser;
    
    //find user by ID
    const user = await userModel.findById({_id: new ObjectId(_id)});
    
    //check if user found and return success response
    if(user){
        return res.status(202).json({message: "User found ", user});
    }
    
    //if any error happend passes to error handler middleware
    return next(new ErrorHandlerClass({message: "wrong user Id",position:"at getUserData api",statusCode:400}));
    
}

/**
 * getAnyUserDatabyId
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, user}
 * @description get any user account data by it's ID
 */
export const getAnyUserDatabyId = async (req, res, next) => {

    //distruct user Id from query params
    const { _id } = req.query;

    //find user by ID and avoid returning critical data
    const user = await userModel.findById({_id: new ObjectId(_id)}).select("-_id -password -recoveryEmail -OTB -OTBExpireDate -createdAt -updatedAt");
    
    //check if user found and return success response
    if(user){
        return res.status(202).json({message: "User found ", user});
    }
    
    //if any error happend passes to error handler middleware
    return next(new ErrorHandlerClass({message: "wrong user Id",position:"at getAnyUserDatabyId api",statusCode:400}));
}

/**
 * updatePassword
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message}
 * @description update user password 
 */
export const updatePassword = async (req, res, next) => {
    
    //distruct user Id from request authUser
    const { _id } = req.authUser;
    //distruct password & new password from request body
    const {password, newPassword} = req.body;
    
    //find user by ID
    const user = await userModel.findById({_id: new ObjectId(_id)}); 
    
    //check if user found 
    if(user){
        //password hashing
        const passCheck = compareSync(password, user.password);
        //check if password match
        if(passCheck){
            //hashing the password
            const hashedPassword = hashSync(newPassword, 12);
            //update the new password
            await userModel.updateOne({_id: new ObjectId(_id)},{password: hashedPassword});
            //returning success response
            return res.status(202).json({message: "password updated sucessfully"});
        }else{
            return next(new ErrorHandlerClass({message: "wrong password", statusCode:400, position:"at updatePassword api"}));
        }
    }
    //if any error happend passes to error handler middleware
    return next(new ErrorHandlerClass({message: "can not find the user", statusCode:400, position:"at updatePassword api"}));

}


/**
 * forgetPassword
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message}
 * @description sending email to user and put his OTB in database 
 */
export const forgetPassword = async (req, res, next) => {

    //distruct user email from request body
    const { email } = req.body;
    
    //check if email exists in database
    const user = await userModel.findOne({email});
    
    //check if user exists
    if(user){
        //creating OTB from 6 numbers 
        const OTB = Math.floor(100000 + Math.random() * 900000);
        //set OTB expiration date to 3 minutes from now
        const expDate = new Date(+ new Date() + (60000*3));

        //sending email
        const isEmailSent = await sendEmailService({
            to: email,
            subject: "Welcome to Job Search App - here is your OTB to reset your password ",
            html: `<h1>Your OTB is ${OTB}</h1>`
        }); 
        
        //check any error in sending email happend and pass it to error handler
        if(isEmailSent.rejected.length){
            return next(new ErrorHandlerClass({
            message: "sending Email is failed",
            statusCode: 500,
            position: "at forgetPassword api",
            data: isEmailSent
        }
        ));
        }

        //save OTB & OTBExDate to user object in database
        const updatedUser = await userModel.updateOne({email},{OTB, OTBExpireDate:expDate},{new: true});
        //check if user OTB & OTBExDate updated successfully to user object in database
        if(!updatedUser){
            return next(new ErrorHandlerClass({message: "something went wrong with updating the user OTB & OTBExDate", statusCode: 409, position:"at forgetPassword api"}));
        }
        
        //return success response
        return res.status(202).json({message: "email successfully sent"});

    }else{
        return next(new ErrorHandlerClass({message: "can not find user with this email ", statusCode: 400, position:"at forgetpassword api"}));
    }

}

/**
 * passwordReset
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, userConfirmation}
 * @description reset user password
 */
export const passwordReset = async (req, res, next) => {
    //distruct OTB & newPassword from request headers
    const { email, otb, newpassword } = req.headers;
    
    //now date 
    const date = new Date();
    
     //find the user to reset his password
    const user = await userModel.findOne({email});

    //check if OTB right & not expired
    if(otb == user.OTB && date <= user.OTBExpireDate ){
        //hashing the new password
        const hashedPassword = hashSync(newpassword, 12);
        //update the new password 
        const userConfirmation = await userModel.findOneAndUpdate({ email }, {password: hashedPassword, status: "offline" }, { new: true }).select("-password -OTB");
        //check if user updated successully 
        if(!userConfirmation){
            return next( new ErrorHandlerClass({message: "user not found", statusCode: 404, position: "at passwordReset api"}));
        }
        //success response 
        res.status(200).json({ message: "user password updated successfully", userConfirmation });
    }else{
        //check if wrong or expired OTB 
        return next( new ErrorHandlerClass({message: "wrong or Expired OTB try again", statusCode: 404, position: "at passwordReset api"}));  
    }  

}

/**
 * getAllAccountsAssociatedToSpecificRecoveryEmail
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns {object} return response {message, users}
 * @description get All Accounts Associated To a Specific RecoveryEmail
 */
export const getAllAccountsAssociatedToSpecificRecoveryEmail = async (req, res, next) => {

    //distruct email ffrom request body
    const { email } = req.body;
    
    //find users by recoveryEmail
    const users = await userModel.find({recoveryEmail: email}).exec();
    
    //check if users found and return success response
    if(users){
        return res.status(202).json({message: "Users found ", users});
    }
    
    //if any error happend passes to error handler middleware
    return next(new ErrorHandlerClass({message: "can not find users assosiated to this email", position:"at getAllAccountsAssociatedToSpecificRecoveryEmail api", statusCode:400}));

}

