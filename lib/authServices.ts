import { User } from '@/types/User';
import { HttpError, postData, updateData } from './fetchData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const registerUserService = async (
  name: string,
  phone: string,
  password: string,
  setLoading: (loading: boolean) => void
): Promise<{ success: boolean; errorMessage?: string }> => {
  if (!name.trim() || !phone) {
    return { success: false, errorMessage: 'Будь ласка, правильно заповніть усі поля' };
  }

  setLoading(true);

  const payload = { name, phone, password };

  try {
    await postData('/api/users', payload);
    await delay(1000);

    return { success: true };
  } catch (error) {
    const err = error as HttpError;
    await delay(1000);

    if (err.status === 409) {
      return { success: false, errorMessage: 'Цей номер вже зареєстрований.' };
    } else {
      return { success: false, errorMessage: 'Щось пішло не так. Спробуйте ще раз' };
    }
  } finally {
    setLoading(false);
  }
};

export const loginUserService = async (
  phone: string,
  password: string,
  setUser: (user: User | null) => void,
  setLoading: (loading: boolean) => void
): Promise<{ success: boolean; errorMessage?: string }> => {
  setLoading(true);

  const payload = { phone, password };

  try {
    const response = await postData<{
      token: string;
      user: User;
    }>('/api/login', payload);

    await delay(1000);

    localStorage.setItem('token', response.token);
    setUser(response.user);

    return { success: true };
  } catch (error) {
    const err = error as HttpError;
    await delay(1000);

    if (err.status === 401) {
      return { success: false, errorMessage: 'Неправильний пароль.' };
    } else if (err.status === 404) {
      return { success: false, errorMessage: 'Користувач не знайден.' };
    } else {
      return { success: false, errorMessage: 'Щось пішло не так. Спробуйте ще раз' };
    }
  } finally {
    setLoading(false);
  }
};

export const logoutUserService = async (
  setUser: (user: User | null) => void,
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);

  await delay(1000);

  localStorage.removeItem('token');
  setUser(null);

  setLoading(false);
};

export const resetPasswordService = async (
  phone: string,
  password: string,
  setLoading: (loading: boolean) => void
): Promise<{ success: boolean; errorMessage?: string }> => {
  setLoading(true);

  const payload = { phone, password };

  try {
    await updateData<{
      phone: string;
      password: string;
    }>('/api/users/reset-password', payload);
    await delay(1000);

    return { success: true };
  } catch (error) {
    await delay(1000);

    const err = error as HttpError;

    if (err.status === 404) {
      return { success: false, errorMessage: 'Цей номер не зареєстрований.' };
    } else {
      return { success: false, errorMessage: 'Щось пішло не так. Спробуйте ще раз' };
    }
  } finally {
    setLoading(false);
  }
};
