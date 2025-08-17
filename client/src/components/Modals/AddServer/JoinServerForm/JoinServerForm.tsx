import { useQueryClient } from '@tanstack/react-query';
import { FC, useState, MouseEvent } from 'react';
import { AxiosError, isAxiosError } from 'axios';
import { useAppDispatch } from '@redux/store';
import { closeModal } from '@redux/slices/modalSlice';
import apiQueries from '@queries/api';
import styles from './JoinServerForm.module.scss';

type JoinServerFormProps = {
  onBack: () => void;
};

type JoinServerFormData = {
  joinServerId: string;
};

const JoinServerForm: FC<JoinServerFormProps> = ({ onBack }) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<JoinServerFormData>({ joinServerId: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleJoin = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!form.joinServerId) {
      console.error('Guild id missing');
      return;
    }

    try {
      const response = await apiQueries.guildQueries.join({
        guildId: form.joinServerId,
      });

      queryClient.invalidateQueries({
        queryKey: ['userguilds'],
      });

      dispatch(closeModal());
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError;
      }

      throw new Error('Unexpecter Error: ' + error);
    }
  };
  return (
    <div className={styles.FormContainer}>
      {/* TODO: Extract this form into a reusable component */}
      <form className={styles.Form}>
        <div className={styles.FormInputContainer}>
          <label htmlFor="joinServerId">Server id</label>
          <input
            id="joinServerId"
            name="joinServerId"
            placeholder="Server id..."
            value={form.joinServerId}
            onChange={handleChange}
          />
        </div>
      </form>
      <div className={styles.ButtonsContainer}>
        <button className={styles.BackButton} onClick={onBack}>
          Back
        </button>
        <button className={styles.JoinButton} onClick={handleJoin}>
          Join
        </button>
      </div>
    </div>
  );
};

export default JoinServerForm;
