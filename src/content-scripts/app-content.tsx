import { Button } from "@mui/material";
import * as React from "react";
import "./index.css";

interface IButtonImg {
  event: MouseEvent;
}
const ButtonImg = ({ event }: IButtonImg) => {
  const floatingButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (
        floatingButtonRef.current &&
        e.target instanceof Node &&
        !floatingButtonRef.current.contains(e.target)
      ) {
        floatingButtonRef.current.remove();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <Button
      ref={floatingButtonRef}
      style={{
        position: "absolute",
        borderRadius: "50%",
        padding: "none",
        zIndex: "90",
        left: `${event.clientX + window.scrollX}px`,
        top: `${event.clientY + window.scrollY}px`,
      }}
    >
      Hello
    </Button>
  );
};

function AppContent() {
  const [selectText, setSelectText] = React.useState("");
  const [eventButton, setEventButton] = React.useState<MouseEvent>();

  React.useEffect(() => {
    const handleMouseUp = async (event: MouseEvent) => {
      const selectedText = window.getSelection()?.toString() ?? "";

      if (!selectedText) return;

      setSelectText(selectedText);

      setEventButton(event);
    };

    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selectText]);

  return eventButton ? <ButtonImg event={eventButton} /> : null;
}

export default AppContent;
