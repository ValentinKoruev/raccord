import { FC } from 'react';
import { useAppSelector } from '@redux/store';
import { GuildDto } from '@shared/types/dto/Guild';
import DirectSidebar from './DirectSidebar';
import GuildSidebar from './GuildSidebar';
import GuildList from './GuildList';
import styles from './Sidebar.module.scss';

export type SidebarProps = {
  guilds: Array<GuildDto>;
};

const Sidebar: FC<SidebarProps> = ({ guilds }) => {
  const activeTabId = useAppSelector((state) => state.session.activeTabId);

  const renderSidebar = () => {
    if (activeTabId && activeTabId !== 'direct') return <GuildSidebar guildId={activeTabId} />;

    return <DirectSidebar />;
  };

  return (
    <div className={styles.Sidebar}>
      <GuildList guilds={guilds} />
      {renderSidebar()}
    </div>
  );
};

export default Sidebar;
