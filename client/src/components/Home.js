import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from "../contexts/UserContext";

import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const UserProfile = ({ }) => {
  const navigate = useNavigate();
  const { userID } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [stocksData, setStocksData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://127.0.0.1:5000/home?user_id=${userID}`);
      const data = await response.json();

      if (data.user) {
        setUserData(data.user);
      }
      if (data.stocks) {
        setStocksData(data.stocks);
      }
      if (data.orders) {
        setOrdersData(data.orders)
      }
    };

    fetchData();
  }, [userID]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleOrderClick = (orderID) => {
    navigate('/view-order', { state: { orderID: orderID } });
  }


return (
  <div>
    <Typography variant="h4" gutterBottom>
      User Profile
    </Typography>
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h2">
          {userData.name}
        </Typography>
        <Typography color="textSecondary">
          ID: {userData.id}
        </Typography>
        <Typography variant="body1">
          Cash: ${userData.cash / 100}
        </Typography>
      </CardContent>
    </Card>
    <Typography variant="h5" marginTop={"20px"} gutterBottom component="h2">
      Stocks
    </Typography>
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ticker</TableCell>
            <TableCell align="right">Shares</TableCell>
            <TableCell align="right">Value ($)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stocksData.map((stock, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {stock.ticker}
              </TableCell>
              <TableCell align="right">{stock.num_shares}</TableCell>
              <TableCell align="right">${stock.num_shares * stock.last_price / 100}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
    <Typography variant="h5" marginTop={"20px"} gutterBottom component="h2">
      Orders
    </Typography>
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Ticker</TableCell>
            <TableCell align="right">Shares</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Value ($)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ordersData.map((order, index) => (
            <TableRow key={index} onClick={() => handleOrderClick(order.id)} hover={true}>
              <TableCell component="th" scope="row">{order.id}</TableCell>
              <TableCell>
                {order.ticker}
              </TableCell>
              <TableCell align="right">{order.num_shares}</TableCell>
              <TableCell align="right">{order.status}</TableCell>
              <TableCell align="right">${order.num_shares * order.purchase_price_per_share / 100}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  </div>
);

};

export default UserProfile;
