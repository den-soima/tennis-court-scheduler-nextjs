'use client';

import styles from './BookingModal.module.scss';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from 'react';
import { BookingServer, CreateBooking } from '../../types/Booking';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { convertBookingToDayjs } from '@/lib/convertBookings';
import { getCloseMenuIcon } from '@/lib/getImages';
import Image from 'next/image';
import { disableEnds, disableStarts } from '@/lib/timeFunctions';
import { getData, postData } from '@/lib/fetchData';
import { StyledClock } from '@/lib/muiStyles';
import Loader from '../Loader/Loader';

dayjs.extend(utc);

type Props = {
  userName: string;
  userId: string;
  courtId: string;
  selectedDate: Dayjs;
  onClose: () => void;
  onBookingSuccess?: () => void;
};

export default function BookingModal({
  userName,
  userId,
  courtId,
  selectedDate,
  onClose,
  onBookingSuccess,
}: Props) {
  const nowIso = dayjs().minute(0).format('YYYY-MM-DDTHH:mm');
  console.log('Current ISO time: ', nowIso);
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs(nowIso));
  //  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs('2025-06-24T08:00'));
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs(nowIso).add(1, 'hour'));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bookedStarts, setBookedStarts] = useState<Dayjs[]>([]);
  const [bookedEnds, setBookedEnds] = useState<Dayjs[]>([]);
  const [formError, setFormError] = useState<string>('');

  console.log('Current date: ', dayjs());
  console.log('Booked ends: ', bookedEnds);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedDate = selectedDate.format('YYYY-MM-DD');

        const data = await getData<BookingServer[]>(`/api/courts/${courtId}/${formattedDate}`);

        if (Array.isArray(data) && data.length > 0) {
          const bookingsWithDayjs = data.map(convertBookingToDayjs);

          const starts = bookingsWithDayjs.map((b) => b.startTime);
          const ends = bookingsWithDayjs.map((b) => b.endTime);

          setBookedStarts(starts);
          setBookedEnds(ends);
        } else {
          console.info('No bookings found for the selected date and court');
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [courtId, selectedDate]);

  const bookCourt = async (booking: CreateBooking) => {
    try {
      setLoading(true);
      const response = await postData<BookingServer>('/api/bookings', booking);

      setTimeout(() => {
        setLoading(false);
      }, 3000);

      return response;
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
      }, 3000);

      throw new Error(
        error instanceof Error ? error.message : 'Не вдалося забронювати корт. Спробуйте ще раз'
      );
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const now = dayjs();

    const bookingStart =
      startTime &&
      dayjs(selectedDate)
        .set('hour', dayjs(startTime).hour())
        .set('minute', dayjs(startTime).minute());

    const bookingEnd =
      endTime &&
      dayjs(selectedDate).set('hour', dayjs(endTime).hour()).set('minute', dayjs(endTime).minute());

    switch (true) {
      case !startTime || !endTime:
        setFormError('Будь ласка оберіть час бронювання');
        return;

      case bookingEnd && bookingStart && !bookingEnd.isAfter(bookingStart):
        setFormError('Час завершення повинен бути пізніше');
        return;

      case bookingStart && bookingStart.isBefore(now):
        setFormError('Неможливо забронювати на минулий час');
        return;

      case bookingEnd && bookingStart && bookingEnd.diff(bookingStart, 'minute') < 60:
        setFormError('Тренування має тривати хоча б 1 годину');
        return;

      case bookingEnd && bookingStart && bookedEnds.some((v) => v > bookingStart && v < bookingEnd):
        setFormError('Бронювання накладається на існуюче');
        return;
    }

    try {
      const startDateTime = dayjs(selectedDate)
        .set('hour', dayjs(startTime).hour())
        .set('minute', dayjs(startTime).minute())
        .toISOString();

      const endDateTime = dayjs(selectedDate)
        .set('hour', dayjs(endTime).hour())
        .set('minute', dayjs(endTime).minute())
        .toISOString();

      const date = dayjs(selectedDate).format('YYYY-MM-DD');

      const booking: CreateBooking = {
        userName,
        userId,
        courtId,
        date,
        startTime: startDateTime,
        endTime: endDateTime,
      };

      await bookCourt(booking);

      setError(null);
      setStartTime(null);
      setEndTime(null);

      if (onBookingSuccess) onBookingSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не вдалося забронювати корт');
    }
  };

  const handleBackClick = () => {
    setStartTime(null);
    setEndTime(null);
    onClose();
  };

  const startTimeOnChange = (newValue: Dayjs | null) => {
    if (newValue && endTime && endTime.diff(newValue, 'hour', true) < 1) {
      setEndTime(newValue.add(1, 'hour'));
    }
    setStartTime(newValue);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.buttonContainer}>
        <button onClick={handleBackClick} className={styles.buttonClose}>
          <Image src={getCloseMenuIcon()} alt="Close" width={24} height={24} />
        </button>
      </div>

      {error ? (
        <p className={styles.description}>{error}</p>
      ) : (
        <div className={styles.container}>
          <h3 className={styles.title}>Бронювання</h3>

          <p className={styles.date}>{dayjs(selectedDate).format('D MMMM YYYY')}</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.clockWrapper}>
              <div className={styles.clock}>
                <label className={styles.label}>Початок:</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StyledClock
                    ampm={false}
                    value={startTime}
                    onChange={startTimeOnChange}
                    minTime={dayjs().set('hour', 4).set('minute', 30)}
                    maxTime={dayjs().set('hour', 22).set('minute', 30)}
                    shouldDisableTime={disableStarts(bookedStarts, bookedEnds)}
                  />
                </LocalizationProvider>
              </div>

              <div className={styles.clock}>
                <label className={styles.label}>Кінець:</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StyledClock
                    ampm={false}
                    value={endTime}
                    onChange={(newValue) => setEndTime(newValue)}
                    minTime={dayjs().set('hour', 5).set('minute', 0)}
                    maxTime={dayjs().set('hour', 23).set('minute', 0)}
                    shouldDisableTime={disableEnds(bookedStarts, bookedEnds)}
                  />
                </LocalizationProvider>
              </div>
            </div>

            <div className={styles.buttonWrapper}>
              {formError && <p className={styles.formError}>{formError}</p>}

              <button
                className={`${styles.button} ${loading ? styles.isLoading : ''}`}
                disabled={!startTime || !endTime}
              >
                {loading ? <Loader /> : 'Підтвердити'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
