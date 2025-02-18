import React from 'react';

function Navbar({ onSignupClick,onSigninClick }) {
  return (
    <nav className="bg-gray-900 h-[4rem] flex justify-between items-center px-10">
      <img src="/logo.png" alt="Logo" className="w-[7rem] h-auto" />
      <div className="flex space-x-4">
        <button onClick={onSigninClick}><div className="text-gray-500">Sign in</div></button>
        <button 
          className="w-20 h-10 bg-[#605DEC] text-white flex justify-center items-center rounded-md"
          onClick={onSignupClick}
        >
          Sign up
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
