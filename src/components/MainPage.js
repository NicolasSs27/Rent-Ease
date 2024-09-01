import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, getDoc, query, where } from 'firebase/firestore';
import { firestore } from '../firebase';
import './MainPage.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ImageCarousel from './ImageCarousel';

const MainPage = () => {
  const [flats, setFlats] = useState([]);
  const [favoriteFlats, setFavoriteFlats] = useState([]);
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const flatsCollection = collection(firestore, 'Flats');
        const flatsSnapshot = await getDocs(flatsCollection);
        const flatsList = flatsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFlats(flatsList);

        if (currentUser) {
          const favoritesQuery = query(collection(firestore, 'Flats'), where('favorite', '==', true), where('userId', '==', currentUser.uid));
          const favoritesSnapshot = await getDocs(favoritesQuery);
          const favoritesList = favoritesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setFavoriteFlats(favoritesList);

          const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === 'admin') {
              setIsAdmin(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, navigate]);

  const handleDelete = async (id, userId) => {
    if (!currentUser) {
      alert("Necesitas estar autenticado para eliminar un flat.");
      navigate('/login');
      return;
    }
    if (currentUser.uid !== userId) {
      alert("No tienes permiso para eliminar este flat.");
      return;
    }
    try {
      await deleteDoc(doc(firestore, 'Flats', id));
      setFlats(flats.filter(flat => flat.id !== id));
    } catch (error) {
      console.error("Error deleting flat: ", error);
    }
  };

  const handleEdit = (id, userId) => {
    if (!currentUser) {
      alert("Necesitas estar autenticado para editar un flat.");
      navigate('/login');
      return;
    }
    if (currentUser.uid !== userId) {
      alert("No tienes permiso para editar este flat.");
      return;
    }
    navigate(`/edit-flat/${id}`);
  };

  const handleFilter = () => {
    let filteredFlats = flats;

    if (city) {
      filteredFlats = filteredFlats.filter(flat => flat.city.toLowerCase().includes(city.toLowerCase()));
    }

    filteredFlats = filteredFlats.filter(flat => flat.rentPrice >= minPrice && flat.rentPrice <= maxPrice);

    setFlats(filteredFlats);
  };

  const toggleFavorite = async (id) => {
    if (!currentUser) {
      alert("Necesitas estar autenticado para marcar un flat como favorito.");
      navigate('/login');
      return;
    }

    try {
      const flatDoc = doc(firestore, 'Flats', id);
      const flat = flats.find(flat => flat.id === id);
      const newFavoriteStatus = !flat.favorite;

      await updateDoc(flatDoc, {
        favorite: newFavoriteStatus
      });

      setFlats(flats.map(flat => 
        flat.id === id ? { ...flat, favorite: newFavoriteStatus } : flat
      ));

      if (newFavoriteStatus) {
        setFavoriteFlats([...favoriteFlats, flat]);
      } else {
        setFavoriteFlats(favoriteFlats.filter(favFlat => favFlat.id !== id));
      }
    } catch (error) {
      console.error("Error updating favorite status: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="main-container">
      <header className="header">
        <div className="logo">FlatFinder</div>
        <div className="filters">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ciudad"
            className="filter-input"
          />
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Precio Mínimo"
            className="filter-input"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Precio Máximo"
            className="filter-input"
          />
          <button onClick={handleFilter} className="filter-button">Filtrar</button>
        </div>
        <div className="header-buttons">
          <button 
            className="add-flat-button"
            onClick={() => {
              if (!currentUser) {
                alert("Necesitas estar autenticado para añadir un flat.");
                navigate('/login');
              } else {
                navigate('/add-flat');
              }
            }}
          >
            Añadir Nuevo Flat
          </button>
          <button 
            className="favorites-button"
            onClick={() => navigate('/favorites')}
          >
            Ver Favoritos
          </button>
          <button 
            className="edit-profile-button"
            onClick={() => navigate('/edit-profile')}
          >
            Editar Perfil
          </button>
          {isAdmin && (
            <button 
              className="admin-page-button"
              onClick={() => navigate('/admin')}
            >
              Admin Page
            </button>
          )}
          {currentUser && (
            <button 
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </header>

      <div className="flats-list">
        {loading ? (
          <p>Cargando flats...</p>
        ) : flats.length > 0 ? (
          flats.map(flat => (
            <div key={flat.id} className="flat-item">
              <button
                className={`favorite-button ${flat.favorite ? 'favorited' : ''}`}
                onClick={() => toggleFavorite(flat.id)}
              >
                &#10084;
              </button>
              <ImageCarousel imageUrls={flat.imageUrls} />
              <h2>{flat.city}</h2>
              <p>{flat.streetName} {flat.streetNumber}</p>
              <p>Precio: ${flat.rentPrice}/noche</p>
              <p>{flat.hasAC ? 'Tiene aire acondicionado' : 'Sin aire acondicionado'}</p>
              <div className="button-group">
                {currentUser?.uid === flat.userId ? (
                  <>
                    <button 
                      onClick={() => navigate(`/flat-details/${flat.id}`)} 
                      className="messages-button"
                    >
                      Ver Mensajes
                    </button>
                    <button onClick={() => handleEdit(flat.id, flat.userId)} className="edit-button">Editar</button>
                    <button onClick={() => handleDelete(flat.id, flat.userId)} className="delete-button">Eliminar</button>
                  </>
                ) : (
                  <button 
                    onClick={() => navigate(`/flat-details/${flat.id}`)} 
                    className="messages-button"
                  >
                    Enviar Mensaje
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No se encontraron flats disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default MainPage;






















