import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useAuth } from '../context/AuthContext';

const MessageForm = ({ flatId }) => {
  const [message, setMessage] = useState('');
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(firestore, 'messages'), {
        flatId,
        userId: currentUser.uid,
        message,
        timestamp: serverTimestamp(),
      });
      alert('Mensaje enviado con éxito');
      setMessage(''); // Limpiar el formulario después de enviar el mensaje
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      alert('Ocurrió un error al enviar el mensaje.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe tu mensaje aquí"
        required
      />
      <button type="submit">Enviar Mensaje</button>
    </form>
  );
};

export default MessageForm;
