import { User } from '@/types/User';
import { postData, updateData } from './fetchData';

export const registerUserService = async (name: string, phone: string, password: string, setLoading: (loading: boolean) => void, setError: (error: string) => void): Promise<boolean> => {
  setLoading(true);
  setError('');

  if (name.trim() && phone) {
    const payload = { name, phone, password };

    try {
      await postData('/api/users', payload);
      setError('');

      return true;
    } catch (error) {
      const err = error as Error;

      if (err.message.includes('409')) {
        setError('Цей номер вже зареєстрований');
      } else {
        setError('Щось пішло не так. Спробуйте ще раз');
      }

      return false;
    } finally {
      setLoading(false);
    }
  } else {
    setError('Будь ласка, правильно заповніть усі поля');
    setLoading(false);

    return false;
  }
};

export const loginUserService = async (
  phone: string,
  password: string,
  setUser: (user: User | null) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string) => void
): Promise<boolean> => {
  setLoading(true);
  setError('');

  const payload = { phone, password };

  try {
    const response = await postData<{
      token: string;
      user: User;
    }>('/api/login', payload);

    localStorage.setItem('token', response.token);
    setUser(response.user);
    setError('');

    return true;
  } catch (error) {
    const err = error as Error;

    if (err.message.includes('401')) {
      setError('Неправильний пароль');
    } else if (err.message.includes('404')) {
      setError('Користувач не знайден');
    } else {
      setError('Щось пішло не так. Спробуйте ще раз');
    }

    return false;
  } finally {
    setLoading(false);
  }
};

export const logoutUserService = (setUser: (user: User | null) => void) => {
  localStorage.removeItem('token');
  setUser(null);
};

export const resetPasswordService = async (phone: string, password: string, setLoading: (loading: boolean) => void, setError: (error: string) => void): Promise<boolean> => {
  setLoading(true);
  setError('');

  const payload = { phone, password };

  try {
    await updateData<{
      phone: string;
      password: string;
    }>('/api/users/reset-password', payload);
    setError('');

    return true;
  } catch (error) {
    const err = error as Error;

    if (err.message.includes('404')) {
      setError('Цей номер не зареєстрований');
    } else {
      setError('Щось пішло не так. Спробуйте ще раз');
    }

    return false;
  } finally {
    setLoading(false);
  }
};
