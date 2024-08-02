import jwt from "jsonwebtoken";
import userModel from "../../DB/models/user.model.js";
import { ErrorHandlerClass } from "../utils/error-class.utils.js";

/**
 * authentication middleware
 * @returns {Function} 
 * @description authenticate user token and adding authUser to the request 
 *              which holds user information and next to the next middleware
 */
export const auth = () => {
    return async (req, res, next ) => {
            
            //distruct user token from headers in the request 
            const { token } = req.headers;
          
            //check if there is token  
            if(!token){
                return next( new ErrorHandlerClass({message: "Please signIn first , there is no token generated", statusCode: 400, position: "at auth api"}) );
            }
            
            //check token bearer
            if(!token.startsWith("jobSearchApp")){
                return next( new ErrorHandlerClass({message: "Invalid Token", statusCode: 400, position: "at auth api"}) );
            }
            
            //remove token bearer to get the original token
            const originalToken = token.split(" ")[1];
            
            //decode the token by token signature
            let decodedData;
            try {
                decodedData = jwt.verify(originalToken, "accessToken");
            
            } catch (error) {
                return next( new ErrorHandlerClass({message: "Invalid Token payload", statusCode: 400, position: "at auth api"}) );
            }
            
            //check if the token decoded is right
            if(!decodedData?._id){
                return next( new ErrorHandlerClass({message: "Invalid Token payload", statusCode: 400, position: "at auth api"}) );     
            }

            //findUserId
            const user = await userModel.findById(decodedData._id).select("-password");
            
            //check if the user exists
            if(!user){
                return next( new ErrorHandlerClass({message: "Please signUp and try to login", statusCode: 404, position: "at auth api"}) );
            }
            
            //passes the user decoded date to the request
            req.authUser = user;

            next();

    };
}