import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [activeTab, setActiveTab] = useState('IPA');
  const [message, setMessage] = useState('');
  const [tableData, setTableData] = useState(null);

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

  const fetchCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/count');
      setMessage(response.data.count);
      return response.data.count;
    } catch (error) {
      console.log('Error fetching /count:', error);
      setMessage('Error fetching /count' + error);
    }
  };

  const fetchHead = async () => {
    try {
      const count = await fetchCount();
      const headers = [];
      const rows = [];

      for (let i = 0; i < count; i++) {
        const response = await axios.get(`http://localhost:5000/char/${i}`);
        if (i === 0) {
          headers.push(...Object.keys(response.data));
        }
        rows.push(Object.values(response.data));
      }
      setTableData({ headers, rows });
    } catch (error) {
      console.log('Error fetching /head:', error);
      setMessage('Error fetching /head' + error);
    }
  }

  const makeTable = () => {
    fetchHead();
  };

  return (
    <div className="App">
      <div className="tabs">
        <button onClick={() => setActiveTab('IPA')}>IPA</button>
        <button onClick={() => setActiveTab('Phonology')}>Phonology</button>
      </div>

      {activeTab === 'IPA' && (
        <div>
          <button onClick={fetchRoot}>Fetch Root</button>
          {/* <button onClick={fetchChar}>Fetch Char</button> */}
          <button onClick={fetchCount}>Fetch count</button>
          <button onClick={makeTable}>Make Table</button>
          <p>{message}</p>
          {tableData && (
            <table style={{ borderCollapse: 'collapse', width: '50%' }}>
              <thead>
                <tr>
                  {tableData.headers.map((header, index) => (
                    <th key={index} style={{ border: '1px solid black', padding: '8px' }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => {
                      const symbolColumnIndex = tableData.headers.indexOf('symbol');
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
          )}
        </div>
      )}

      {activeTab === 'Phonology' && (
        <div>
          <p>Phonology</p>
        </div>
      )}
    </div>

  );
}

export default App;
