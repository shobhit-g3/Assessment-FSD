
import React, { useState } from 'react';
import socket from '../socket';



const SubscribeUnsubscribe: React.FC = () => {
  const products = ['BTC-USD', 'ETH-USD', 'XRP-USD', 'LTC-USD'];
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const handleSubscribe = (product: string) => {
    socket.emit('subscribe', product);
    setSubscriptions((prev) => [...prev, product]);
  };

  const handleUnsubscribe = (product: string) => {
    socket.emit('unsubscribe', product);
    setSubscriptions((prev) => prev.filter((p) => p !== product));
  };

  return (
    <div>
      <h2>Subscribe/Unsubscribe</h2>
      <ul>
        {products.map((product) => (
          <li key={product}>
            <button
              onClick={() =>
                subscriptions.includes(product)
                  ? handleUnsubscribe(product)
                  : handleSubscribe(product)
              }
            >
              {subscriptions.includes(product) ? `Unsubscribe ${product}` : `Subscribe ${product}`}
              
            </button>
            {subscriptions.includes(product) && <span> (Subscribed)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubscribeUnsubscribe;
