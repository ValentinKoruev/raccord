import { useState } from 'react';
import DirectSidebar from './DirectSidebar';
import GuildSidebar from './GuildSidebar';
import GuildList from './GuildList';
import styles from './Sidebar.module.scss';

export type SidebarState = {
  type: 'direct' | 'guild';
  guildId?: number;
};

const initialState: SidebarState = {
  type: 'guild',
};

const Sidebar = () => {
  const [sidebar, setSidebar] = useState<SidebarState>(initialState);

  const renderSidebar = (sidebar: SidebarState) => {
    if (sidebar.type == 'direct') return <DirectSidebar />;

    if (sidebar.type == 'guild') return <GuildSidebar name="Pamela" />;

    return null;
  };

  return (
    <div className={styles.Sidebar}>
      <GuildList />
      {renderSidebar(sidebar)}
    </div>
  );
};

export default Sidebar;
