'use client';

import styles from './LocationCard.module.scss';
import { Location } from '@/types/Location';
import Link from 'next/link';
import Image from 'next/image';
import CourtAnimation from '../CourtAnimation/CourtAnimation';

type Props = {
  location: Location;
  isWorking: boolean;
  onClick: () => void;
};

export default function LocationCard({ location, isWorking, onClick }: Props) {
  const { _id, name, image, mapLink, address } = location;

  return (
    <div className={styles.card}>
      <Link href={isWorking ? `/calendar/${_id}` : '#'} onClick={onClick}>
        {image ? (
          <Image src={image} alt="Location" className={styles.locationImage} width={400} height={300} />
        ) : (
          <div className={styles.imageWrapper}>
            <CourtAnimation />
          </div>
        )}
      </Link>

      <div className={styles.footer}>
        <div className={styles.row}>
          <h3 className={styles.name}>📍 {name}</h3>
          <a href={mapLink} target="_blank" rel="noopener noreferrer" className={styles.address}>
            {address}
          </a>
        </div>
      </div>
    </div>
  );
}
