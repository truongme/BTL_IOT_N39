import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ShowIotContext = createContext();

export const useShowIot = () => {
  return useContext(ShowIotContext);
};

export const ShowIotProvider = ({ children }) => {
  const [showIotData, setShowIotData] = useState({
    temp: '',
    hum: '',
    gas: '',
    flame: '',
    chartData: [],
  });

  const [notification, setNotification] = useState(null);


  const addData = (newData) => {
    setShowIotData((prevData) => {
      const updatedData = [...prevData.chartData, newData].slice(-7);
      return { ...prevData, chartData: updatedData };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tempResponse, humResponse, gasResponse, flameResponse] = await Promise.all([
          axios.get('http://localhost:8080/api/temp'),
          axios.get('http://localhost:8080/api/hum'),
          axios.get('http://localhost:8080/api/gas'),
          axios.get('http://localhost:8080/api/flame'),
        ]);

        if (tempResponse.data.message !== null) {
          setShowIotData((prevData) => ({ ...prevData, temp: tempResponse.data.message }));
        } 

        if (humResponse.data.message !== null) {
          setShowIotData((prevData) => ({ ...prevData, hum: humResponse.data.message }));
        }

        if (gasResponse.data.message !== null) {
          setShowIotData((prevData) => ({ ...prevData, gas: gasResponse.data.message }));
        }

        if (flameResponse.data.message !== null) {
          setShowIotData((prevData) => ({ ...prevData, flame: flameResponse.data.message }));
        }

        const newHum = humResponse.data.message;
        const newGas = gasResponse.data.message;
        const newTemp = tempResponse.data.message;
        const newFlame = flameResponse.data.message;

        const dataToSend = {
          temp: newTemp,
          hum: newTemp,
          gas: newGas,
          flame: newFlame,
        };
        
        if (newTemp !== null && newHum !== null && newGas !== null && newFlame !== null) {
          axios.post(`http://localhost:8080/api/data`, dataToSend)
          .then(response => {
            console.log('Response from backend:', response.data);
            setNotification(response.data)
          })
          .catch(error => {
            console.error('Error sending data to backend:', error);
          });
        }

        if (newTemp !== null && newHum !== null && newGas !== null) {
          const newData = {
            name: new Date().toLocaleTimeString(),
            temp: newTemp,
            hum: newHum,
            gas: newGas,
          };
          addData(newData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <ShowIotContext.Provider value={{ showIotData, notification, setShowIotData }}>
      {children}
    </ShowIotContext.Provider>
  );
};
