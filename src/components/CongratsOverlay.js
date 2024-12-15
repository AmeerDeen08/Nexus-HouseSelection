import React from 'react';
import '../styles/CongratsOverlay.css';

const CongratsOverlay = ({ house }) => {
  return (
    <div className="overlay">
      <div className="overlay-content">
        <h2>Congrats! Your House is</h2>
        <h2 className='text-success'><strong>{house}</strong></h2>
      </div>
    </div>
  );
};

export default CongratsOverlay;
