import React from 'react';
import logo from '../assets/logo.png';
import Login from './Login';

const Home = () => {
  return (
    <div className="home-container grid grid-cols-2 divide-x h-[720px]">
      <div className='logo-container flex-shrink-0 bg-neutral-100 items-center py-24'>
        <img src={logo} alt="app logo" className='w-[565px] min-w-50% h-[369px] min-h-50%' />
      </div>
      <Login />
    </div>
  )
}

export default Home;
