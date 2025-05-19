'use client';

import styles from './BookingCalendar.module.scss';
import dayjs from 'dayjs';
import { Booking } from '../../types/Booking';
import { getArrowLeftIcon, getArrowRightIcon } from '@/lib/getImages';
import Image from 'next/image';

type Props = {
  bookings: Booking[];
  selectedDay: number | null;
  setSelectedDay: (day: number | null) => void;
  currentMonth: dayjs.Dayjs;
  setCurrentMonth: (month: dayjs.Dayjs) => void;
};

export default function BookingCalendar({
  bookings,
  selectedDay,
  setSelectedDay,
  currentMonth,
  setCurrentMonth,
}: Props) {
  const today = dayjs();
  const daysInMonth = currentMonth.daysInMonth();
  const firstDayOfMonth = currentMonth.startOf('month').day();
  const firstDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarDays = [...Array(firstDayOffset).fill(null), ...daysArray];
  const capitalizeFirstChar = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const formattedDate = capitalizeFirstChar(currentMonth.format('MMMM YYYY'));
  const twoWeeksFromNow = today.add(14, 'day');

  const relevantBookings = bookings.filter((b) => dayjs(b.startTime).isAfter(today));
  const pastBookings = bookings.filter((b) => dayjs(b.startTime).isBefore(today, 'day'));

  const renderedDays = calendarDays.map((day, index) => {
    const dateObj = day ? currentMonth.date(day).endOf('day') : null;
    const isPastDate = dateObj ? dateObj.isBefore(today, 'day') : false;
    const isAfterTwoWeeks = dateObj ? dateObj.isAfter(twoWeeksFromNow, 'day') : false;
    const isWeekend = index % 7 === 5 || index % 7 === 6;

    const hasRelevantBooking =
      day &&
      relevantBookings.some(
        (b) => dayjs(b.startTime).date() === day && dayjs(b.startTime).isSame(currentMonth, 'month')
      );

    const hasPastBooking =
      day &&
      pastBookings.some(
        (b) => dayjs(b.startTime).date() === day && dayjs(b.startTime).isSame(currentMonth, 'month')
      );

    const isToday =
      day === today.date() && currentMonth.isSame(today, 'month') && day !== selectedDay;

    const isSelected = day === selectedDay && selectedDay !== null;

    const dayClasses = [
      styles.day,
      day === null ? styles.empty : isWeekend ? styles.weekendTile : styles.workdayTile,
      isPastDate ? styles.pastDay : '',
      isToday ? styles.currentDay : '',
      hasPastBooking ? styles.hasPastBooking : '',
      hasRelevantBooking ? styles.hasRelevantBooking : '',
      isSelected ? styles.selectedDay : '',
      isAfterTwoWeeks ? styles.disabledDay : '',
    ]
      .filter(Boolean)
      .join(' ');

    return {
      day,
      index,
      className: dayClasses,
      isAfterTwoWeeks,
      isPastDate,
    };
  });

  const handlePrevMonthClick = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
    setSelectedDay(null);
  };

  const handleNextMonthClick = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
    setSelectedDay(null);
  };

  const handleDayClick = (day: number | null) => {
    setSelectedDay(day === selectedDay ? null : day);
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarTop}>
        <button className={styles.buttonArrow} onClick={handlePrevMonthClick}>
          <Image
            src={getArrowLeftIcon()}
            alt="Left"
            className={styles.arrow}
            width={16}
            height={16}
          />
        </button>

        <h3 className={styles.title}>{formattedDate}</h3>

        <button className={styles.buttonArrow} onClick={handleNextMonthClick}>
          <Image
            src={getArrowRightIcon()}
            alt="Right"
            className={styles.arrow}
            width={16}
            height={16}
          />
        </button>
      </div>

      <div className={styles.weekdays}>
        <div className={styles.workday}>Пн</div>
        <div className={styles.workday}>Вт</div>
        <div className={styles.workday}>Ср</div>
        <div className={styles.workday}>Чт</div>
        <div className={styles.workday}>Пт</div>
        <div className={styles.weekend}>Сб</div>
        <div className={styles.weekend}>Нд</div>
      </div>

      <div className={styles.days}>
        {renderedDays.map(({ day, index, className, isAfterTwoWeeks }) => (
          <div
            key={index}
            className={className}
            onClick={() => {
              if (day !== null && !isAfterTwoWeeks) {
                handleDayClick(day);
              }
            }}
          >
            {day || ''}
          </div>
        ))}
      </div>
    </div>
  );
}
