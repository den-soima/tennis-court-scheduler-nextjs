import { styled } from '@mui/material/styles';
import { DigitalClock } from '@mui/x-date-pickers';

export const StyledClock = styled(DigitalClock)({
  width: 80,
  height: 250,
  overflowY: 'auto',
  '& .MuiDigitalClockItem-root': {
    padding: '4px 8px',
    fontSize: '0.9rem',
  },
  '& .Mui-selected': {
    backgroundColor: '#f9cb8a',
    borderRadius: '16px',
    color: 'black',
  },
  '& .MuiButtonBase-root:hover': {
    backgroundColor: '#f9cb8a',
    cursor: 'pointer',
    color: 'black',
    borderRadius: '16px',
  },
});
