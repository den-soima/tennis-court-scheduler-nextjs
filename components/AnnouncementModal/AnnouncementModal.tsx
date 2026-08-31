'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { getCloseMenuIcon } from '@/lib/getImages';
import {
  isNewAppAnnouncementActive,
  isNewAppAnnouncementDismissed,
  dismissNewAppAnnouncement,
  newAppAnnouncementConfig,
} from '@/lib/newAppAnnouncement';
import { useAnnouncementModal } from '@/context/announcementModalContext';
import styles from './AnnouncementModal.module.scss';

export default function AnnouncementModal() {
  const { isOpen, openAnnouncementModal, closeAnnouncementModal } = useAnnouncementModal();

  useEffect(() => {
    if (!isNewAppAnnouncementActive()) {
      return;
    }

    if (!isNewAppAnnouncementDismissed()) {
      openAnnouncementModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  const handleClose = () => {
    dismissNewAppAnnouncement();
    closeAnnouncementModal();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.buttonClose} aria-label="Закрити">
            <Image src={getCloseMenuIcon()} alt="Close" width={24} height={24} />
          </button>
        </div>

        <div className={styles.container}>
          <p className={styles.text}>
            Шановні гравці, з 14 вересня для керування бронюваннями переходимо на новий застосунок.
          </p>

          <a
            href={newAppAnnouncementConfig.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            {newAppAnnouncementConfig.appUrl}
          </a>

          <p className={styles.text}>До 13 вересня включно бронювання залишаються дійсними.</p>

          <p className={styles.text}>Просимо долучитись до тестування нового застосунку.</p>

          <p className={styles.text}>Про остаточний перехід ви будете додатково проінформовані!</p>

          <div className={styles.buttonWrapper}>
            <button className={styles.button} onClick={handleClose}>
              Зрозуміло
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
