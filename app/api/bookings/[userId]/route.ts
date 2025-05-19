import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Booking } from '@/models/Booking';

export async function GET(_: NextRequest, context: unknown) {
  await connectToDatabase();

  const { userId } = (context as { params: { userId: string } }).params;
  const currentTime = new Date();

  try {
    const bookings = await Booking.find({
      userId,
      startTime: { $gte: currentTime },
    }).sort({ startTime: 1 });

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}
