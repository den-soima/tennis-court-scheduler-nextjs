import { TimeView } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';

export const disableStarts = (bookedStarts: Dayjs[], bookedEnds: Dayjs[]) => {
  return (value: Dayjs, view: TimeView) => {
    const hour = value.hour();
    const minute = value.minute();

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
        return (hour === startHour && minute >= startMinute) || (hour === endHour && minute < endMinute) || (hour > startHour && hour < endHour);
      }

      if (view === 'minutes') {
        return isInsideBookedRange;
      }

      return false;
    });
  };
};

export const disableEnds = (bookedStarts: Dayjs[], bookedEnds: Dayjs[]) => {
  return (value: Dayjs, view: TimeView) => {
    const hour = value.hour();
    const minute = value.minute();

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
        return (hour === startHour && minute > startMinute) || (hour === endHour && minute <= endMinute) || (hour > startHour && hour < endHour);
      }

      if (view === 'minutes') {
        return isInsideBookedRange;
      }

      return false;
    });
  };
};
