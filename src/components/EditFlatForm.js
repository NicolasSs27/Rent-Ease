import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

const EditFlatForm = () => {
  const { flatId } = useParams();
  const [flatData, setFlatData] = useState(null);
  const [city, setCity] = useState('');
  const [streetName, setStreetName] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [rentPrice, setRentPrice] = useState('');
  const [hasAC, setHasAC] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlat = async () => {
      try {
        const flatDoc = await getDoc(doc(firestore, 'Flats', flatId));
        if (flatDoc.exists()) {
          const flatData = flatDoc.data();
          setFlatData(flatData);
          setCity(flatData.city);
          setStreetName(flatData.streetName);
          setStreetNumber(flatData.streetNumber);
          setRentPrice(flatData.rentPrice);
          setHasAC(flatData.hasAC);
        } else {
          console.error('No se encontró el flat');
        }
      } catch (error) {
        console.error('Error al obtener el flat:', error);
      }
    };

    fetchFlat();
  }, [flatId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const flatDoc = doc(firestore, 'Flats', flatId);
      await updateDoc(flatDoc, {
        city,
        streetName,
        streetNumber,
        rentPrice: parseInt(rentPrice, 10),
        hasAC,
      });
      alert('Flat actualizado con éxito');
      navigate('/main');
    } catch (error) {
      console.error('Error al actualizar el flat:', error);
      alert('Ocurrió un error al actualizar el flat.');
    }
  };

  if (!flatData) {
    return <p>Cargando datos del flat...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Editar Flat</h2>
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
      <button type="submit">Guardar Cambios</button>
      <button type="button" onClick={() => navigate('/main')}>Cancelar</button>
    </form>
  );
};

export default EditFlatForm;

