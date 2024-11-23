import React from 'react';
const SvgArrowLeft: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({
  height = 32,
  width = 32,
  className,
}) => (
  <svg
    className="w-4 h-4 text-white rtl:rotate-180"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 6 10"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 1 1 5l4 4"
    />
  </svg>
);
export default SvgArrowLeft;
