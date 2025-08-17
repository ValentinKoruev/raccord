import { FC } from 'react';
import styles from './CreateServerForm.module.scss';

type CreateServerFormProps = {
  onBack: () => void;
};

const CreateServerForm: FC<CreateServerFormProps> = ({ onBack }) => {
  return (
    <div className={styles.FormContainer}>
      {/* TODO: Extract this form into a reusable component */}
      <form className={styles.Form}>
        <div className={styles.FormInputContainer}>
          <label htmlFor="createServerName">Server Name</label>
          <input id="createServerName" name="createServerName" placeholder="Server name..." />
        </div>
        {/* TODO: temporary, add a file select and upload to server */}
        <div className={styles.FormInputContainer}>
          <label htmlFor="createServerIcon">Server Icon</label>
          <input id="createServerIcon" name="serverIcon" placeholder="Server icon..." />
        </div>
      </form>
      <div className={styles.ButtonsContainer}>
        <button className={styles.BackButton} onClick={onBack}>
          Back
        </button>
        <button className={styles.CreateButton} onClick={onBack}>
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateServerForm;
