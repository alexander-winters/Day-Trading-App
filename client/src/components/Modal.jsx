import React, {useState} from 'react';
import Popup from 'reactjs-popup';

const Modal = () => {
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPass, setConfirmPass] = useState('');

  return (
    <Popup
    trigger={<button className="create-account-btn text-sm underline"> Create an Account </button>}
    modal
  >
    {close => (
      <div className="modal border-2">
        <div className="sign-up-form bg-white py-4 px-12 w-[400px] h-[400px]">
            <button className="block font-bold text-3xl absolute right-4 top-1" onClick={close}>
            &times;
            </button>
         
            <h1 className='text-xl text-center pb-8 pt-4 font-bold'>Create an Account</h1>
            <form action='http://localhost:5173/dashboard' type='submit' className='login-form'>
               <div className="flex flex-col mb-4 px-2">
                  <label htmlFor="name" className='text-sm '>Full Name</label>
                  <input value={name} onChange={(e)=> setName(e.target.value)} id="name" className='text-sm border border-white border-b-gray-400'/>
               </div>

               <div className="flex flex-col mb-4 px-2">
                  <label htmlFor="email" className='text-sm '>Username or Email</label>
                  <input type='email' value={email} onChange={(e)=> setEmail(e.target.value)} id="email" className='text-sm border border-white border-b-gray-400'/>
               </div>

               <div className="flex flex-col mb-4 px-2">
                  <label htmlFor="password" className='text-sm'>Password</label>
                  <input type='password' value={password} onChange={(e)=> setPassword(e.target.value)} id="password" className='text-sm border border-white border-b-gray-400' />
               </div>

               <div className="flex flex-col mb-4 px-2">
                  <label htmlFor="confirmPass" className='text-sm'>Confirm Password</label>
                  <input type='password' value={confirmPass} onChange={(e)=> setConfirmPass(e.target.value)} id="confirmPass" className='text-sm border border-white border-b-gray-400' />
               </div>

               <button className='block bg-blue-500 hover:bg-blue-400 text-white rounded-xl mt-8 px-12 py-2 mx-auto p-4 '>Sign Up</button>
            </form>
         </div>
      </div>
    )}
  </Popup>
  )
};

export default Modal;