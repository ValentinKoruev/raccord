import { FC } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@redux/store';
import { closeModal } from '@redux/slices/modalSlice';
import apiQueries from '@queries/api';
import Form from '@components/UI/Form';

interface CreateServerFormProps {
  onBack: () => void;
}

interface CreateServerFormData {
  createServerName: string;
  createServerIcon: string;
}

const CreateServerForm: FC<CreateServerFormProps> = ({ onBack }) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const handleSubmit = async (values: CreateServerFormData) => {
    await apiQueries.guildQueries.createGuild({
      guildName: values.createServerName.trim(),
      guildIcon: values.createServerIcon.trim(),
    });

    queryClient.invalidateQueries({ queryKey: ['userguilds'] });
    dispatch(closeModal());
  };

  const validate = (values: CreateServerFormData) => {
    if (!values.createServerName.trim()) return 'Guild name is empty';
    return null;
  };

  return (
    <Form<CreateServerFormData>
      initialValues={{ createServerName: '', createServerIcon: '' }}
      fields={[
        { name: 'createServerName', label: 'Server Name', placeholder: 'Server name...' },
        { name: 'createServerIcon', label: 'Server Icon', placeholder: 'Server icon...' },
      ]}
      onSubmit={handleSubmit}
      validate={validate}
      onBack={onBack}
      submitText="Create"
      testId="create-server-form"
    />
  );
};

export default CreateServerForm;
