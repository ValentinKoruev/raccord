import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError, isAxiosError } from 'axios';
import apiQueries from '@queries/api';
import { CONFLICT, NOT_FOUND } from '@queries/statusCodes';
import styles from './AddFriendsTab.module.scss';

const AddFriendsTab = () => {
  const queryClient = useQueryClient();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>();
  const addFriendMutate = useMutation({
    mutationFn: async (friendId: string): Promise<void> => {
      const response = await apiQueries.userQueries.addFriend(friendId);
      return response.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['direct'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        const axiosError = err as AxiosError;

        if (axiosError.status == NOT_FOUND) {
          const data = axiosError.response?.data as { message?: string };

          if (data?.message) return setError(data.message);
        }

        if (axiosError.status == CONFLICT) {
          const data = axiosError.response?.data as { message?: string };

          if (data?.message) return setError(data.message);
        }
      }

      return setError('Unexpected error occured. Please try again later.');
    },
  });

  const onAddClick = async () => {
    if (value.trim() == '') return;

    addFriendMutate.mutate(value);
  };

  return (
    <div className={styles.AddFriendsContainer}>
      <div className={styles.InputContainer}>
        <input placeholder="Add friends..." value={value} onChange={(e) => setValue(e.target.value)} />
        <button onClick={onAddClick}>Add friend</button>
      </div>
      {error ?? <div className={styles.Error}>{error}</div>}
    </div>
  );
};

export default AddFriendsTab;
