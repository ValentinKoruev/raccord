import { ReactNode, useEffect } from 'react';
import { AxiosError, isAxiosError } from 'axios';
import { useAppDispatch } from '@redux/store';
import { useQueryClient } from '@tanstack/react-query';
import { closeModal, openCreateChannelModal, openInviteToServerModal } from '@redux/slices/modalSlice';
import { clearChat } from '@redux/slices/chatSlice';
import { clearActiveChannel } from '@redux/slices/sessionSlice';
import apiQueries from '@queries/api';
import { NOT_FOUND, UNAUTHORIZED } from '@queries/statusCodes';
import { GuildDto } from '@shared/types/dto/Guild';
import Icon from '@shared/components/Icon';
import styles from './OptionsMenu.module.scss';
import OwnerOnly from '@components/Auth/OwnerOnly/OwnerOnly';

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
  const queryClient = useQueryClient();
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

  const handleChannelCreate = () => {
    dispatch(openCreateChannelModal({ guildId: guild.guildId }));
  };

  const handleLeaveServer = async () => {
    try {
      await apiQueries.guildQueries.leaveGuild({
        guildId: guild.guildId,
      });

      queryClient.invalidateQueries({
        queryKey: ['userguilds'],
      });

      dispatch(clearActiveChannel());
      dispatch(clearChat());
      dispatch(closeModal());
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.status == UNAUTHORIZED) {
          console.log('Not authorised');
          return;
        }
        if (axiosError.status == NOT_FOUND) {
          console.log('Not found');
          return;
        }
      }

      throw new Error('Unexpected error occured: ' + error);
    }
  };

  return (
    <ul data-testid="guild-sidebar-options" onClick={(e) => e.stopPropagation()} className={styles.OptionsMenuList}>
      <OptionsElement onClick={handleInviteToServer} label="Invite users">
        <Icon name="user-plus" className={styles.InviteUsersIcon} />
      </OptionsElement>
      <OwnerOnly ownerId={guild.ownerId}>
        <OptionsElement label="Server settings">
          <Icon name="gear" />
        </OptionsElement>
        <OptionsElement onClick={handleChannelCreate} label="Create channel">
          <Icon name="circle-plus" />
        </OptionsElement>
      </OwnerOnly>
      <OptionsElement onClick={handleLeaveServer} label="Leave server" className={styles.LeaveServer}>
        <Icon name="right-from-bracket" />
      </OptionsElement>
    </ul>
  );
};

export default OptionsMenu;
