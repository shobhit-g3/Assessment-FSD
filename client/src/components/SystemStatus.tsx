
import React, { useEffect, useState } from 'react';
import socket from '../socket';

interface Channel {
  product: string;
  channels: string[];
}

const SystemStatus: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    // Listen for 'systemStatus' event from the backend
    socket.on('systemStatus', (data: { channels: Channel[] }) => {
      setChannels(data.channels);
    });

    return () => {
      socket.off('systemStatus');
    };
  }, []);

  return (
    <div>
      <h2>System Status</h2>
      <ul>
        {channels.map((channel, index) => (
          <li key={index}>
            <strong>{channel.product}</strong>: {channel.channels.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SystemStatus;
