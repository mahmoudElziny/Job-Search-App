import mongoose, {Schema, model} from "mongoose";

//job database schema 
const jobSchema = new Schema(
    {
        jobTitle: {
            type: String,
            required: true,
            trim: true,
            minLength: 3,
            maxLength: 20
        },
        jobLocation: {
            type: String,
            enum: [ 'onsite', 'remotely', 'hybrid' ],
            required: true,
            trim: true
        },
        workingTime: {
            type: String,
            enum: [ 'part-time', 'full-time' ],
            required: true,
            trim: true
        },
        seniorityLevel: {
            type: String,
            enum: [ 'junior', 'mid-level', 'senior-team-lead', 'CTO' ],
            required: true,
            trim: true
        },
        jobDescription: {
            type: String, 
            required: true,
            trim: true
        },
        technicalSkills: [String],
        softSkills: [String],
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true 
        },
        companyId: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true 
        }
    },
    {timestamps: true , versionKey: false}
);

export default mongoose.models.Job || model('Job', jobSchema);