// models/Application.js
import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  emailParent: { type: String, required: true },
  phone: { type: String, required: true },
  priority1: { type: String, required: true },
  priority2: { type: String, required: true },
  priority3: { type: String, required: true },
  opptaksprove: { type: String, required: false },
  filename: { type: String, required: true },
  textractAnalysis: {
    type: String,
    required: false,
  },
  behandlet: { type: Number, required: false },  
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
