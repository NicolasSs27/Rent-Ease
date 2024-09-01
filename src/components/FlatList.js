import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';
import './FlatList.css'; // Asegúrate de que este archivo exista

const FlatList = () => {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const flatsCollection = collection(firestore, 'Flats');
        const flatsSnapshot = await getDocs(flatsCollection);
        const flatsList = flatsSnapshot.docs.map(doc => doc.data());
        setFlats(flatsList);
      } catch (error) {
        console.error("Error fetching flats: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Flats</h1>
      {loading ? (
        <p>Cargando flats...</p>
      ) : flats.length > 0 ? (
        <ul>
          {flats.map((flat, index) => (
            <li key={index} className="flat-item">
              {flat.city}, {flat.streetName} {flat.streetNumber} - ${flat.rentPrice}
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron flats disponibles.</p>
      )}
    </div>
  );
};

export default FlatList;






