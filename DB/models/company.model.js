import mongoose, {Schema, model} from "mongoose";

//company database schema 
const companySchema = new Schema(
    {
        companyName: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        description: {
            type: String,
            trim: true,
            required: true
        },
        industry: {
            type: String,
            trim: true,
            required: true
        },   
        address: {
            type: String,
            trim: true,
            required: true
        },   
        numberOfEmployees: {
            type: Number,
            min: 11,
            max: 200,
            required: true
        },
        companyEmail: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        companyHR: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true 
        }
    },
    {timestamps: true , versionKey: false}
);

export default mongoose.models.Company || model('Company', companySchema);