import { required } from "joi";
import mongoose, {Schema, model} from "mongoose";

//application database schema 
const applicationSchema = new Schema(
    {   
        jobId: {
            type: Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        userTechSkills: [{
            skill: {
                type: String,
                required: true,
                trim: true,
                minlength: 2,
                maxlength: 14
            }
        }],
        userSoftSkills: [{
            skill: {
                type: String,
                required: true,
                trim: true,
                minlength: 2,
                maxlength: 14
            }
        }], 
        userResume : {
            asset_id: {
                type: String,
                required: true,
                unique: true
            },
            public_id: {
                type: String,
                required: true,
                unique: true
            },
            secure_url: {
                type: String,
                required: true,
                unique: true
            }
        },
    },
    {timestamps: true , versionKey: false}
);

export default mongoose.models.Application || model('Application', applicationSchema);