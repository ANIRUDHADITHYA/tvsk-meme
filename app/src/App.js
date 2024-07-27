import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [clicks, setClicks] = useState([]);
  const [shrinkCoin, setShrinkCoin] = useState(null); // state to handle shrinking coin animation
  const [khBalance, setKhBalance] = useState(0);
  const [dtBalance, setDtBalance] = useState(0);

  const playBeepSound = () => {
    const audio = new Audio(`/audio.mp3`);
    audio.play();
  };

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/get-balances`);
        setKhBalance(response.data.khBalance);
        setDtBalance(response.data.dtBalance);
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    };

    fetchBalances();
  }, []);

  const handleCoinClick = async (coinType, e) => {
    // Play beep sound
    playBeepSound();

    // Get the click position relative to the container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add click animation
    setClicks((prevClicks) => [...prevClicks, { id: Date.now(), x, y }]);

    // Apply shrinking animation
    setShrinkCoin(coinType);
    setTimeout(() => {
      setShrinkCoin(null); // Remove the shrinking animation class after 300ms
    }, 100);

    // Call API to update balance
    try {
      const response = await axios.post(`http://localhost:3001/api/update-balance`, {
        coinType,
      });
      if (coinType === 'kh') {
        setKhBalance(response.data.balance);
      } else if (coinType === 'dt') {
        setDtBalance(response.data.balance);
      }
    } catch (error) {
      console.error('Error updating balance:', error);
    }

    // Remove the click animation after it finishes
    setTimeout(() => {
      setClicks((prevClicks) => prevClicks.filter((click) => click.id !== Date.now()));
    }, 1000);
  };

  return (
    <div className='home-background'>
      <nav>
        <h1>$BattleOfPresident</h1>
        <div className='nav-items'>
          <img src='/t.jpg' alt='Trump' />
          <img src='/x.jpg' alt='Harris' />
        </div>
      </nav>
      <div className='coin-wrapper'>
        <img
          src='/kh.png'
          className={`kh-coin ${shrinkCoin === 'kh' ? 'shrink' : ''}`}
          onClick={(e) => handleCoinClick('kh', e)}
        ></img>
        <img
          src='/dt.png'
          className={`dt-coin ${shrinkCoin === 'dt' ? 'shrink' : ''}`}
          onClick={(e) => handleCoinClick('dt', e)}
        ></img>
      </div>
      <div className='view-results'>
        <h1>Buy Now</h1>
      </div>
      <div className='poll-results'>
        <div className='result-inner-container kh'>
          <img src='/khr.png'></img>
          <h1>{khBalance.toLocaleString()}</h1>
        </div>
        <img className='vs' src='/tt.gif'></img>
        <div className='result-inner-container dt'>
          <img src='/dtr.png'></img>
          <h1>{dtBalance.toLocaleString()}</h1>
        </div>
      </div>
      {clicks.map((click) => (
        <div
          key={click.id}
          className="fly-text"
          style={{ left: click.x, top: click.y }}
        >
          +1
        </div>
      ))}
    </div>
  );
}

export default App;
