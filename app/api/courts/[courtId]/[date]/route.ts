import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Booking } from '@/models/Booking';

export async function GET(_: NextRequest, context: unknown) {
  await connectToDatabase();

  const { courtId, date } = (context as { params: { courtId: string; date: string } }).params;

  try {
    const bookings = await Booking.find({ courtId, date }).sort({
      startTime: 1,
    });

    if (!bookings.length) {
      return NextResponse.json(
        {
          message: 'No bookings found for the given courtId and date',
          bookings: [],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(bookings, { status: 200 });
  } catch (error: unknown) {
    let message = 'Unknown error';

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
