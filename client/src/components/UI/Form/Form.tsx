import { useState, ChangeEvent, MouseEvent, ReactNode } from 'react';
import styles from './Form.module.scss';

interface IFormField {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
}

interface FormProps<T> {
  initialValues: T;
  fields: IFormField[];
  onSubmit: (values: T) => Promise<void>;
  validate?: (values: T) => string | null;
  renderExtra?: ReactNode;
  submitText?: string;
  backButtonText?: string;
  testId?: string;
  onBack?: () => void;
  formatError?: (err: any) => string | null;
}
const Form = <T extends Record<string, any>>({
  initialValues,
  fields,
  onSubmit,
  validate,
  renderExtra,
  submitText = 'Submit',
  backButtonText = 'Back',
  testId,
  onBack,
  formatError,
}: FormProps<T>) => {
  const [form, setForm] = useState<T>(initialValues);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validate) {
      const validationError = validate(form);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    try {
      await onSubmit(form);
    } catch (err) {
      if (formatError) {
        const formatedErr = formatError(err);
        if (formatedErr) {
          setError(formatedErr);
          return;
        }
      }
      setError('Unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div data-testid={testId} className={styles.FormContainer}>
      <form className={styles.Form}>
        {fields.map(({ name, label, placeholder, type }) => (
          <div key={name} className={styles.FormInputContainer}>
            <label htmlFor={name}>{label}</label>
            <input
              id={name}
              name={name}
              type={type || 'text'}
              placeholder={placeholder}
              value={form[name]}
              onChange={handleChange}
            />
          </div>
        ))}
        {renderExtra}
      </form>

      {error && (
        <div role="alert" className={styles.Error}>
          {error}
        </div>
      )}

      <div className={styles.ButtonsContainer}>
        {onBack && (
          <button className={styles.BackButton} onClick={onBack}>
            {backButtonText}
          </button>
        )}
        <button className={styles.CreateButton} onClick={handleSubmit}>
          {submitText}
        </button>
      </div>
    </div>
  );
};

export default Form;
