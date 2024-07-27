import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [clicks, setClicks] = useState([]);
  const [shrinkCoin, setShrinkCoin] = useState(null);
  const [khBalance, setKhBalance] = useState(0);
  const [dtBalance, setDtBalance] = useState(0);

  const playBeepSound = () => {
    const audio = new Audio(`/audio.mp3`);
    audio.play();
  };

  const formatBalance = (balance) => {
    if (balance >= 1e12) {
      return `${(balance / 1e12).toFixed(1)} T`;
    } else if (balance >= 1e9) {
      return `${(balance / 1e9).toFixed(1)} B`;
    } else if (balance >= 1e6) {
      return `${(balance / 1e6).toFixed(1)} M`;
    } else if (balance >= 1e3) {
      return `${(balance / 1e3).toFixed(1)} K`;
    } else {
      return balance.toString();
    }
  };

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const response = await axios.get(`https://api.battleofpresident.fun/api/get-balances`);
        setKhBalance(response.data.khBalance);
        setDtBalance(response.data.dtBalance);
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    };

    fetchBalances();
  }, []);

  const handleCoinClick = async (coinType, e) => {
    playBeepSound();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setClicks((prevClicks) => [...prevClicks, { id: Date.now(), x, y }]);
    setShrinkCoin(coinType);
    setTimeout(() => {
      setShrinkCoin(null);
    }, 100);

    try {
      const response = await axios.post(`https://api.battleofpresident.fun/api/update-balance`, {
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
          src='/kh1.png'
          className={`kh-coin ${shrinkCoin === 'kh' ? 'shrink' : ''}`}
          onClick={(e) => handleCoinClick('kh', e)}
        ></img>
        <img
          src='/dt1.png'
          className={`dt-coin ${shrinkCoin === 'dt' ? 'shrink' : ''}`}
          onClick={(e) => handleCoinClick('dt', e)}
        ></img>
      </div>
      <div className='view-results'>
        <h1>Buy Now</h1>
      </div>
      <div className='poll-results'>
        <div className='result-inner-container kh'>
          <img src='/khr.png' alt='KH' />
          <h1>{formatBalance(khBalance)}</h1>
        </div>
        <img className='vs' src='/tt.gif' alt='vs' />
        <div className='result-inner-container dt'>
          <img src='/dtr.png' alt='DT' />
          <h1>{formatBalance(dtBalance)}</h1>
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
