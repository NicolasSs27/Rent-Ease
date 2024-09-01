import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './MyFlats.css';

const MyFlats = () => {
  const [flats, setFlats] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const flatsQuery = query(
          collection(firestore, 'Flats'),
          where('userId', '==', currentUser.uid)
        );
        const flatsSnapshot = await getDocs(flatsQuery);
        const flatsList = flatsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFlats(flatsList);
      } catch (error) {
        console.error("Error fetching flats: ", error);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'Flats', id));
      setFlats(flats.filter(flat => flat.id !== id));
    } catch (error) {
      console.error("Error deleting flat: ", error);
    }
  };

  return (
    <div className="my-flats-container">
      <h2>Mis Flats</h2>
      <div className="flats-list">
        {flats.length > 0 ? (
          flats.map((flat, index) => (
            <div key={index} className="flat-item">
              <img src={flat.imageUrl} alt={flat.city} className="flat-image" />
              <h2>{flat.city}</h2>
              <p>{flat.streetName} {flat.streetNumber}</p>
              <p>Precio: ${flat.rentPrice}/noche</p>
              <p>{flat.hasAC ? 'Tiene aire acondicionado' : 'Sin aire acondicionado'}</p>
              <div className="button-group">
                <button onClick={() => navigate(`/edit-flat/${flat.id}`)} className="edit-button">Editar</button>
                <button onClick={() => handleDelete(flat.id)} className="delete-button">Eliminar</button>
              </div>
            </div>
          ))
        ) : (
          <p>No tienes flats agregados.</p>
        )}
      </div>
    </div>
  );
};

export default MyFlats;
