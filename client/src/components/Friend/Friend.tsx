import styles from './Friend.module.scss';

export type FriendProps = {
    image: string,
    name: string
}

const Friend = ({image, name} : FriendProps) => {

    return (
        <div className={styles.Friend}>
            {/* TODO: create a pfp component */}
            <div className={styles.ImageWrapper}>
                <img className={styles.Image} src={image} alt={`${name} (pfp)`} />
            </div>
            <div className={styles.FriendName}>
                <span>{name}</span>
            </div>
        </div>
    );  
}

export default Friend;