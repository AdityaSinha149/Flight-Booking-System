import React from 'react';
import { useAuth } from '@/app/AuthContext';

function Navbar() {
  const { toggleSignupVisibility, toggleSigninVisibility, loggedIn, toggleLoggedIn, name } = useAuth();
  
  return (
    <nav className="bg-gray-900 h-[4rem] flex justify-between items-center px-10">
      <img src="/logo.png" alt="Logo" className="w-[7rem] h-auto" />
      {loggedIn ? (
        <>
          <h1 className="text-2xl font-bold text-black dark:text-gray-500 ">Welcome {name}</h1>
          <div className="flex space-x-4">
            <button><div className="text-gray-500">My Trips</div></button>
            <button className="w-20 h-10 bg-[#605DEC] text-white flex justify-center items-center rounded-md" onClick={toggleLoggedIn}>Sign out</button>
          </div>
        </>
      ) : (
        <div className="flex space-x-4">
          <button onClick={toggleSigninVisibility}><div className="text-gray-500">Sign in</div></button>
          <button className="w-20 h-10 bg-[#605DEC] text-white flex justify-center items-center rounded-md" onClick={toggleSignupVisibility}>Sign up</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
