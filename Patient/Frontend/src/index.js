import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {
      <h1 className='PageTitle'>
        Med<a className='Records'>Records-</a>Patient
      </h1>
    }
    <App />
  </React.StrictMode>
);
