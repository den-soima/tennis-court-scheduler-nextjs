'use client';

import styles from './Header.module.scss';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import Image from 'next/image';
import AsideMenu from '../AsideMenu/AsideMenu';
import Link from 'next/link';
import { getAvatarIcon, getCloseMenuIcon, getLoginIcon } from '@/lib/getImages';

export default function Header() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleMenuVisibility = () => {
    setIsOpen((prev: boolean) => !prev);
  };

  const menuOverflowStatus = (menuVisibility: boolean) => {
    if (menuVisibility) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'auto';
    }
  };

  useEffect(() => {
    menuOverflowStatus(isOpen);
  }, [isOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logoLink}>
        <div className={styles.logo}>Scheduler</div>
      </Link>

      <Link href="/" className={styles.avatarWrapper} onClick={handleMenuVisibility}>
        {mounted && user ? (
          <Image src={getAvatarIcon()} alt="User" className={styles.avatar} width={24} height={24} />
        ) : isOpen ? (
          <Image src={getCloseMenuIcon()} alt="Close menu" className={styles.icon} width={24} height={24} />
        ) : (
          <Image src={getLoginIcon()} alt="Login" className={styles.icon} width={24} height={24} />
        )}
      </Link>

      <AsideMenu isOpen={isOpen} handleMenuVisibility={handleMenuVisibility} user={!!user} />
    </header>
  );
}
