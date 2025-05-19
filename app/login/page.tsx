'use client';

import { useForm } from 'react-hook-form';
import styles from './page.module.scss';
import { useState } from 'react';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/components/Loader/Loader';
import ErrorModal from '@/components/ErrorModal/ErrorModal';

type FormValues = {
  phone: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  const { loginUser, loading } = useAuth();
  const router = useRouter();
  const [notification, setNotification] = useState('');
  const [modal, setModal] = useState<boolean>(false);

  const onSubmit = async (data: FormValues) => {
    const preparedPhone = `+380${data.phone}`;

    const result = await loginUser(preparedPhone, data.password);

    if (result.success) {
      router.push('/');
    } else {
      setModal(true);
      setNotification(result.errorMessage || 'Щось пішло не так. Спробуйте ще раз.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h3 className={styles.title}>Авторизація</h3>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel} htmlFor="phone">
              Номер телефону:
            </label>

            <div className={styles.phoneInputBig}>
              <span className={styles.span}>+380</span>
              <input
                className={styles.phoneInputSmall}
                type="tel"
                id="phone"
                maxLength={9}
                onKeyDown={(e) => {
                  if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
                    e.preventDefault();
                  }
                }}
                {...register('phone', {
                  required: 'Будь ласка, введіть номер телефону',
                  validate: (value) => /^\d{9}$/.test(value) || 'Номер має містити 9 цифр',
                })}
              />
            </div>

            {errors.phone && <span className={styles.errorMessage}>{errors.phone.message}</span>}
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.inputLabel} htmlFor="password">
              Пароль:
            </label>
            <input
              className={styles.input}
              type="password"
              id="password"
              {...register('password', {
                required: 'Будь ласка, введіть пароль',
              })}
            />

            {errors.password && (
              <span className={styles.errorMessage}>{errors.password.message}</span>
            )}
          </div>

          <button type="submit" className={`${styles.button} ${loading ? styles.isLoading : ''}`}>
            {loading ? <Loader /> : 'Підтвердити'}
          </button>
        </form>

        <Link href="/reset-pass" className={styles.link}>
          {"Я не пам'ятаю свій пароль"}
        </Link>

        {modal && (
          <div className={styles.modalOverlay}>
            <ErrorModal onClose={() => setModal(false)} notification={notification} />
          </div>
        )}
      </div>
    </div>
  );
}
