import { TimeView } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';

const isWeekday = (d: Dayjs) => {
  const day = d.day(); // 0=Sun, 1=Mon, ... 6=Sat
  return day >= 1 && day <= 5;
};

const isWithinBlockedInterval = (hour: number, minute: number, view: TimeView) => {
  // Block interval: [08:30, 14:00)
  const startHour = 8;
  const startMinute = 30;
  const endHour = 14;
  const endMinute = 0;

  const afterOrEqualStart = hour > startHour || (hour === startHour && minute >= startMinute);
  const beforeEnd = hour < endHour || (hour === endHour && minute < endMinute);

  if (view === 'hours') {
    // Disable any hour that overlaps 08:30-14:00 inclusive of partial hours
    return (hour === startHour && minute >= startMinute) || (hour > startHour && hour < endHour);
  }

  if (view === 'minutes') {
    return afterOrEqualStart && beforeEnd;
  }

  return false;
};

export const disableStarts = (bookedStarts: Dayjs[], bookedEnds: Dayjs[], selectedDate?: Dayjs) => {
  return (value: Dayjs, view: TimeView) => {
    const hour = value.hour();
    const minute = value.minute();

    // Apply weekday block based on the selected date if provided, otherwise fallback to current value's day
    const dateForWeekday = selectedDate ?? value;
    if (isWeekday(dateForWeekday) && isWithinBlockedInterval(hour, minute, view)) {
      return true;
    }

    return bookedStarts.some((start, index) => {
      const end = bookedEnds[index];

      const startHour = start.hour();
      const startMinute = start.minute();
      const endHour = end.hour();
      const endMinute = end.minute();

      const isAfterOrEqualStart = hour > startHour || (hour === startHour && minute >= startMinute);

      const isBeforeEnd = hour < endHour || (hour === endHour && minute < endMinute);

      const isInsideBookedRange = isAfterOrEqualStart && isBeforeEnd;

      if (isInsideBookedRange) {
        return true;
      }

      if (view === 'hours') {
        return (
          (hour === startHour && minute >= startMinute) ||
          (hour === endHour && minute < endMinute) ||
          (hour > startHour && hour < endHour)
        );
      }

      if (view === 'minutes') {
        return isInsideBookedRange;
      }

      return false;
    });
  };
};

export const disableEnds = (bookedStarts: Dayjs[], bookedEnds: Dayjs[], selectedDate?: Dayjs) => {
  return (value: Dayjs, view: TimeView) => {
    const hour = value.hour();
    const minute = value.minute();

    const dateForWeekday = selectedDate ?? value;
    if (isWeekday(dateForWeekday) && isWithinBlockedInterval(hour, minute, view)) {
      return true;
    }

    return bookedStarts.some((start, index) => {
      const end = bookedEnds[index];

      const startHour = start.hour();
      const startMinute = start.minute();
      const endHour = end.hour();
      const endMinute = end.minute();

      const isSameAsStart = hour === startHour && minute === startMinute;

      if (isSameAsStart) {
        return false;
      }

      const isAfterStart = hour > startHour || (hour === startHour && minute > startMinute);
      const isBeforeOrEqualEnd = hour < endHour || (hour === endHour && minute <= endMinute);

      const isInsideBookedRange = isAfterStart && isBeforeOrEqualEnd;

      if (view === 'hours') {
        return (
          (hour === startHour && minute > startMinute) ||
          (hour === endHour && minute <= endMinute) ||
          (hour > startHour && hour < endHour)
        );
      }

      if (view === 'minutes') {
        return isInsideBookedRange;
      }

      return false;
    });
  };
};
