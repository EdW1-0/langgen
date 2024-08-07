import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  const fetchRoot = async () => {
    const response = "Hello world!";//await axios.get('http://localhost:5000/');
    setMessage(response);
  };

  const fetchChar = async () => {
    try {
      const response = await axios.get('http://localhost:5000/char');
      setMessage(response.data);
    } catch (error) {
      console.log('Error fetching /char:', error);
      setMessage('Error fetching /char' + error);
    }
  };

  return (
    <div className="App">
      <button onClick={fetchRoot}>Fetch Root</button>
      <button onClick={fetchChar}>Fetch Char</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
