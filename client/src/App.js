import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [activeTab, setActiveTab] = useState('IPA');
  const [message, setMessage] = useState('');
  const [vowelData, setVowelData] = useState(null);
  const [consonantData, setConsonantData] = useState(null);

  const fetchRoot = async () => {
    const response = "Hello world!";//await axios.get('http://localhost:5000/');
    setMessage(response);
  };

  // const fetchChar = async () => {
  //   try {
  //     let count = fetchCount();
  //     let responseArr = [];
  //     for (let i = 0; i < count; i++) {
  //       const response = await axios.get('http://localhost:5000/char/' + i);
  //       responseArr.push(response.data);
  //     }
  //     setCharData(responseArr);
  //   } catch (error) {
  //     console.log('Error fetching /char:', error);
  //     setMessage('Error fetching /char' + error);
  //   }
  // };

  const fetchVowelCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/vowels/count');
      setMessage(response.data.count);
      return response.data.count;
    } catch (error) {
      console.log('Error fetching /count:', error);
      setMessage('Error fetching /count' + error);
    }
  };

  const fetchConsonantCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/consonants/count');
      setMessage(response.data.count);
      return response.data.count;
    } catch (error) {
      console.log('Error fetching /count:', error);
      setMessage('Error fetching /count' + error);
    }
  };


  const fetchVowels = async () => {
    try {
      const count = await fetchVowelCount();
      const headers = [];
      const rows = [];

      for (let i = 0; i < count; i++) {
        const response = await axios.get(`http://localhost:5000/vowels/${i}`);
        if (i === 0) {
          headers.push(...Object.keys(response.data));
        }
        rows.push(Object.values(response.data));
      }
      setVowelData({ headers, rows });
    } catch (error) {
      console.log('Error fetching /head:', error);
      setMessage('Error fetching /head' + error);
    }
  }

  const fetchConsonants = async () => {
    try {
      const count = await fetchConsonantCount();
      const headers = [];
      const rows = [];

      for (let i = 0; i < count; i++) {
        const response = await axios.get(`http://localhost:5000/consonants/${i}`);
        if (i === 0) {
          headers.push(...Object.keys(response.data));
        }
        rows.push(Object.values(response.data));
      }
      setConsonantData({ headers, rows });
    } catch (error) {
      console.log('Error fetching /head:', error);
      setMessage('Error fetching /head' + error);
    }
  }

  const makeVowels = () => {
    fetchVowels();
  };

  const makeConsonants = () => {
    fetchConsonants();
  }

  return (
    <div className="App">

      <div className="tabs">
        <button onClick={() => setActiveTab('IPA')}>IPA</button>
        <button onClick={() => setActiveTab('Phonology')}>Phonology</button>
      </div> {/* Closing div for tabs */}

      {activeTab === 'IPA' && (
        <div>
        <button onClick={fetchRoot}>Fetch Root</button>
          {/* <button onClick={fetchChar}>Fetch Char</button> */}
          <button onClick={fetchVowelCount}>Fetch vowel count</button>
          <button onClick={fetchConsonantCount}>Fetch consonant count</button>
          <button onClick={makeVowels}>Make Vowels</button>
          <button onClick={makeConsonants}>Make Consonants</button>
          <p>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>

          {vowelData && (
            <div>
            <h2>Vowels</h2>
            <table style={{ borderCollapse: 'collapse', width: '50%' }}>
              <thead>
                <tr>
                  {vowelData.headers.map((header, index) => (
                    <th key={index} style={{ border: '1px solid black', padding: '8px' }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vowelData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => {
                      const symbolColumnIndex = vowelData.headers.indexOf('symbol');
                      return (
                        <td key={cellIndex} style={{ border: '1px solid black', padding: '8px' }}>
                          {cellIndex === symbolColumnIndex ? String.fromCodePoint(parseInt(cell.replace('U+', ''), 16)) : cell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            </div> // Closing div for vowels
          )}

          {consonantData && (
            <div>
            <h2>Consonants</h2>
            <table style={{ borderCollapse: 'collapse', width: '50%' }}>
              <thead>
                <tr>
                  {consonantData.headers.map((header, index) => (
                    <th key={index} style={{ border: '1px solid black', padding: '8px' }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {consonantData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => {
                      const symbolColumnIndex = consonantData.headers.indexOf('symbol');
                      return (
                        <td key={cellIndex} style={{ border: '1px solid black', padding: '8px' }}>
                          {cellIndex === symbolColumnIndex ? 
                            (isNaN(parseInt(cell.replace('U+', ''), 16)) ? 'NaN' : String.fromCodePoint(parseInt(cell.replace('U+', ''), 16))) 
                            : cell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            </div> // Closing div for consonants
      )}
      </div> // Closing div for flex container
      </div> // Closing div for IPA
      )}

      {activeTab === 'Phonology' && (
        <div>
          <p>Phonology</p>
        </div>
      )}
    </div> // Closing div for App

  );
}

export default App;
