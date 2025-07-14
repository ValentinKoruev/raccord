import { MouseEventHandler, useEffect, useRef } from "react";
import styles from "./ChatBottomBar.module.scss";
import { socket } from "src/socket";

const ChatBottomBar = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onInputParentFocus: MouseEventHandler = (e) => {
    inputRef.current && inputRef.current.focus();
  };

  const onKeyDown = (e: KeyboardEvent): void => {
    const inputCurrent = inputRef.current;

    if (!inputCurrent) return;

    if (e.key == "Enter") {
      inputCurrent.focus();

      if (inputCurrent.value.trim().length == 0) return;

      socket.emit("message", {
        user: "Dbeliq",
        content: inputCurrent.value,
      });

      inputCurrent.value = "";
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className={styles.ChatBottomBar}>
      <div onClick={onInputParentFocus} className={styles.InputContainer}>
        <input
          ref={inputRef}
          className={styles.Input}
          type="text"
          placeholder="Message"
        />
      </div>
    </div>
  );
};

export default ChatBottomBar;
