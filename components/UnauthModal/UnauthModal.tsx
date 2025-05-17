'use client';

import { getCloseMenuIcon } from '@/lib/getImages';
import styles from './UnauthModal.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Props = {
  onClose: () => void;
};

export default function UnauthModal({ onClose }: Props) {
  const router = useRouter();

  return (
    <div className={styles.modal}>
      <div className={styles.buttonContainer}>
        <button onClick={() => onClose()} className={styles.buttonClose}>
          <Image src={getCloseMenuIcon()} alt="Close" width={24} height={24} />
        </button>
      </div>

      <div className={styles.container}>
        <p className={styles.text}>Щоб керувати бронюваннями, увійдіть до системи.</p>

        <div className={styles.buttonWrapper}>
          <button className={styles.button} onClick={() => router.push('/login')}>
            Увійти
          </button>

          <button className={styles.button} onClick={() => router.push('/register')}>
            Зареєструватися
          </button>
        </div>
      </div>
    </div>
  );
}
