import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate(); // Utiliza useNavigate para redirigir

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser) return;

      const q = query(collection(firestore, 'Flats'), where('favorite', '==', true));
      const querySnapshot = await getDocs(q);

      const flatsList = await Promise.all(
        querySnapshot.docs.map(async (flatDoc) => {
          const flatData = flatDoc.data();
          const ownerDoc = await getDoc(doc(firestore, 'users', flatData.userId));
          const ownerData = ownerDoc.exists() ? ownerDoc.data() : { firstName: 'Desconocido', email: 'N/A' };

          return {
            id: flatDoc.id,
            ...flatData,
            ownerName: `${ownerData.firstName} ${ownerData.lastName}`,
            ownerEmail: ownerData.email,
          };
        })
      );

      setFavorites(flatsList);
    };

    fetchFavorites();
  }, [currentUser]);

  const removeFavorite = async (flatId) => {
    try {
      const flatDoc = doc(firestore, 'Flats', flatId);
      await updateDoc(flatDoc, {
        favorite: false,
      });
      setFavorites(favorites.filter(flat => flat.id !== flatId));
    } catch (error) {
      console.error('Error al remover de favoritos:', error);
    }
  };

  return (
    <div className="favorites-container">
      <h2>Flats Favoritos</h2>
      
      {/* Botón para regresar a la MainPage */}
      <button onClick={() => navigate('/main')} style={{ marginBottom: '20px' }}>
        Volver a MainPage
      </button>
      
      <table>
        <thead>
          <tr>
            <th>Ciudad</th>
            <th>Dirección</th>
            <th>Precio</th>
            <th>Dueño</th>
            <th>Email</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {favorites.map((flat) => (
            <tr key={flat.id}>
              <td>{flat.city}</td>
              <td>{flat.streetName} {flat.streetNumber}</td>
              <td>${flat.rentPrice}/noche</td>
              <td>{flat.ownerName}</td>
              <td>{flat.ownerEmail}</td>
              <td>
                <button onClick={() => removeFavorite(flat.id)}>Remover de Favoritos</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FavoritesPage;

