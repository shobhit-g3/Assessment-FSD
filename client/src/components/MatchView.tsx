
import React, { useEffect, useState } from 'react';
import socket from '../socket';

interface Match {
  timestamp: string;
  product: string;
  size: string;
  price: string;
  side: 'buy' | 'sell';
}

const MatchView: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    socket.on('match', (data: Match) => {
      setMatches((prev) => [data, ...prev.slice(0, 99)]);
    });

    return () => {
      socket.off('match');
    };
  }, []);

  return (
    <div>
      <h2>Match View</h2>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Product</th>
            <th>Size</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, index) => (
            <tr key={index}>
              <td>{match.timestamp}</td>
              <td>{match.product}</td>
              <td>{match.size}</td>
              <td style={{ color: match.side === 'buy' ? 'green' : 'red' }}>{match.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchView;
