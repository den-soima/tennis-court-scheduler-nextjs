import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  address: { type: String, required: true },
  mapLink: { type: String, required: true },
});

export const Location = mongoose.models.Location || mongoose.model('Location', locationSchema);
