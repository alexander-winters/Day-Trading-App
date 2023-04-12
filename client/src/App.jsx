import React from 'react';
import Home from './components/home';
import Login from './components/Login';
const App = () => {
  return (
    <div className='Application grid grid-cols-2 divide-x h-[720px]'>
      <Home />
      <Login/>
    </div>
  );
}


export default App
