import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { selectUnreadByGuilds, setTabDirect, setTabGuild } from '@redux/slices/sessionSlice';
import { openAddServerModal } from '@redux/slices/modalSlice';
import { GuildDto } from '@shared/types/dto/Guild';
import GuildListElement from '@components/Sidebar/GuildList/GuildListElement';
import Icon from '@components/UI/Icon';
import styles from './GuildList.module.scss';

type GuildListProps = {
  guilds: Array<GuildDto>;
};

const GuildList: FC<GuildListProps> = ({ guilds }) => {
  const dispatch = useAppDispatch();
  const activeTabId = useAppSelector((state) => state.session.activeTabId);
  const unreadGuilds = useAppSelector(selectUnreadByGuilds);
  const isAddServerOpen = useAppSelector((state) => state.modal.type == 'addServer');

  const onDirectMessagesClick = () => {
    dispatch(setTabDirect());
  };

  const onGuildClick = (guild: GuildDto) => {
    dispatch(setTabGuild(guild.guildId));
  };

  const onAddServerClick = () => {
    dispatch(openAddServerModal({}));
  };

  return (
    <div className={styles.ListContainer}>
      <GuildListElement
        isActive={activeTabId == 'direct'}
        isUnread={unreadGuilds['direct'] !== undefined}
        onClick={() => onDirectMessagesClick()}
        image="src/assets/raccoon_creppy.png"
        name="Direct Messages"
        testId="direct"
      />
      {guilds.map((guild, index) => {
        return (
          <GuildListElement
            onClick={() => onGuildClick(guild)}
            key={`guild-${index}`}
            name={`${guild.guildName}`}
            guildId={guild.guildId}
            image={`${guild.icon}`}
            isActive={activeTabId == guild.guildId}
            isUnread={unreadGuilds[guild.guildId] !== undefined}
            testId={`${guild.guildId}`}
          />
        );
      })}
      <GuildListElement
        image={<Icon name="circle-plus" />}
        onClick={() => onAddServerClick()}
        name="Add server"
        isActive={isAddServerOpen}
        testId="addServer"
      />
    </div>
  );
};

export default GuildList;
