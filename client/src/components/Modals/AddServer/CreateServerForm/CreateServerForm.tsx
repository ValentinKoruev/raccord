import { FC, useState, MouseEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError, isAxiosError } from 'axios';
import { useAppDispatch } from '@redux/store';
import { closeModal } from '@redux/slices/modalSlice';
import apiQueries from '@queries/api';
import styles from './CreateServerForm.module.scss';
import { UNAUTHORIZED } from '@queries/statusCodes';

type CreateServerFormProps = {
  onBack: () => void;
};

type CreateServerFormData = {
  createServerName: string;
  createServerIcon: string;
};

const CreateServerForm: FC<CreateServerFormProps> = ({ onBack }) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreateServerFormData>({ createServerName: '', createServerIcon: '' });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!form.createServerName || form.createServerName.trim() == '') {
      setError('Guild name is empty');
      return;
    }

    try {
      const response = await apiQueries.guildQueries.createGuild({
        guildName: form.createServerName.trim(),
        guildIcon: form.createServerIcon.trim(),
      });

      queryClient.invalidateQueries({
        queryKey: ['userguilds'],
      });

      dispatch(closeModal());
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.status == UNAUTHORIZED) {
          setError('Error: Not authenticated. Please log in again.');
        }
      }

      setError('Unexpected error occured. Please try again later.');
    }
  };

  return (
    <div className={styles.FormContainer}>
      {/* TODO: Extract this form into a reusable component */}
      <form className={styles.Form}>
        <div className={styles.FormInputContainer}>
          <label htmlFor="createServerName">Server Name</label>
          <input
            id="createServerName"
            name="createServerName"
            placeholder="Server name..."
            value={form.createServerName}
            onChange={handleChange}
          />
        </div>
        {/* TODO: temporary, add a file select and upload to server */}
        <div className={styles.FormInputContainer}>
          <label htmlFor="createServerIcon">Server Icon</label>
          <input
            id="createServerIcon"
            name="createServerIcon"
            placeholder="Server icon..."
            value={form.createServerIcon}
            onChange={handleChange}
          />
        </div>
      </form>
      {error && (
        <div role="alert" className={styles.Error}>
          {error}
        </div>
      )}
      <div className={styles.ButtonsContainer}>
        <button className={styles.BackButton} onClick={onBack}>
          Back
        </button>
        <button className={styles.CreateButton} onClick={handleCreate}>
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateServerForm;
