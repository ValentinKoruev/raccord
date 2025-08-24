import { FC, useState } from 'react';
import Icon from '@shared/components/Icon';
import CreateServerForm from './CreateServerForm';
import JoinServerForm from './JoinServerForm';
import styles from './AddServerModal.module.scss';

type AddServerModalProps = {};

type AddServerState = 'base' | 'join' | 'create';

const AddServerModal: FC<AddServerModalProps> = () => {
  const [state, setState] = useState<AddServerState>('base');

  const renderHeaderText = (state: AddServerState) => {
    if (state === 'create') return 'Create a server';

    if (state === 'join') return 'Join a server';

    return 'Add a server';
  };

  const handleCreate = () => {
    setState('create');
  };
  const handleJoin = () => {
    setState('join');
  };

  const handleBase = () => {
    setState('base');
  };

  // TODO: Can reuse styles between forms, but this has to be done after the form reusable component, not sure how that would work
  let content;
  switch (state) {
    case 'create': {
      content = <CreateServerForm onBack={handleBase} />;
      break;
    }
    case 'join': {
      content = <JoinServerForm onBack={handleBase} />;
      break;
    }
    // TODO: Maybe extract this to a separate component?
    default: {
      content = (
        <div className={styles.ActionOptionsList}>
          <button onClick={handleCreate} className={styles.ActionOption}>
            <span>Create server</span>
            <Icon className={styles.ActionIcon} name="arrow-right" />
          </button>
          <div className={styles.Seperator}>
            <div className={styles.SeperatorLine}></div>
            <p className={styles.SeperatorContent}>or</p>
            <div className={styles.SeperatorLine}></div>
          </div>
          <button onClick={handleJoin} className={styles.ActionOption}>
            <span>Join server</span>
            <Icon className={styles.ActionIcon} name="arrow-right" />
          </button>
        </div>
      );
      break;
    }
  }

  return (
    <div className={styles.AddServerContainer}>
      <div className={styles.Header}>{renderHeaderText(state)}</div>

      {content}
    </div>
  );
};

export default AddServerModal;
