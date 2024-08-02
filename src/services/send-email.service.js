import nodemailer from "nodemailer";

/**
 * sending email service
 * @param {object} EmailObject
 * @returns {object} object contains email information
 * @description sending email to user 
 */
export const sendEmailService = async ({
    to,
    subject,
    text,
    html
}) => {


    //transporter configration
    const transporter = nodemailer.createTransport({
        host: "localhost",
        port: 587,
        service: "gmail",
        secure: false,
        auth: {
            user: "mahmoudelziny20@gmail.com",
            pass: "ylxralzmwrdeleih",
        },
        tls: {
            rejectUnauthorized: true
        }
    }); 

    //message configration
    const info = await transporter.sendMail({
        from: "No-reply <mahmoudelziny20@gmail.com>",
        to: to,
        subject: subject,
        html: html ? html : "",
        text: text ? text : ""
    });
    
    
    return info;


};


