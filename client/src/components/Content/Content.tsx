import styles from "./Content.module.scss"
import Chat from "@components/Chat";

const Content = () => {
    return (
        <div className={styles.Content}>
            <Chat title="General"/>
        </div>
    );
}

export default Content;