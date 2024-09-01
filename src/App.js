import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import MainPage from './components/MainPage';
import AddFlatForm from './components/AddFlatForm';
import MyFlats from './components/MyFlats';
import PrivateRoute from './components/PrivateRoute';
import EditProfile from './components/EditProfile';
import AdminPage from './components/AdminPage';
import FlatDetails from './components/FlatDetails';
import FavoritesPage from './components/FavoritesPage';
import { AuthProvider } from './context/AuthContext';
import EditFlatForm from './components/EditFlatForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/add-flat" element={<PrivateRoute><AddFlatForm /></PrivateRoute>} />
          <Route path="/edit-flat/:flatId" element={<PrivateRoute><EditFlatForm /></PrivateRoute>} />
          <Route path="/my-flats" element={<PrivateRoute><MyFlats /></PrivateRoute>} />
          <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
          <Route path="/flat/:flatId" element={<PrivateRoute><FlatDetails /></PrivateRoute>} />
          <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
          <Route path="/login" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;










