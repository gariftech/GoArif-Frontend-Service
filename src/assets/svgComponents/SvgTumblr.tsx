import React from 'react';

const SvgTumblr: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({
  height = 16,
  width,
  className,
}) => (
  <svg
    height={height}
    width={width}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1621_1612)">
      <path
        d="M14.6 24C11 24 8.3 22.15 8.3 17.7V10.6H5V6.75C8.6 5.8 10.1 2.7 10.3 0H14.05V6.1H18.4V10.6H14.05V16.8C14.05 18.65 15 19.3 16.5 19.3H18.6V24H14.6Z"
        fill="#001935"
      />
    </g>
    <defs>
      <clipPath id="clip0_1621_1612">
        <rect width="13.6" height="24" fill="white" transform="translate(5)" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgTumblr;
