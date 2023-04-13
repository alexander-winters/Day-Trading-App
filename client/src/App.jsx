// App.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/home';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <div className="Application">
      <Routes>
        <Route
          path="/"
          element={
            <div className="h-screen w-full">
              <Home />
            </div>
          }
        />
        <Route
          path="/dashboard"
          element={
            <div className="h-screen w-full">
              <Dashboard />
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
