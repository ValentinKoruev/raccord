import { FC } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { GetChannelResponse } from '@shared/types/api';
import { UserDto } from '@shared/types/dto/User';
import styles from './FriendListTab.module.scss';

type FriendListTabProps = {
  friends: UserDto[];
  friendMutate: UseMutationResult<GetChannelResponse, Error, string, unknown>;
};

//? maybe rename this to avoid confusion between parent FriendList and this FriendListTab
const FriendListTab: FC<FriendListTabProps> = ({ friends, friendMutate }) => {
  return (
    <div className={styles.Friends}>
      <div className={styles.FriendsLabel}>All friends - {friends.length}</div>
      <ul className={styles.FriendList}>
        {friends.map((f) => (
          <li key={f.publicId} onClick={() => friendMutate.mutate(f.publicId)} className={styles.FriendListElement}>
            <div className={styles.IconWrapper}>
              <img src={f.icon} alt={`${f.name} pfp`} />
            </div>
            <span className={styles.FriendName}>{f.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendListTab;
