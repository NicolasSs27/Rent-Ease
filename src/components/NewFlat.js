// src/components/NewFlat.js
import React, { useState } from 'react';
import { firestore } from '../firebase';

const NewFlat = () => {
  const [city, setCity] = useState('');
  const [streetName, setStreetName] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [areaSize, setAreaSize] = useState('');
  const [hasAC, setHasAC] = useState(false);
  const [yearBuilt, setYearBuilt] = useState('');
  const [rentPrice, setRentPrice] = useState('');
  const [dateAvailable, setDateAvailable] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await firestore.collection('flats').add({
        city,
        streetName,
        streetNumber,
        areaSize,
        hasAC,
        yearBuilt,
        rentPrice,
        dateAvailable
      });
      // Redirigir al usuario a la página principal o limpiar el formulario
    } catch (error) {
      console.error("Error al crear flat:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="City"
      />
      <input
        type="text"
        value={streetName}
        onChange={(e) => setStreetName(e.target.value)}
        placeholder="Street Name"
      />
      <input
        type="number"
        value={streetNumber}
        onChange={(e) => setStreetNumber(e.target.value)}
        placeholder="Street Number"
      />
      <input
        type="number"
        value={areaSize}
        onChange={(e) => setAreaSize(e.target.value)}
        placeholder="Area Size"
      />
      <input
        type="checkbox"
        checked={hasAC}
        onChange={(e) => setHasAC(e.target.checked)}
      />
      <label>Has AC</label>
      <input
        type="number"
        value={yearBuilt}
        onChange={(e) => setYearBuilt(e.target.value)}
        placeholder="Year Built"
      />
      <input
        type="number"
        value={rentPrice}
        onChange={(e) => setRentPrice(e.target.value)}
        placeholder="Rent Price"
      />
      <input
        type="date"
        value={dateAvailable}
        onChange={(e) => setDateAvailable(e.target.value)}
      />
      <button type="submit">Add Flat</button>
    </form>
  );
};

export default NewFlat;

