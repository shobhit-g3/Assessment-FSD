import React, { useEffect, useState } from 'react';
import socket from '../socket';

interface Level2Update {
  bids: [string, string][];
  asks: [string, string][];
}



const PriceView: React.FC = () => {
  const [level2Data, setLevel2Data] = useState<Record<string, Level2Update >>({});
  //const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  useEffect(() => {
    // Listen for level2 updates
    socket.on('level2', (data: { product: string; bids: [string, string][]; asks: [string, string][] }) => {
         console.log('level2 data received:', data);
      setLevel2Data((prev) => ({
        ...prev,
        [data.product]: { bids: data.bids, asks: data.asks },
      }));
    });

    // Cleanup listeners on component unmount
    return () => {
      socket.off('level2');
    };
  }, []);

  return (
    <div>
      <h2>Price View</h2>
      {/* Display Price Data */}
      {Object.keys(level2Data).map((product) => {
        const { bids, asks } = level2Data[product];
        return (
          <div key={product}>
            <h3>{product}</h3>
            <div>
              <h4>Bids</h4>
              {bids.slice(0, 5).map(([price, size]) => (
                <p key={price}>
                  Price: {price}, Size: {size}
                </p>
              ))}
            </div>
            <div>
              <h4>Asks</h4>
              {asks.slice(0, 5).map(([price, size]) => (
                <p key={price}>
                  Price: {price}, Size: {size}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PriceView;
