import { Box } from '@mui/material';
import * as React from 'react';

const loadingStates = [
  [true, false, false], // .
  [true, true, false], // ..
  [true, true, true], // ...
];

export function Loading() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index + 1) % loadingStates.length);
    }, 500);

    return () => { clearInterval(interval); };
  }, [index]);

  return (
    <Box
      display={'flex'}
      justifyItems="center"
      color={'#ffffff'}
      fontSize="3xl"
      className="flex items-center text-white text-3xl"
    >
      <Box>·</Box>
      <Box visibility={index > 0 ? 'visible' : 'hidden'}>·</Box>
      <Box visibility={index === 2 ? 'visible' : 'hidden'}>·</Box>
    </Box>
  );
}
