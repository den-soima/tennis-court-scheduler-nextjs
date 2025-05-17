'use client';

import styles from './UserBookings.module.scss';
import { Booking } from '@/types/Booking';
import dayjs from 'dayjs';
import Image from 'next/image';
import { getDeleteIcon } from '@/lib/getImages';

type Props = {
  bookings: Booking[];
  formatCourtName: (courtId: string) => string;
  deleteBooking: (id: string) => void;
};

export const UserBookings = ({ bookings, formatCourtName, deleteBooking }: Props) => {
  return (
    <ul className={styles.bookingList}>
      {bookings.map((booking) => (
        <li key={booking._id} className={styles.bookingItem}>
          <div className={styles.bookingInfo}>
            <span className={styles.text}>{dayjs(booking.startTime).format('D/MM')}</span>
            <span className={styles.text}>
              {dayjs(booking.startTime).format('HH:mm')} – {dayjs(booking.endTime).format('HH:mm')}
            </span>
            <span className={styles.text}>📍 {formatCourtName(booking.courtId)}</span>

            <button className={styles.deleteButton} onClick={() => deleteBooking(booking._id)}>
              <Image className={styles.icon} src={getDeleteIcon()} alt="Delete" width={24} height={24} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
