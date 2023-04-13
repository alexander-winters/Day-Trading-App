// Buy_Sell_Modal.jsx
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-black opacity-50 w-full h-full absolute" onClick={onClose}></div>
      <div className="bg-white w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 p-6 rounded-md z-10">
        {children}
      </div>
    </div>
  );
};

export default Modal;
