import React from 'react';
import logo from '../assets/logo.png';

const Home = () => {
  return (
    <div className='logo-container flex-shrink-0 bg-neutral-100 items-center py-24'>
      <img src={logo} alt="app logo" className='w-[565px] min-w-50% h-[369px] min-h-50%' />
    </div>
  )
}

export default Home;
