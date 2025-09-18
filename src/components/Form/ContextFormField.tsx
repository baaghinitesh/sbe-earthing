import React from 'react';
import FormField, { FormFieldProps } from './FormField';
import { useForm } from './Form';

interface ContextFormFieldProps extends Omit<FormFieldProps, 'value' | 'onChange' | 'error' | 'onBlur'> {
  name: string;
}

const ContextFormField: React.FC<ContextFormFieldProps> = ({ name, ...props }) => {
  const { data, setValue, getError, validateField } = useForm();

  return (
    <FormField
      {...props}
      name={name}
      value={data[name] || ''}
      onChange={(value) => setValue(name, value)}
      error={getError(name)}
      onBlur={() => validateField(name)}
    />
  );
};

export default ContextFormField;