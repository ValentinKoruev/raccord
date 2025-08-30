import Form from '@components/UI/Form';
import apiQueries from '@queries/api';
import { closeModal } from '@redux/slices/modalSlice';
import { useAppDispatch } from '@redux/store';
import { useQueryClient } from '@tanstack/react-query';
import styles from './CreateChannelModal.module.scss';
import { FC } from 'react';

type CreateChannelModalProps = {
  guildId: string;
};

interface CreateChannelFormData {
  createChannelName: string;
  // TODO: add option for text/voice
}

const CreateChannelModal: FC<CreateChannelModalProps> = ({ guildId }) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const handleSubmit = async (values: CreateChannelFormData) => {
    await apiQueries.guildQueries.createGuildChannel({
      guildId,
      channelName: values.createChannelName.trim(),
    });

    queryClient.invalidateQueries({ queryKey: ['guild'] });
    dispatch(closeModal());
  };

  const validate = (values: CreateChannelFormData) => {
    if (!values.createChannelName.trim()) return 'Channel name is empty';
    return null;
  };

  const onBack = () => {
    dispatch(closeModal());
  };

  return (
    <div className={styles.CreateChannelContainer}>
      <div className={styles.Header}>Create Server Channel</div>
      <Form<CreateChannelFormData>
        initialValues={{ createChannelName: '' }}
        fields={[{ name: 'createChannelName', label: 'Channel Name', placeholder: 'Channel name...' }]}
        onSubmit={handleSubmit}
        validate={validate}
        onBack={onBack}
        submitText="Create"
        testId="create-channel-form"
      />
    </div>
  );
};

export default CreateChannelModal;
