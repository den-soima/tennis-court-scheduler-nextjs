'use client';

import styles from './AsideMenu.module.scss';
import classNames from 'classnames';
import { useAuth } from '@/context/authContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';

type Props = {
  isOpen: boolean;
  handleMenuVisibility: () => void;
  user: boolean;
};

export default function AsideMenu({ isOpen, handleMenuVisibility, user }: Props) {
  const { logoutUser, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside
      className={classNames(styles.aside, {
        [styles.menuOpened]: isOpen,
      })}
    >
      <div className={styles.menu}>
        <nav className={styles.nav}>
          <Link href="/" onClick={handleMenuVisibility} className={styles.navItem}>
            Корти
          </Link>

          {mounted && user && (
            <>
              <Link href="/user-account" onClick={handleMenuVisibility} className={styles.navItem}>
                Мої бронювання
              </Link>

              <button
                className={`${styles.button} ${loading ? styles.isLoading : ''}`}
                onClick={() => logoutUser()}
              >
                {loading ? <Loader /> : 'Вийти'}
              </button>
            </>
          )}
        </nav>

        {mounted && !user && (
          <div className={styles.buttonWrapper}>
            <Link href="/login" className={styles.button} onClick={handleMenuVisibility}>
              Увійти
            </Link>

            <Link href="/register" className={styles.button} onClick={handleMenuVisibility}>
              Зареєструватися
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
