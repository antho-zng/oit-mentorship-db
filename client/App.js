import React from 'react';

import Navbar from './components/Navbar/Navbar';
import Routes from './Routes(class component)';
import Footer from './components/Footer/Footer';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes />
      <Footer />
    </div>
  );
};

export default App;
