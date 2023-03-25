import { Button, ThemeProvider } from '@mui/material';
import * as React from 'react';
import { PopoverContent } from '../component';
import {
  setSelectedText,
  setTextResult,
} from '../store/valtio/store-response-valtio';
import { theme } from '../styles';
import './index.css';

function AppContent() {
  const [selectText, setSelectText] = React.useState('');
  const [eventButton, setEventButton] = React.useState<MouseEvent>();
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [showButton, setShowButton] = React.useState(false);

  const [isShowPopover, setIsShowPopover] = React.useState(false);

  const handleMouseUp = (event: MouseEvent) => {
    const selectedText = window.getSelection()?.toString() ?? '';

    if (selectedText === '') return;

    setSelectText(selectedText);
    setEventButton(event);
    setShowButton(true);
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (
      buttonRef.current != null &&
      event.target instanceof Node &&
      !buttonRef.current.contains(event.target)
    ) {
      setShowButton(false);
    }
  };

  const handleClickButton = () => {
    setIsShowPopover(true);
    setSelectedText(selectText);
    void setTextResult();
  };

  React.useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {selectText !== '' && eventButton != null && showButton && (
        <Button
          variant="outlined"
          style={{
            position: 'absolute',
            borderRadius: '50%',
            zIndex: '90',
            left: `${eventButton.clientX + window.scrollX}px`,
            top: `${eventButton.clientY + window.scrollY}px`,
          }}
          ref={buttonRef}
          sx={{
            minWidth: '.1rem',
            width: '2.1rem',
            padding: '.1rem',
          }}
          onClick={handleClickButton}
        >
          <img
            width={'100%'}
            height="100%"
            src="https://i.postimg.cc/gjNmTL1C/logo-icon.png"
          />
        </Button>
      )}
      {isShowPopover && eventButton != null && (
        <PopoverContent
          eventButton={eventButton}
          setShowButton={setIsShowPopover}
        />
      )}
    </ThemeProvider>
  );
}

export default AppContent;
