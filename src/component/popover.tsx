import { Box } from "@mui/material";
import * as React from "react";

interface IPropsPopover {
  eventButton: MouseEvent;
  setShowButton: (showButton: boolean) => void;
}

const PopoverContent: React.FC<IPropsPopover> = ({
  eventButton,
  setShowButton,
}) => {
  const popoverRef = React.useRef<HTMLElement>(null);

  const handleDocumentPopoverClick = (event: MouseEvent) => {
    if (
      popoverRef.current &&
      event.target instanceof Node &&
      !popoverRef.current.contains(event.target)
    ) {
      setShowButton(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleDocumentPopoverClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentPopoverClick);
    };
  }, []);

  return (
    <Box
      ref={popoverRef}
      style={{
        position: "absolute",
        zIndex: "100",
        left: `${eventButton.clientX + window.scrollX}px`,
        top: `${eventButton.clientY + window.scrollY}px`,
      }}
      sx={{
        width: "10rem",
        bgcolor: "blue",
        padding: "2rem",
        borderRadius: ".5rem",
      }}
    >
      Hello world
    </Box>
  );
};

export default PopoverContent;
