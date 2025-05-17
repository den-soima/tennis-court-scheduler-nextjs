import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Booking } from '@/models/Booking';

export async function DELETE(_: NextRequest, context: unknown) {
  await connectToDatabase();

  const { id } = (context as { params: { id: string } }).params;

  try {
    const deleted = await Booking.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    let message = 'Unknown error';

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
