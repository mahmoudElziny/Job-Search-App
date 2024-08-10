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
        companyId: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true
        },
        userTechSkills: [String],
        userSoftSkills: [String], 
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