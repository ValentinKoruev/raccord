import { MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { closeModal } from '@redux/slices/modalSlice';
import AddServerModal from './AddServer';
import InviteToServerModal from './InviteToServer';
import styles from './BaseModal.module.scss';
import CreateChannelModal from './CreateChannel';

export const BaseModal = () => {
  const dispatch = useAppDispatch();
  const { type, props } = useAppSelector((state) => state.modal);

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleOutsideClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      dispatch(closeModal());
    }
  };

  if (!type) return null;

  const portalRoot = document.getElementById('portal-root');
  if (!portalRoot) return null;

  let content;
  switch (type) {
    case 'addServer':
      content = <AddServerModal {...props} />;
      break;
    case 'inviteToServer':
      content = <InviteToServerModal {...props} />;
      break;
    case 'createChannel':
      content = <CreateChannelModal {...props} />;
      break;
    default:
      return null;
  }

  return createPortal(
    <div onClick={handleOutsideClick} className={styles.ModalContainer}>
      {content}
    </div>,
    portalRoot,
  );
};

export default BaseModal;
