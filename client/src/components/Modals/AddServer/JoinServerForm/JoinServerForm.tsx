import { FC } from 'react';
import styles from './JoinServerForm.module.scss';

type JoinServerFormProps = {
  onBack: () => void;
};

const JoinServerForm: FC<JoinServerFormProps> = ({ onBack }) => {
  return (
    <div className={styles.FormContainer}>
      {/* TODO: Extract this form into a reusable component */}
      <form className={styles.Form}>
        <div className={styles.FormInputContainer}>
          <label htmlFor="joinServerId">Server id</label>
          <input id="joinServerId" name="joinServerId" placeholder="Server id..." />
        </div>
      </form>
      <div className={styles.ButtonsContainer}>
        <button className={styles.BackButton} onClick={onBack}>
          Back
        </button>
        <button className={styles.JoinButton} onClick={onBack}>
          Join
        </button>
      </div>
    </div>
  );
};

export default JoinServerForm;
