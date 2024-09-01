import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';

const MessagesList = ({ flatId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const q = query(collection(firestore, 'messages'), where('flatId', '==', flatId));
      const querySnapshot = await getDocs(q);
      const messagesList = querySnapshot.docs.map(doc => doc.data());
      setMessages(messagesList);
    };

    fetchMessages();
  }, [flatId]);

  return (
    <div>
      <h2>Mensajes Recibidos</h2>
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <div key={index}>
            <p>{msg.message}</p>
            <small>Enviado por: {msg.userId}</small>
          </div>
        ))
      ) : (
        <p>No hay mensajes.</p>
      )}
    </div>
  );
};

export default MessagesList;

