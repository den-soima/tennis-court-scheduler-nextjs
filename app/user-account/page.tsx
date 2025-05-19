'use client';

import styles from './page.module.scss';
import { Booking, BookingServer } from '../../types/Booking';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useAuth } from '@/context/authContext';
import { deleteData, getData } from '@/lib/fetchData';
import { convertBookingToDayjs } from '@/lib/convertBookings';
import Link from 'next/link';
import { UserBookings } from '@/components/UserBookings/UserBookings';
import Loader from '@/components/Loader/Loader';

const courts: { [key: string]: string } = {
  '1': 'Щасливе',
  '2': 'Табір',
  '3': 'Проліски',
};

export default function UserAccount() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);

      try {
        const data = await getData<BookingServer[]>(`/api/bookings/${user?.id}`);
        const bookingsWithDayjs = data.map(convertBookingToDayjs);

        setBookings(bookingsWithDayjs);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id]);

  const formatCourtName = (courtId: string) => {
    return courts[courtId];
  };

  const nearestBooking = bookings[0];

  const deleteBooking = async (id: string) => {
    try {
      await deleteData<BookingServer>(`/api/delete-booking/${id}`);

      setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== id));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Не вдалося видалити бронювання');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {mounted && user && <h3 className={styles.title}>{`Привіт, ${user.name}!`}</h3>}

        {loading ? (
          <div className={styles.loaderWrapper}>
            <Loader />
          </div>
        ) : nearestBooking ? (
          <p className={styles.text}>
            {`Твоє найближче бронювання у 📍 ${formatCourtName(nearestBooking.courtId)} ${
              dayjs(nearestBooking.startTime).isSame(dayjs(), 'day')
                ? `сьогодні о ${dayjs(nearestBooking.startTime).format('HH:mm')}`
                : `на ${dayjs(nearestBooking.startTime).format('D/MM')} о ${dayjs(nearestBooking.startTime).format('HH:mm')}`
            }`}
          </p>
        ) : (
          <>
            <p className={styles.text}>У тебе поки не має бронювань</p>

            <Link href="/calendar/1" className={styles.button}>
              До календаря
            </Link>
          </>
        )}
      </div>

      {bookings.length > 0 && (
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <h3 className={styles.title}>Усі бронювання</h3>

            <UserBookings
              bookings={bookings}
              formatCourtName={formatCourtName}
              deleteBooking={deleteBooking}
            />
          </div>

          <Link href="/calendar/1" className={styles.button}>
            До календаря
          </Link>
        </div>
      )}
    </div>
  );
}
