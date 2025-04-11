import mongoose from "mongoose";


const sectionSchema = new mongoose.Schema(
    {
        value: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            
        }
    }    
);

const Section = mongoose.models.Section || mongoose.model("Section", sectionSchema);
export default Section;