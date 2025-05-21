import { Dayjs } from 'dayjs';

/// To use in frontend ///

export interface Booking {
  _id: string;
  userName: string;
  userId: string;
  courtId: string;
  date: string;
  startTime: Dayjs;
  endTime: Dayjs;
}

/// to send a NEW booking to backend ///

export interface CreateBooking {
  userName: string;
  userId: string;
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
}

/// To GET and DELETE from backend ///

export interface BookingServer {
  _id: string;
  userName: string;
  userId: string;
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
}
