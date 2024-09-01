import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { firestore, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../context/AuthContext';
import './AddFlatForm.css';
import { useNavigate } from 'react-router-dom';

const AddFlatForm = () => {
  const [city, setCity] = useState('');
  const [streetName, setStreetName] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [rentPrice, setRentPrice] = useState('');
  const [hasAC, setHasAC] = useState(false);
  const [images, setImages] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImages([...e.target.files]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrls = [];
      for (let i = 0; i < images.length; i++) {
        const imageRef = ref(storage, `flats/${images[i].name}`);
        await uploadBytes(imageRef, images[i]);
        const imageUrl = await getDownloadURL(imageRef);
        imageUrls.push(imageUrl);
      }

      const newFlat = {
        city,
        streetName,
        streetNumber,
        rentPrice: parseInt(rentPrice, 10),
        hasAC,
        imageUrls,
        userId: currentUser.uid,
      };

      const flatsCollection = collection(firestore, 'Flats');
      await addDoc(flatsCollection, newFlat);

      // Limpiar el formulario después de agregar el flat
      setCity('');
      setStreetName('');
      setStreetNumber('');
      setRentPrice('');
      setHasAC(false);
      setImages([]);

      // Redirigir a la página principal
      navigate('/main');
    } catch (error) {
      console.error("Error al añadir el flat:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-flat-form">
      <h2>Añadir Nuevo Flat</h2>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Ciudad"
        required
      />
      <input
        type="text"
        value={streetName}
        onChange={(e) => setStreetName(e.target.value)}
        placeholder="Nombre de la Calle"
        required
      />
      <input
        type="text"
        value={streetNumber}
        onChange={(e) => setStreetNumber(e.target.value)}
        placeholder="Número de la Calle"
        required
      />
      <input
        type="number"
        value={rentPrice}
        onChange={(e) => setRentPrice(e.target.value)}
        placeholder="Precio de Renta por Noche"
        required
      />
      <label>
        <input
          type="checkbox"
          checked={hasAC}
          onChange={(e) => setHasAC(e.target.checked)}
        />
        ¿Tiene aire acondicionado?
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        multiple
      />
      <div className="button-group">
        <button type="submit">Añadir Flat</button>
        <button type="button" onClick={() => navigate('/main')}>Regresar</button>
      </div>
    </form>
  );
};

export default AddFlatForm;


