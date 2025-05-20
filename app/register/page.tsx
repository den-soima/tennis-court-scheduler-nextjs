'use client';

import { useForm } from 'react-hook-form';
import styles from './page.module.scss';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader/Loader';
import ErrorModal from '@/components/ErrorModal/ErrorModal';

type FormValues = {
  name: string;
  phone: string;
  password: string;
  repeatPassword: string;
};

export default function Register() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      phone: '',
      password: '',
      repeatPassword: '',
    },
  });

  const { registerUser, loading } = useAuth();
  const router = useRouter();
  const [errorNotification, setErrorNotification] = useState('');
  const [successNotification, setSuccessNotificatoin] = useState('');
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (modal) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'auto';
    }
  }, [modal]);

  const onSubmit = async (data: FormValues) => {
    const preparedPhone = `+380${data.phone}`;
    const result = await registerUser(data.name, preparedPhone, data.password);

    if (result.success) {
      setSuccessNotificatoin('Ви успішно зареєструвались!');
      reset();
    } else {
      setModal(true);
      setErrorNotification(result.errorMessage || 'Щось пішло не так. Спробуйте ще раз.');
    }
  };

  const handleCancelClick = () => {
    reset();
    router.push('/');
  };

  return (
    <div className={styles.page}>
      {!successNotification && (
        <div className={styles.container}>
          <h3 className={styles.title}>Реєстрація</h3>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)} autoComplete="on">
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel} htmlFor="name">
                {"Ваше ім'я:"}
              </label>

              <div className={styles.inputWrapper}>
                <input
                  className={styles.input}
                  type="text"
                  id="name"
                  {...register('name', {
                    required: "Будь ласка введіть ваше ім'я",
                  })}
                />
              </div>

              {errors.name && <span className={styles.errorMessage}>{errors.name.message}</span>}
            </div>

            <div className={styles.inputContainer}>
              <label className={styles.inputLabel} htmlFor="phone">
                Ваш номер телефону:
              </label>

              <div className={styles.phoneInputBig}>
                <span className={styles.span}>+380</span>
                <input
                  className={styles.phoneInputSmall}
                  type="tel"
                  id="phone"
                  autoComplete="username"
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
                autoComplete="new-password"
                {...register('password', {
                  required: 'Будь ласка, введіть пароль',
                  validate: (value) =>
                    value.length >= 6 || 'Пароль має бути щонайменше 6 символів довжиною',
                })}
              />

              {errors.password && (
                <span className={styles.errorMessage}>{errors.password.message}</span>
              )}
            </div>

            <div className={styles.inputContainer}>
              <label className={styles.inputLabel} htmlFor="repeatPassword">
                Повторіть пароль:
              </label>
              <input
                className={styles.input}
                type="password"
                id="repeatPassword"
                {...register('repeatPassword', {
                  required: 'Будь ласка, повторіть пароль',
                  validate: (value) => value === watch('password') || 'Паролі не співпадають',
                })}
              />

              {errors.repeatPassword && (
                <span className={styles.errorMessage}>{errors.repeatPassword.message}</span>
              )}
            </div>

            <div className={styles.buttonContainerBottom}>
              <button
                type="submit"
                className={`${styles.button} ${loading ? styles.isLoading : ''}`}
              >
                {loading ? <Loader /> : 'Підтвердити'}
              </button>

              <button onClick={handleCancelClick} className={styles.buttonCancel}>
                Скасувати
              </button>
            </div>
          </form>

          {modal && (
            <div className={styles.modalOverlay}>
              <ErrorModal onClose={() => setModal(false)} notification={errorNotification} />
            </div>
          )}
        </div>
      )}

      {successNotification && (
        <>
          <div className={styles.notification}>{successNotification}</div>

          <button className={styles.button} onClick={() => router.push('/login')}>
            Увійти
          </button>
        </>
      )}
    </div>
  );
}
