import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/lib/mongoose';
import { User } from '@/models/User';

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const { name, phone, password } = await req.json();

    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return NextResponse.json({ error: 'Номер телефону вже зареєстрований' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({ message: 'Користувач успішно зареєструвався' }, { status: 201 });
  } catch (error: unknown) {
    let message = 'Unknown error';

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const user = await User.findById(id);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user, { status: 200 });
    }

    const users = await User.find();
    return NextResponse.json(users, { status: 200 });
  } catch (error: unknown) {
    let message = 'Unknown error';

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
