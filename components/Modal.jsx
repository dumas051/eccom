import React from "react";

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-lg shadow-lg relative max-w-full">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
        aria-label="Close"
      >
        &times;
      </button>
      {children}
    </div>
  </div>
);

export default Modal; 