import { ReactNode, useEffect } from 'react';
import { useAppDispatch } from '@redux/store';
import { openInviteToServerModal } from '@redux/slices/modalSlice';
import { GuildDto } from '@shared/types/dto/Guild';
import Icon from '@shared/components/Icon';
import styles from './OptionsMenu.module.scss';

type OptionMenuProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  headerRef: React.RefObject<HTMLDivElement | null>;
  guild: GuildDto;
};

interface OptionMenuElementProps extends React.HTMLAttributes<HTMLLIElement> {
  label: string;
  children: ReactNode;
}

const OptionsMenu: React.FC<OptionMenuProps> = ({ isOpen, setIsOpen, headerRef, guild }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef?.current && !headerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  if (!isOpen) return;

  const OptionsElement: React.FC<OptionMenuElementProps> = ({ label, children, ...props }) => (
    <li {...props}>
      <span>{label}</span>
      {children}
    </li>
  );

  const handleInviteToServer = () => {
    dispatch(openInviteToServerModal({ guildId: guild.guildId }));
  };

  return (
    <ul data-testid="guild-sidebar-options" onClick={(e) => e.stopPropagation()} className={styles.OptionsMenuList}>
      <OptionsElement onClick={handleInviteToServer} label="Invite users">
        <Icon name="user-plus" className={styles.InviteUsersIcon} />
      </OptionsElement>
      <OptionsElement label="Server settings">
        <Icon name="gear" />
      </OptionsElement>
      {/* <li>Create channel</li>
        <li>Create category</li> */}
      <OptionsElement label="Leave server" className={styles.LeaveServer}>
        <Icon name="right-from-bracket" />
      </OptionsElement>
    </ul>
  );
};

export default OptionsMenu;
