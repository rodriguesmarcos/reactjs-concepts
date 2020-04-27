import React, { useEffect, useState } from 'react';

import api from './services/api';

import './styles.css';

function App() {
  const [repositories, setRepositories] = useState([]);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [techs, setTechs] = useState('');

  useEffect(() => {
    api.get('repositories').then((response) => setRepositories(response.data));
  }, []);

  async function handleAddRepository() {
    try {
      const { data: repository } = await api.post('repositories', {
        title: title.trim(),
        url: url.trim(),
        techs: techs.split(',').map((tech) => tech.trim()),
      });

      setRepositories([...repositories, repository]);
    } catch {
      setError(
        'There was an error when trying to add the repository, please try again'
      );
    }
  }

  async function handleRemoveRepository(id) {
    try {
      await api.delete(`repositories/${id}`);
      setRepositories([...repositories.filter((repo) => repo.id !== id)]);
    } catch {
      setError(
        'There was an error when trying to remove the repository, please try again'
      );
    }
  }

  function handleTitleInput({ target }) {
    setTitle(target.value);
  }

  function handleUrlInput({ target }) {
    setUrl(target.value);
  }

  function handleTechInput({ target }) {
    setTechs(target.value);
  }

  return (
    <div>
      {error.length > 0 && <span>{error}</span>}
      <ul data-testid='repository-list'>
        {repositories.map(({ id, title }) => (
          <li key={id}>
            <h2>{title}</h2>

            <button onClick={() => handleRemoveRepository(id)}>Remover</button>
          </li>
        ))}
      </ul>

      <div className='fake-form'>
        <input
          type='text'
          placeholder='Repository Title'
          onChange={handleTitleInput}
          value={title}
        />
        <input
          type='url'
          placeholder='Repository URL'
          onChange={handleUrlInput}
          value={url}
        />
        <input
          type='text'
          placeholder='Repository Techs'
          onChange={handleTechInput}
          value={techs}
        />
      </div>
      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
