import './App.css';
import React, { useState, useEffect, useRef} from 'react';

function App() {
  const [movies, setMovies] = useState([]);
  const [sortBy, setSortBy] = useState('episode_id');
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filter, setFilter] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  const tableRef = useRef(null);

  useEffect(() => {
    // Fetch data from the Star Wars API
fetch('https://swapi.dev/api/films/?format=json')
.then(response => response.json())
.then(data => {
  // Got some data, Let's set it to our movies state
  setMovies(data.results);
})
.catch(error => {
  console.error('Error fetching data:', error);
});

    // Add event listener to reset selected row when clicking outside the table
    document.addEventListener('click', handleClickOutsideTable);

    return () => {
      // Remove event listener on component unmount
      document.removeEventListener('click', handleClickOutsideTable);
    };
  }, []);

  useEffect(() => {
    // Filter movies based on the input
    const lowerCaseFilter = filter.toLowerCase();
    const filtered = movies.filter(movie => movie.title.toLowerCase().includes(lowerCaseFilter));
    setFilteredMovies(filtered);
  }, [filter, movies]);

  const handleClickOutsideTable = (event) => {
    if (tableRef.current && !tableRef.current.contains(event.target)) {
      setSelectedRow(null);
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const compareMovies = (a, b) => {
    if (sortBy === 'episode_id') {
      return a.episode_id - b.episode_id;
    } else if (sortBy === 'release_date') {
      return new Date(a.release_date) - new Date(b.release_date);
    }
    return 0; // Default case
  };

  const sortedMovies = [...(filter ? filteredMovies : movies)].sort(compareMovies);

  const handleRowClick = (episodeId) => {
    // Find the movie with the selected episodeId
    const selectedMovie = movies.find(movie => movie.episode_id === episodeId);
    setSelectedEpisode(selectedMovie);
    setSelectedRow(episodeId);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '50%', borderRight: '1px solid #ccc', padding: '10px' }} ref={tableRef}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0f0f0' }}>
          <label htmlFor="sortBy">Sort By:</label>
          <select id="sortBy" onChange={handleSortChange} value={sortBy}>
            <option value="episode_id">Episode</option>
            <option value="release_date">Year</option>
          </select>
        </div>
        <h1>Star Wars Movies</h1>
        <input
          type="text"
          placeholder="Search by episode name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: '90%', padding: '8px', margin: '10px 0' }}
        />
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px',textAlign:'center' }}>
          <thead>
            <tr>
              <th>Episode</th>
              <th>Title</th>
              <th>Release Year</th>
            </tr>
          </thead>
          <tbody>
            {sortedMovies.map(movie => (
              <tr
                key={movie.episode_id}
                onClick={() => handleRowClick(movie.episode_id)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedRow === movie.episode_id ? '#ddd' : 'transparent',
                }}
              >
                <td>{movie.episode_id}</td>
                <td>{movie.title}</td>
                <td>{new Date(movie.release_date).getFullYear()}</td>
              </tr>
            ))}
            {filter && filteredMovies.length === 0 && (
              <tr>
                <td colSpan="3">No Such episode exists</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ width: '50%', padding: '20px' }}>
        {selectedEpisode && (
          <div>
            <h2>{selectedEpisode.title}</h2>
            <p>{selectedEpisode.opening_crawl}</p>
          </div>
        )}
      </div>
    </div>
  );
  
}

export default App;
