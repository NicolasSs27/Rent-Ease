import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    if (!firstName || !lastName || !age || !email || !password || !confirmPassword) {
      return 'Todos los campos son requeridos';
    }
    if (firstName.length < 2) {
      return 'El nombre debe tener al menos 2 caracteres';
    }
    if (lastName.length < 2) {
      return 'El apellido debe tener al menos 2 caracteres';
    }
    if (age < 18 || age > 120) {
      return 'La edad debe ser entre 18 y 120 años';
    }
    if (password.length < 6) {
      return 'El password debe tener al menos 6 caracteres';
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return 'El password debe incluir al menos un carácter especial';
    }
    if (password !== confirmPassword) {
      return 'Los passwords no coinciden';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(firestore, 'users', user.uid), {
        firstName,
        lastName,
        email,
        age,
      });
      // Redirigir al usuario a la MainPage
      navigate('/main');
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
      setError(`Error al registrar usuario: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="Nombre"
        required
      />
      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Apellido"
        required
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Edad"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirmar Password"
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;




