import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import MessageForm from './MessageForm';
import MessagesList from './MessagesList';
import { useAuth } from '../context/AuthContext';

const FlatDetails = () => {
  const { flatId } = useParams();
  const { currentUser } = useAuth();
  const [flat, setFlat] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlat = async () => {
      try {
        const flatDoc = await getDoc(doc(firestore, 'Flats', flatId));
        if (flatDoc.exists()) {
          setFlat({ id: flatDoc.id, ...flatDoc.data() });
        } else {
          console.error('No se encontró el flat');
        }
      } catch (error) {
        console.error('Error al obtener el flat:', error);
      }
    };

    fetchFlat();
  }, [flatId]);

  if (!flat) {
    return <p>Cargando detalles del flat...</p>;
  }

  return (
    <div>
      <h1>{flat.city}</h1>
      <p>{flat.streetName} {flat.streetNumber}</p>
      <p>Precio: ${flat.rentPrice}/noche</p>
      <p>{flat.hasAC ? 'Tiene aire acondicionado' : 'Sin aire acondicionado'}</p>

      {/* Botón para regresar a la MainPage */}
      <button onClick={() => navigate('/main')}>Volver a MainPage</button>

      {/* Mostrar el formulario de mensajes solo si el usuario no es el dueño del flat */}
      {currentUser.uid !== flat.userId && (
        <MessageForm flatId={flat.id} />
      )}

      {/* Mostrar la lista de mensajes solo al dueño del flat */}
      {currentUser.uid === flat.userId && (
        <MessagesList flatId={flat.id} />
      )}
    </div>
  );
};

export default FlatDetails;



