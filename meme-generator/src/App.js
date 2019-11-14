import React from 'react';
import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import MemeGenerator from './Components/MemeGenerator';

function App() {
  return (
    <div>
      <Header />
      <MemeGenerator />
      <Footer />
    </div>
  );
}

export default App;
