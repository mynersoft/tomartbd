import mongoose from "mongoose";
import slugify from "slugify";

const BrandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
           
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true
        },
        logo: {
            type: String,
            default: ""
        },
    
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.models.Brand || mongoose.model("Brand", BrandSchema);
