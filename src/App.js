// src/App.js
import React from 'react';
import {  Route, Routes } from 'react-router-dom';
import './index.css' ;
import Login from './component/Login';
import Success from './component/Success';
import Documents from './component/Documents';
import CurrencyTable from './component/CurrencyTable';


function App() {
  return (
    <Routes>  
       <Route path="/" element={<Login />} />
    <Route path="/success" element={<Success />} />
    <Route path="/documents" element={<Documents />} />
    <Route path="/currency" element={<CurrencyTable />} />
    </Routes>

  );
}

export default App;
