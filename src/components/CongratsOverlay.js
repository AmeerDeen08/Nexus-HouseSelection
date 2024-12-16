import React from 'react';
import '../styles/CongratsOverlay.css';
import Social from '../assets/images/Social.jpg'
const CongratsOverlay = ({ house }) => {
  return (
    <div className="overlay">
      <div className="overlay-content">
        <h2>Congrats! Your House is</h2>
        <h2 className='text-success'><strong>{house.toUpperCase()}</strong></h2>
        <p className='mt-3'>For More Info and Updates</p>
      
        <a href="https://www.instagram.com/nexus_hits/profilecard/?igsh=MXM5NHk4N20xeXRkOA==" target="_blank" rel="noopener noreferrer">
<img src={Social} className='social socialcon' alt='socialicon'/></a></div>
      </div>
    
  );
};

export default CongratsOverlay;
