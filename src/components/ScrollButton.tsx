import React from 'react';

interface ScrollButtonProps {
  onScrollClick: () => void;
}

const ScrollButton: React.FC<ScrollButtonProps> = ({ onScrollClick }) => {
  return (
    <button onClick={onScrollClick}>
      Scroll til mål-div
    </button>
  );
};

export default ScrollButton;