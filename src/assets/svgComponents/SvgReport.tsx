import React from 'react';

const SvgHome: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = ({
    height = 16,
    width,
    className,
}) => (
    <svg
        width={width}
        height={height}
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M8 12H4C3.44772 12 3 12.4477 3 13V18.5C3 18.8283 3.06466 19.1534 3.1903 19.4567C3.31594 19.76 3.50009 20.0356 3.73223 20.2678C3.96438 20.4999 4.23998 20.6841 4.54329 20.8097C4.84661 20.9353 5.1717 21 5.5 21C5.8283 21 6.15339 20.9353 6.45671 20.8097C6.76002 20.6841 7.03562 20.4999 7.26777 20.2678C7.49991 20.0356 7.68406 19.76 7.8097 19.4567C7.93534 19.1534 8 18.8283 8 18.5V5C8 3.89543 8.89543 3 10 3H19C20.1046 3 21 3.89543 21 5V18.5C21 18.8283 20.9353 19.1534 20.8097 19.4567C20.6841 19.76 20.4999 20.0356 20.2678 20.2678C20.0356 20.4999 19.76 20.6841 19.4567 20.8097C19.1534 20.9353 18.8283 21 18.5 21H6M12 7H17M12 11H17M12 15H14"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
export default SvgHome;
