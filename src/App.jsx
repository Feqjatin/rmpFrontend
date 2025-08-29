import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState([]);  

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await fetch("https://localhost:7084/api/db");
        let json = await res.json();
        setData(json);
        console.log(json);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <p>first set up</p>
      <table border="1">
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>age</th>
          </tr>
        </thead>
        <tbody>
          {data.map((i) => (
            <tr key={i.id}>
              <td>{i.id}</td>
              <td>{i.name}</td>
              <td>{i.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
