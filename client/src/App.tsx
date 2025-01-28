
import React from 'react';
import SubscribeUnsubscribe from './components/SubscribeUnsubscribe';
import PriceView from './components/PriceView';
import MatchView from './components/MatchView';
import SystemStatus from './components/SystemStatus';

const App: React.FC = () => {
  return (
    <div>
      <h1>Crypto Trading Dashboard</h1>
      <SubscribeUnsubscribe />
       <PriceView />
       <MatchView />
       <SystemStatus />

    </div>
  );
};

export default App;
