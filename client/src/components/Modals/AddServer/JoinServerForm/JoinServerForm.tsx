import { FC } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError, isAxiosError } from 'axios';
import { useAppDispatch } from '@redux/store';
import { closeModal } from '@redux/slices/modalSlice';
import apiQueries from '@queries/api';
import { NOT_FOUND } from '@queries/statusCodes';
import Form from '@components/UI/Form';

interface JoinServerFormProps {
  onBack: () => void;
}

interface JoinServerFormData {
  joinServerId: string;
}

const JoinServerForm: FC<JoinServerFormProps> = ({ onBack }) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const handleSubmit = async (values: JoinServerFormData) => {
    await apiQueries.guildQueries.join({
      guildId: values.joinServerId.trim(),
    });

    queryClient.invalidateQueries({ queryKey: ['userguilds'] });
    dispatch(closeModal());
  };

  const validate = (values: JoinServerFormData) => {
    if (!values.joinServerId.trim()) return 'Guild id is empty';
    return null;
  };

  const formatError = (error: any): string | null => {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.status == NOT_FOUND) {
        return 'Guild is not found';
      }
    }

    return null;
  };

  return (
    <Form<JoinServerFormData>
      initialValues={{ joinServerId: '' }}
      fields={[{ name: 'joinServerId', label: 'Server Id', placeholder: 'Server id...' }]}
      onSubmit={handleSubmit}
      validate={validate}
      onBack={onBack}
      submitText="Join"
      testId="join-server-form"
      formatError={formatError}
    />
  );
};

export default JoinServerForm;
