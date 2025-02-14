import React from 'react'

function Navbar() {
  return (
    <div>
        <div className='bg-gray-900 h-[4rem] flex justify-between items-center px-10'>
        <img src="./logo.png" alt="" className="w-[7rem] h-auto" />
        <div className='flex space-x-4'>
          <button><div className='text-gray-500'>Sign in</div></button>
          <button className="w-20 h-10 bg-[#605DEC] text-white flex justify-center items-center rounded-md">Sign up</button>
          
        </div>
      </div>
    </div>
  )
}

export default Navbar