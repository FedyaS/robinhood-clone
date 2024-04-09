import React from 'react';
import ReactDOM from 'react-dom';

// ViewOrder Component Definition
function ViewOrder({ userId, orderId }) {
  const [order, setOrder] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:5000/home?user_id=${userId}&order_id=${orderId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        setError(error.toString());
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [userId, orderId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!order) return <div>No order found.</div>;

  return (
    <div>
      <h2>Order Details</h2>
      <p><strong>ID:</strong> {order.id}</p>
      <p><strong>Ticker:</strong> {order.ticker}</p>
      <p><strong>Number of Shares:</strong> {order.num_shares}</p>
      <p><strong>Max Price Per Share:</strong> {order.max_price_per_share / 100} USD</p>
      <p><strong>Purchase Price Per Share:</strong> {order.purchase_price_per_share / 100} USD</p>
      <p><strong>Cash Allotted:</strong> {order.cash_allotted / 100} USD</p>
      <p><strong>Status:</strong> {order.status}</p>
    </div>
  );
}

// Example Parent Component
function App() {
  // Example user ID and order ID
  const userId = 'USER#ABCDEFGH';
  const orderId = 'ORDER#ABCDEFG';

  return (
    <div>
      <h1>Stock Order Viewer</h1>
      <ViewOrder userId={userId} orderId={orderId} />
    </div>
  );
}

// Rendering the App Component
ReactDOM.render(<App />, document.getElementById('root'));
