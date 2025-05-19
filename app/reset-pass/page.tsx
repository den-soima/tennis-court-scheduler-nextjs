'use client';

import { useForm } from 'react-hook-form';
import styles from './page.module.scss';
import { useState } from 'react';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader/Loader';
import ErrorModal from '@/components/ErrorModal/ErrorModal';

type FormValues = {
  phone: string;
  password: string;
  repeatPassword: string;
};

export default function ResetPassPage() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      phone: '',
      password: '',
      repeatPassword: '',
    },
  });

  const { resetPassword, loading } = useAuth();
  const router = useRouter();
  const [errorNotification, setErrorNotification] = useState('');
  const [successNotification, setSuccessNotificatoin] = useState('');
  const [modal, setModal] = useState(false);

  const onSubmit = async (data: FormValues) => {
    const preparedPhone = `+380${data.phone}`;
    const result = await resetPassword(preparedPhone, data.password);

    if (result.success) {
      setSuccessNotificatoin('Пароль успішно змінений');
      reset();
    } else {
      setModal(true);
      setErrorNotification(result.errorMessage || 'Щось пішло не так. Спробуйте ще раз.');
    }
  };

  return (
    <div className={styles.page}>
      {!successNotification && (
        <div className={styles.container}>
          <h3 className={styles.title}>Зміна паролю</h3>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel} htmlFor="phone">
                Твій номер телефону:
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
                Новий пароль:
              </label>
              <input
                className={styles.input}
                type="password"
                id="password"
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

            <button type="submit" className={`${styles.button} ${loading ? styles.isLoading : ''}`}>
              {loading ? <Loader /> : 'Підтвердити'}
            </button>
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
