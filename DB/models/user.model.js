import mongoose, {Schema, model} from "mongoose";

import { systemRoles } from '../../src/utils/system-roles.utils.js'

//user database schema 
const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        userName: {
            type: String,
            trim: true
        },      
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
        },
        recoveryEmail : {
            type: String,
            trim: true,
            required: true
        },
        DOB: {
            type: Date,
            required: true 
        },
        mobileNumber: {
            type: String,
            unique: true,
            required: true
        },
        role: {
            type: String,
            enum: [ systemRoles.USER, systemRoles.COMPANY_HR],
            default: systemRoles.USER
        },
        status: {
            type: String,
            enum: ['online', 'offline'],
            default: 'offline'
        },
        OTB: {
            type: String
        },
        OTBExpireDate: {
            type: Date
        },
    },
    {timestamps: true , versionKey: false}
);

export default mongoose.models.User || model('User', userSchema);