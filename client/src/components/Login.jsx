import React, {useState} from 'react';
import Modal from './Modal';

const Login = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

  return (
    <div className='auth-form-container bg-white py-40'>
      <h1 className='text-3xl text-center pb-20'>Welcome to Day Trading App</h1>
      <form action='http://localhost:5173/dashboard' type='submit' className='login-form'>
        <div className="flex flex-col mb-4 px-36">
          <label htmlFor="email" className='text-sm '>Username or Email</label>
          <input type='email' value={email} onChange={(e)=> setEmail(e.target.value)} id="email" className='text-sm border border-white border-b-gray-400'/>
        </div>
        <div className="flex flex-col mb-4 px-36">
          <label htmlFor="password" className='text-sm pt-4'>Password</label>
          <input type='password' value={[password]} onChange={(e)=> setPassword(e.target.value)} id="password" className='text-sm border border-white border-b-gray-400' />
        </div>
        <button className='block bg-blue-500 hover:bg-blue-400 text-white rounded-xl mt-10 px-12 py-2 mx-auto p-4 '>Log In</button>
      </form>

      <div className='flex pt-12 justify-center'>
        <p className="text-sm">New to Day Trading? &nbsp;</p>
        <Modal/>
      </div>   
    </div>
  )
}

export default Login;