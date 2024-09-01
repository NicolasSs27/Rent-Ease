import React, { useState } from 'react';
import './ImageCarousel.css';

const ImageCarousel = ({ imageUrls }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!imageUrls || imageUrls.length === 0) {
    return <div className="no-image">No images available</div>;
  }

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
  };

  return (
    <div className="image-carousel">
      <img src={imageUrls[currentImageIndex]} alt="Flat" className="carousel-image" />
      <button onClick={handlePrev} className="carousel-button prev-button">
        &lt;
      </button>
      <button onClick={handleNext} className="carousel-button next-button">
        &gt;
      </button>
    </div>
  );
};

export default ImageCarousel;




