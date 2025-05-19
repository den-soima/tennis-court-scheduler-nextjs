import dayjs from 'dayjs';
import styles from './BookingsTable.module.scss';
import { Booking } from '@/types/Booking';
import { User } from '@/types/User';

type Props = {
  bookings: Booking[];
  user: User | null;
};

const BookingsTable = ({ bookings, user }: Props) => {
  const sortedBookings = [...bookings].sort((a, b) => {
    const now = dayjs();

    const aStart = dayjs(a.startTime);
    const aEnd = dayjs(a.endTime);
    const bStart = dayjs(b.startTime);
    const bEnd = dayjs(b.endTime);

    const aIsOngoing = now.isAfter(aStart) && now.isBefore(aEnd);
    const bIsOngoing = now.isAfter(bStart) && now.isBefore(bEnd);

    const aIsPast = now.isAfter(aEnd);
    const bIsPast = now.isAfter(bEnd);

    if (aIsOngoing && !bIsOngoing) return -1;
    if (!aIsOngoing && bIsOngoing) return 1;

    if (!aIsPast && bIsPast) return -1;
    if (aIsPast && !bIsPast) return 1;

    return aStart.diff(bStart);
  });

  return (
    <>
      {sortedBookings.length > 0 ? (
        <ul className={styles.bookingList}>
          {sortedBookings.map((booking) => {
            const now = dayjs();
            const isOngoing =
              now.isAfter(dayjs(booking.startTime)) && now.isBefore(dayjs(booking.endTime));

            const isPast = dayjs(booking.endTime).isBefore(now);

            return (
              <li
                key={booking._id}
                className={`${styles.bookingItem} 
                  ${booking.userId === user?.id ? styles.isUser : ''}
                  ${isPast ? styles.isPast : ''}
                  ${isOngoing ? styles.bookingItem : ''}
                `}
              >
                <div className={styles.bookingInfo}>
                  <span className={styles.text}>
                    {isOngoing ? 'Зараз 🎾' : dayjs(booking.startTime).format('D/MM')}
                  </span>
                  <span className={styles.text}>
                    {dayjs(booking.startTime).format('HH:mm')} –{' '}
                    {dayjs(booking.endTime).format('HH:mm')}
                  </span>
                  <span className={styles.text}>{booking.userName}</span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={styles.bookingEmpty}>На цю дату бронювання відсутні</p>
      )}
    </>
  );
};

export default BookingsTable;
