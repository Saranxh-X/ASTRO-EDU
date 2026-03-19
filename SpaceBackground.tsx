import React from 'react';
import './SpaceBackground.css';

const SpaceBackground: React.FC = () => {
  // Generate random stars
  const stars = Array.from({ length: 150 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}vw`,
    top: `${Math.random() * 100}vh`,
    size: `${Math.random() * 3 + 1}px`,
    animationDuration: `${Math.random() * 5 + 3}s`,
    animationDelay: `${Math.random() * 5}s`,
  }));

  return (
    <div id="space-background">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDuration: star.animationDuration,
            animationDelay: star.animationDelay,
            opacity: Math.random() * 0.5 + 0.2
          }}
        />
      ))}
    </div>
  );
};

export default SpaceBackground;
