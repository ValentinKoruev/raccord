import { FC, useState } from 'react';
import { GuildDto } from '@shared/types/dto/Guild';
import DirectSidebar from './DirectSidebar';
import GuildSidebar from './GuildSidebar';
import GuildList from './GuildList';
import styles from './Sidebar.module.scss';

export type SidebarProps = {
  guilds: Array<GuildDto>;
};

export type SidebarState = {
  type: 'direct' | 'guild';
  currentGuild?: GuildDto;
};

const initialState: SidebarState = {
  type: 'direct',
};

const Sidebar: FC<SidebarProps> = ({ guilds }) => {
  const [sidebar, setSidebar] = useState<SidebarState>(initialState);

  const renderSidebar = (sidebar: SidebarState) => {
    if (sidebar.type == 'direct') return <DirectSidebar />;

    if (sidebar.type == 'guild' && sidebar.currentGuild) return <GuildSidebar guild={sidebar.currentGuild} />;

    return null;
  };

  return (
    <div className={styles.Sidebar}>
      <GuildList guilds={guilds} setSidebar={setSidebar} />
      {renderSidebar(sidebar)}
    </div>
  );
};

export default Sidebar;
