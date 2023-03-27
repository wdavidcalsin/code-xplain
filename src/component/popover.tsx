import { Box, Stack, Typography } from '@mui/material';
import interact from 'interactjs';
import * as React from 'react';
import { useSnapshot } from 'valtio';
import {
  handleChangeLanguage,
  storeOpenai,
} from '../store/valtio/store-response-valtio';
import { Loading } from './loading';

interface IPropsPopover {
  eventButton: MouseEvent;
  setShowButton: (showButton: boolean) => void;
}

const PopoverContent: React.FC<IPropsPopover> = ({
  eventButton,
  setShowButton,
}) => {
  const popoverRef = React.useRef<HTMLElement>(null);

  const { textResult, streaming } = useSnapshot(storeOpenai);

  const handleDocumentPopoverClick = (event: MouseEvent) => {
    if (
      popoverRef.current != null &&
      event.target instanceof Node &&
      !popoverRef.current.contains(event.target)
    ) {
      setShowButton(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleDocumentPopoverClick);

    const position = { x: 0, y: 0 };
    interact('.draggable').draggable({
      listeners: {
        start(event) {
          console.log(event.type, event.target);
        },
        move(event) {
          position.x += Number(event.dx);
          position.y += Number(event.dy);

          event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
        },
      },
    });

    return () => {
      document.removeEventListener('mousedown', handleDocumentPopoverClick);
    };
  }, []);

  return (
    <Box
      className="draggable"
      ref={popoverRef}
      style={{
        position: 'absolute',
        zIndex: '100',
        left: `${eventButton.clientX + window.scrollX}px`,
        top: `${eventButton.clientY + window.scrollY}px`,
      }}
      sx={{
        width: '460px',
        bgcolor: 'black',
        padding: '.5rem',
        borderRadius: '1rem',
        border: 1,
        borderColor: '#333333',
      }}
    >
      <Stack
        sx={{
          paddingX: '.75rem',
          paddingY: '.65rem',
          bgcolor: '#171717',
          borderRadius: '.75rem',
          border: 1,
          borderColor: '#2E2E2E',
        }}
        spacing=".5rem"
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', fontSize: '.95rem' }}
          >
            Code Xplain
          </Typography>
          <select
            onChange={handleChangeLanguage}
            style={{
              borderRadius: '.5rem',
              border: 'none',
              background: '#1D1D1D',
              padding: '.2rem .4rem .2rem .4rem',
              fontSize: '.85rem',
              fontWeight: 'normal',
            }}
          >
            <option value={'spanish'}>
              <Typography variant="body2">Spanish</Typography>
            </option>
            <option value={'english'}>
              <Typography variant="body2">English</Typography>
            </option>
          </select>
        </Box>
        <Box
          sx={{
            bgcolor: '#1D1D1D',
            borderRadius: '.65rem',
            padding: '.65rem',
          }}
        >
          <Typography
            variant="body2"
            sx={{ lineHeight: '1.8', fontSize: '.9rem', fontWeight: 'normal' }}
          >
            {streaming ? <Loading /> : textResult}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default PopoverContent;
