// models/Application.js
import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema({
  frontpage_title: { type: String, required: false },
  frontpage_soknadsfrist: { type: String, required: false },
  elev_1: { type: String, required: false },
  elev_2: { type: String, required: false },
  elev_3: { type: String, required: false },
  elev_4: { type: String, required: false },
  program_musikk: { type: String, required: false },
  program_dans: { type: String, required: false },
  program_drama: { type: String, required: false },
  opptak: { type: String, required: false },
  hva_blir_jeg: { type: String, required: false },
  om_create: { type: String, required: false },
},
{ timestamps: true }
);

export default mongoose.models.Content || mongoose.model("Content", ContentSchema);
