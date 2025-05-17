import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Booking } from '@/models/Booking';

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const newBooking = new Booking(body);
    await newBooking.save();
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error: unknown) {
    let message = 'Unknown error';

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  await connectToDatabase();

  try {
    const bookings = await Booking.find().sort({ startTime: 1 });
    return NextResponse.json(bookings, { status: 200 });
  } catch (error: unknown) {
    let message = 'Unknown error';

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
