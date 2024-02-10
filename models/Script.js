import mongoose from "mongoose";

const scriptSchema = new mongoose.Schema({
  crNumber: { type: String, required: true },
  rowid: { type: Number, required: true },
  category: { type: String },
  subregion: { type: String },
  siteId: { type: String },
  cellId: { type: String },
  mo: { type: String },
  parameter: { type: String },
  bl: { type: String },
  pre: { type: String },
  post: { type: String },
}, { strict: false });

// Create a compound index on crNumber and rowid with the unique option set to true
scriptSchema.index({ crNumber: 1, rowid: 1 }, { unique: true });

const Script = mongoose.model('Script', scriptSchema);
export default Script;