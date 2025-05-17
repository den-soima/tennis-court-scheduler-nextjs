'use client';

import styles from './page.module.scss';
import { Location } from '@/types/Location';
import { locations } from '@/lib/locations';
import UnavailableModal from '@/components/UnavailableModal/UnavailableModal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LocationCard from '@/components/LocationCard/LocationCard';

export default function Home() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = (locationId: string, isWorking: boolean) => {
    if (isWorking) {
      router.push(`/calendar/${locationId}`);
    } else {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.page}>
      {locations.map((location: Location) => {
        const isWorking = location._id === '1';

        return <LocationCard location={location} isWorking={isWorking} key={location._id} onClick={() => handleCardClick(location._id, isWorking)} />;
      })}

      {showModal && (
        <div className={styles.modalOverlay}>
          <UnavailableModal onClose={closeModal} />
        </div>
      )}
    </div>
  );
}
