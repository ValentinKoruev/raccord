import { FC } from 'react';
import styles from './Friend.module.scss';

export type FriendProps = {
  image: string;
  name: string;
};

// TODO: refactor this for better reusablity, example usage: direct messages sidebar, guild member list, mutual friends, etc...
const Friend: FC<FriendProps> = ({ image, name }) => {
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
};

export default Friend;
