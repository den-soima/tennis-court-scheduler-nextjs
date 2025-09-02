'use client';

import styles from './page.module.scss';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/uk';
import { useEffect, useState } from 'react';
import BookingsTable from '../../../components/BookingsTable/BookingsTable';
import { ModalType } from '../../../types/ModalType';
import { Booking, BookingServer } from '../../../types/Booking';
import { locations } from '@/lib/locations';
import { getData } from '@/lib/fetchData';
import UnauthModal from '@/components/UnauthModal/UnauthModal';
import BookingCalendar from '@/components/BookingCalendar/BookingCalendar';
import { useAuth } from '@/context/authContext';
import { convertBookingToDayjs } from '@/lib/convertBookings';
import { useParams } from 'next/navigation';
import BookingModal from '@/components/BookingModal/BookingModal';
import Loader from '@/components/Loader/Loader';

dayjs.locale('uk');

export default function Calendar() {
  const { user } = useAuth();
  const { locationId } = useParams<{ locationId: string }>();
  const today = dayjs();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(today);
  const [modal, setModal] = useState<ModalType>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const location = locations.find((loc) => loc._id === locationId);

  const fetchBookings = async () => {
    setLoading(true);

    try {
      const data = await getData<BookingServer[]>('/api/bookings');
      const allBookings = data.map(convertBookingToDayjs);

      setBookings(allBookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [locationId]);

  useEffect(() => {
    if (modal) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'auto';
    }
  }, [modal]);

  if (!location || !locationId) {
    return <div className={styles.error}>Invalid location</div>;
  }

  const handleBookingSuccess = async () => {
    await fetchBookings();
    setModal(null);
  };

  const handleBookClick = (event: React.MouseEvent) => {
    if (!selectedDate) {
      event.preventDefault();
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } else {
      setModal(user ? 'booking' : 'unauth');
    }
  };

  const allBookings = bookings.filter((booking) => booking.courtId === locationId);

  const filteredBookings = selectedDate
    ? allBookings
        .filter((b) => dayjs(b.startTime).isSame(selectedDate, 'day'))
        .sort((a, b) => dayjs(a.startTime).unix() - dayjs(b.startTime).unix())
    : [];

  const isPastSelectedDay = selectedDate ? selectedDate.isBefore(today, 'day') : false;

  return (
    <div className={styles.page}>
      <BookingCalendar
        bookings={allBookings}
        selectedDate={selectedDate!}
        setSelectedDate={setSelectedDate}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
      />

      <div className={styles.wrapper}>
        <h3 className={styles.bookTitle}>📍 {location.name}</h3>

        {loading ? (
          <div className={styles.loaderWrapper}>
            <Loader />
          </div>
        ) : selectedDate ? (
          <BookingsTable bookings={filteredBookings} user={user} />
        ) : (
          <p className={styles.book}>Оберіть день для перегляду бронювань</p>
        )}

        {showNotification && (
          <p className={styles.notification}>Будь ласка оберіть дату бронювання</p>
        )}
      </div>

      {modal === 'booking' && selectedDate && user && (
        <div className={styles.modalOverlay}>
          <BookingModal
            userId={user.id}
            courtId={locationId}
            selectedDate={selectedDate}
            onClose={() => setModal(null)}
            onBookingSuccess={handleBookingSuccess}
          />
        </div>
      )}

      {modal === 'unauth' && (
        <div className={styles.modalOverlay}>
          <UnauthModal onClose={() => setModal(null)} />
        </div>
      )}

      <button
        disabled={isPastSelectedDay || selectedDate === null}
        className={`${styles.buttonBook} ${!selectedDate ? styles.disabled : ''}`}
        onClick={handleBookClick}
      >
        Забронювати корт
      </button>
    </div>
  );
}
