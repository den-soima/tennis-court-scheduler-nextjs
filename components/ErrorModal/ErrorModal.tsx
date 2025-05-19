'use client';

import { getCloseMenuIcon } from '@/lib/getImages';
import styles from './ErrorModal.module.scss';
import Image from 'next/image';

type Props = {
  onClose: () => void;
  notification: string;
};

export default function ErrorModal({ onClose, notification }: Props) {
  return (
    <div className={styles.modal}>
      <div className={styles.buttonContainer}>
        <button onClick={() => onClose()} className={styles.buttonClose}>
          <Image src={getCloseMenuIcon()} alt="Close" width={24} height={24} />
        </button>
      </div>

      <p className={styles.text}>{notification}</p>
    </div>
  );
}
