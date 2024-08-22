import styles from './Message.module.scss';
import { formatRelative, format } from 'date-fns';

export type MessageProps = {
    name: string,
    image: string,
    content: string,
    detailed: boolean,
    date: Date,
    nameColor?: string
}

const Message = ({name, image, content, detailed, date, nameColor} : MessageProps) => {

    return (
        <div className={`${styles.Message} ${detailed ? styles.Detailed : ''}`}>
        {
            detailed ? 
            <div className={styles.ImageWrapper}>
                <img className={styles.Image} src={image} alt={`${name} (pfp)`} />
            </div>
            :
            <div className={styles.ImageWhitespace}>
                <span className={styles.Time}>{format(date, "HH:mm")}</span>
            </div>
        }
            <div className={styles.Content}>
                {
                detailed &&
                <div className={styles.MessageHeader}>
                    <span style={{color: nameColor}} className={styles.Name}>{name}</span>
                    <span className={styles.Date}>{formatRelative(date, new Date())}</span>
                </div>
                }
                <div>
                    {content}
                </div>
            </div>

        </div>
    )
}

export default Message;