import { Dispatch, SetStateAction, FC } from 'react';
import { useAppSelector } from '@redux/store';
import { selectUnreadByGuilds } from '@redux/slices/sessionSlice';
import useGuildMutate from './hooks/useGuildMutate';
import useDirectMutate from './hooks/useDirectMutate';
import { GuildDto } from '@shared/types/dto/Guild';
import GuildListElement from '@components/Sidebar/GuildList/GuildListElement';
import Icon from '@shared/components/Icon';
import { SidebarState } from '../Sidebar';
import styles from './GuildList.module.scss';

type GuildListProps = {
  guilds: Array<GuildDto>;
  setSidebar: Dispatch<SetStateAction<SidebarState>>;
};

const GuildList: FC<GuildListProps> = ({ guilds, setSidebar }) => {
  const activeTabId = useAppSelector((state) => state.session.activeTabId);
  const unreadGuilds = useAppSelector(selectUnreadByGuilds);
  const guildMutate = useGuildMutate({ setSidebar });
  const directMutate = useDirectMutate({ setSidebar });

  const onDirectMessagesClick = () => {
    directMutate.mutate();
  };

  const onGuildClick = (guild: GuildDto) => {
    guildMutate.mutate(guild.guildId);
  };

  const onAddServerClick = () => {
    console.log('create server');
  };

  return (
    <div className={styles.ListContainer}>
      <GuildListElement
        isActive={activeTabId == 'direct'}
        isUnread={unreadGuilds['direct'] !== undefined}
        onClick={() => onDirectMessagesClick()}
        image="src/assets/raccoon_creppy.png"
        name="Direct Messages"
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
          />
        );
      })}
      <GuildListElement image={<Icon name="circle-plus" />} onClick={() => onAddServerClick()} name="Add server" />
    </div>
  );
};

export default GuildList;
