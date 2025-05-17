import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/lib/mongoose';
import { User } from '@/models/User';

export async function PATCH(req: NextRequest) {
  await connectToDatabase();

  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json({ error: 'Номер телефону та новий пароль обовʼязкові' }, { status: 400 });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return NextResponse.json({ error: 'Користувача з таким номером не знайдено' }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: 'Пароль успішно оновлено' }, { status: 200 });
  } catch (error: unknown) {
    let message = 'Unknown error';

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
