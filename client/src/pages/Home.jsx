import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TheaterShows = () => {
  const [theaters, setTheaters] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState('');
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const response = await fetch('http://localhost:8000/theater');
        if (!response.ok) throw new Error('Errore nel recupero dei teatri');
        const data = await response.json();
        setTheaters(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTheaters();
  }, []);

  useEffect(() => {
    const fetchShows = async () => {
      if (!selectedTheater) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/theater/${selectedTheater}/shows`);
        if (!response.ok) throw new Error('Errore nel recupero degli spettacoli');
        const data = await response.json();
        setShows(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [selectedTheater]);

  const handleTheaterChange = (e) => {
    setSelectedTheater(e.target.value);
    setShows([]);
  };

  const handleCardClick = (showId) => {
    navigate(`/reservation/${showId}`);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Seleziona un teatro</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-4">
        <select className="form-select" value={selectedTheater} onChange={handleTheaterChange}>
          <option value="">-- Seleziona un teatro --</option>
          {theaters.map((theater) => (
            <option key={theater.id} value={theater.id}>
              {theater.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="text-center">Caricamento spettacoli...</div>}

      <div className="row">
        {shows.length > 0 ? (
          shows.map((show) => (
            <div key={show.id} className="col-md-4 mb-4">
              <div
                className="card h-100"
                onClick={() => handleCardClick(show.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-body">
                  <h5 className="card-title">{show.title}</h5>
                  <p className="card-text">{show.description}</p>
                  <p className="card-text"><strong>Data:</strong> {show.date}</p>
                  <p className="card-text"><strong>Orario:</strong> {show.time}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && selectedTheater && <div className="col-12 text-center">Nessuno spettacolo disponibile per questo teatro</div>
        )}
      </div>
    </div>
  );
};

export default TheaterShows;
