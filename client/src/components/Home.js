import React, { useState, useEffect } from 'react';

const UserProfile = ({ }) => {
  const userId = 'ABCDEFGH'
  const [userData, setUserData] = useState(null);
  const [stocksData, setStocksData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://127.0.0.1:5000/home?user_id=${userId}`);
      const data = await response.json();

      if (data.user) {
        setUserData(data.user);
      }
      if (data.stocks) {
        setStocksData(data.stocks);
      }
    };

    fetchData();
  }, [userId]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <h2>{userData.name}</h2>
      <p>ID: {userData.id}</p>
      <p>Cash: ${userData.cash / 100}</p>
      <h3>Stocks</h3>
      <ul>
        {stocksData.map((stock, index) => (
          <li key={index}>
            Ticker: {stock.ticker}, Shares: {stock.num_shares}, Purchase Price: ${stock.purchase_price / 100}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
