import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/lib/mongoose';
import { User } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const { phone, password } = await req.json();

    const user = await User.findOne({ phone });

    if (!user) {
      return NextResponse.json({ message: 'Користувач не знайден' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: 'Неправильний пароль' }, { status: 401 });
    }

    const token = jwt.sign({ id: user._id.toString(), phone: user.phone }, JWT_SECRET, {
      expiresIn: '1h',
    });

    return NextResponse.json(
      {
        token,
        user: { id: user._id.toString(), phone: user.phone, name: user.name },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    let message = 'Unknown error';

    if (err instanceof Error) {
      message = err.message;
    }

    return NextResponse.json(
      { message: 'Авторізація не була успішною', error: message },
      { status: 500 }
    );
  }
}
