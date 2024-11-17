import React from 'react';

const ErrorMessageField = ({ error, touched, className }) => {
  if (!error || !touched) return null;

  return (
    <div className={`text-error text-sm mt-2 ${className}`}>
      {Array.isArray(error) ? (
        error.map((msg, index) => <div key={index}>{msg}</div>)
      ) : (
        <div>{error}</div>
      )}
    </div>
  );
};

export default ErrorMessageField;
