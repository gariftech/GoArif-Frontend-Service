import React from 'react';

const colorVariants = {
  primary: 'btn-primary',
  error: 'btn-error',
  success: 'btn-success',
};

const sizeVariants = {
  lg: 'btn-lg text-xl h-13 p-4 rounded-large',
  md: 'btn-md text-base h-10 p-medium rounded-medium',
  sm: 'btn-sm text-base h-8 p-small rounded-lg',
  xs: 'btn-xs text-xs h-6 px-2 px-1 rounded-lg',
};

const ButtonLink = ({
  title,
  icon,
  iconPosition = 'right',
  loading = false,
  color = 'primary',
  size = 'md',
  outline = false,
  disabled = false,
  href,
  ...restProps
}) => {
  const baseClasses = 'btn font-normal text-base';
  const colorClass = colorVariants[color];
  const sizeClass = sizeVariants[size];
  const outlineClass = outline ? 'btn-outline' : '';

  const disabledClass = disabled
    ? 'disabled:bg-primary-disable disabled:text-primary-content disabled:cursor-not-allowed'
    : 'hover:outline hover:outline-1 hover:outline-offset-2';

  return (
    <a
      href={disabled ? undefined : href}
      className={`${baseClasses} ${colorClass} ${sizeClass} ${outlineClass} ${disabledClass} inline-flex items-center justify-center`}
      {...restProps}
    >
      {iconPosition === 'left' && (loading ? <span className="loading loading-spinner" /> : icon)}
      {title}
      {iconPosition === 'right' && (loading ? <span className="loading loading-spinner" /> : icon)}
    </a>
  );
};

export default ButtonLink;
