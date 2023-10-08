import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white z-10 w-full  max-w-[926px] h-auto rounded-lg lg:!mx-0 md:mx-5 sm:mx-5 mx-3">
        {children}
        {/* <button className="mt-4 px-4 py-2 bg-blue-500 text-white" onClick={onClose}>
          Close
        </button> */}
      </div>
    </div>
  );
};

export default Modal;
