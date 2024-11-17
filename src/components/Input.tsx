import React from 'react';

const Input = ({
  value,
  onChange,
  onBlur,
  type = 'text',
  placeholder,
  autoComplete,
  className,
  ...rest
}) => (
  <input
    type={type}
    className={`input input-bordered rounded-lg p-3 w-full text-primary text-base font-normal bg-contras-high ${className}`}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    autoComplete={autoComplete}
    {...rest}
  />
);

export default Input;
