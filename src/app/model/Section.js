// models/Section.js
import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: [true, "Section value is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, "Section value must be alphanumeric with hyphens"],
    },
    label: {
      type: String,
      required: [true, "Section label is required"],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


const Section = mongoose.models.Section || mongoose.model("Section", sectionSchema);
export default Section;