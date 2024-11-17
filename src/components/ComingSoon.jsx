import React from 'react';
const ComingSoon = ({className = ''}) => {
  return (
    <span
      className={`font-normal text-tiny bg-contras-med px-2 rounded-full text-general-med ${className}`}>
      Coming Soon
    </span>
  );
};

export default ComingSoon;
