import { MouseEventHandler, useEffect, useRef } from 'react';
import { getSocket } from 'src/socket';
import styles from './ChatBottomBar.module.scss';
import { useAppSelector } from 'src/redux/store';

const ChatBottomBar = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const activeChannelId = useAppSelector((state) => state.session.activeChannelId);
  const activeChannelIdRef = useRef(activeChannelId); // to be used for socketio callback fn
  const onInputParentFocus: MouseEventHandler = () => {
    inputRef.current && inputRef.current.focus();
  };

  const onKeyDown = (e: KeyboardEvent): void => {
    const inputCurrent = inputRef.current;

    if (!inputCurrent) return;

    if (e.key == 'Enter') {
      inputCurrent.focus();

      if (inputCurrent.value.trim().length == 0) return;

      getSocket().emit('message', {
        content: inputCurrent.value,
        channelId: activeChannelIdRef.current,
      });

      inputCurrent.value = '';
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    activeChannelIdRef.current = activeChannelId;
  }, [activeChannelId]);

  return (
    <div className={styles.ChatBottomBar}>
      <div onClick={onInputParentFocus} className={styles.InputContainer}>
        <input ref={inputRef} className={styles.Input} type="text" placeholder="Message" />
      </div>
    </div>
  );
};

export default ChatBottomBar;
