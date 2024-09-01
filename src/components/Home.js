import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Home = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="home-background"> {/* Añadimos una clase específica */}
      <div className="form-container">
        <div className="switch-buttons">
          <button onClick={() => setShowLogin(true)}>Login</button>
          <button onClick={() => setShowLogin(false)}>Register</button>
        </div>
        {showLogin ? (
          <div>
            <h2>Login</h2>
            <Login />
          </div>
        ) : (
          <div>
            <h2>Register</h2>
            <Register />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;



