import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [clicks, setClicks] = useState([]);
  const [shrinkCoin, setShrinkCoin] = useState(null);
  const [khBalance, setKhBalance] = useState(0);
  const [dtBalance, setDtBalance] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const playBeepSound = () => {
    if (!isMuted) {
      const audio = new Audio(`/audio.mp3`);
      audio.play();
    }
  };

  const formatBalance = (balance) => {
    if (balance >= 1e7) {
      if (balance >= 1e12) {
        return `${(balance / 1e12).toFixed(1)} T`;
      } else if (balance >= 1e9) {
        return `${(balance / 1e9).toFixed(1)} B`;
      } else if (balance >= 1e6) {
        return `${(balance / 1e6).toFixed(1)} M`;
      }
    }
    return balance.toString();
  };

  const fetchBalances = async () => {
    try {
      const response = await axios.get(`https://api.clashofpresidents.fun/api/get-balances`);
      setKhBalance(response.data.khBalance);
      setDtBalance(response.data.dtBalance);
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  useEffect(() => {
    fetchBalances();
    const interval = setInterval(fetchBalances, 15000); // 15000ms = 15s

    return () => clearInterval(interval); // Cleanup interval on component unmount
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
      const response = await axios.post(`https://api.clashofpresidents.fun/api/update-balance`, {
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

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className='home-background'>
      <div className='contact-address-nav'>
        <p>CA: Coming Soon...</p>
        <p className='ticker'>| <span>Ticker: $clash</span></p>
      </div>
      <nav>
        <h1>$ClashOfPresidents</h1>
        <div className='nav-items'>
          <a className='twitter' href='https://t.me/battleofpresidents' target='__blank'><img src='/t.jpg' alt='telegram' /></a >
          <a className='telegram' href='https://x.com/battleofpresi' target='__blank'><img src='/x.jpg' alt='x' /></a>
          <img className="mute-icon" src={isMuted ? "/mute1.png" : "/mute2.jpeg"} onClick={toggleMute} alt="Mute/Unmute"></img>
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
        <a href='https://pump.fun/Bk5wQ5chVapsJbztR8LaDGPXgTtP1uNEiyXhpENL3y2d' target='__blank'>Buy Now</a>
      </div>
      <div className='poll-results'>
        <div className='result-inner-container kh'>
          <img src='/khr.png' alt='KH' />
          <h1 style={{ fontSize: khBalance >= 1e7 ? '52px' : '42px' }}>{formatBalance(khBalance)}</h1>
        </div>
        <img className='vs' src='/tt.gif' alt='vs' />
        <div className='result-inner-container dt'>
          <img src='/dtr.png' alt='DT' />
          <h1 style={{ fontSize: dtBalance >= 1e7 ? '52px' : '42px' }}>{formatBalance(dtBalance)}</h1>
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
