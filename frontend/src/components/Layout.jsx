import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import '../App.css';

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-content">
        <Hero />
        {children}
      </div>
    </div>
  );
}