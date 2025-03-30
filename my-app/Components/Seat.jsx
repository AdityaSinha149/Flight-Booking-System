import React from 'react';

export default function Seat({ num, available, selected, onClick }) {
  const getBgColor = () => {
    if (selected) return "bg-[#605DEC] hover:bg-[#4d4aa8]";
    if (available) return "bg-green-400 hover:bg-green-500";
    return "bg-gray-300";
  };

  return (
    <button
      className={`${getBgColor()} w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold m-1 transition-colors ${!available && 'opacity-50 cursor-not-allowed'}`}
      disabled={!available}
      onClick={onClick}
    >
      {num}
    </button>
  );
}
