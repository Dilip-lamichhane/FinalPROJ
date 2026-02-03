import React from 'react';
import PropTypes from 'prop-types';

const RatingStars = ({ rating, size = 'md', interactive = false, onRate, className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const starSize = sizes[size] || sizes.md;

  const renderStar = (index) => {
    const isFilled = rating >= index + 1;
    const isHalfFilled = rating >= index + 0.5 && rating < index + 1;

    return (
      <button
        key={index}
        type="button"
        className={`${starSize} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} ${className}`}
        onClick={() => interactive && onRate && onRate(index + 1)}
        disabled={!interactive}
        aria-label={`Rate ${index + 1} star${index !== 0 ? 's' : ''}`}
      >
        <svg
          className={`w-full h-full ${isFilled ? 'text-yellow-400' : isHalfFilled ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`half-${index}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
          <path
            fill={isHalfFilled ? `url(#half-${index})` : isFilled ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      </button>
    );
  };

  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => renderStar(index))}
      {rating > 0 && (
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

RatingStars.propTypes = {
  rating: PropTypes.number.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  interactive: PropTypes.bool,
  onRate: PropTypes.func,
  className: PropTypes.string,
};

export default RatingStars;