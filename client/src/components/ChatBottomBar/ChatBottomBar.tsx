import { MouseEventHandler, useRef } from 'react';
import styles from './ChatBottomBar.module.scss';

const ChatBottomBar = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const onInputParentFocus : MouseEventHandler = (e) => {
        inputRef.current && inputRef.current.focus();
    }

    return (
        <div className={styles.ChatBottomBar}>
            <div onClick={onInputParentFocus} className={styles.InputContainer}>
                <input ref={inputRef} className={styles.Input} type="text" placeholder="Message"/>
            </div>


        </div>
    )
}

export default ChatBottomBar;