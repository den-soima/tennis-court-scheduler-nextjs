import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userId: { type: String, required: true },
  courtId: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
