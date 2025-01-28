"use client";
import React, { useState } from "react";
export default function PastQuizes() {
     const [isOpen, setIsOpen] = useState(false);
    
      const toggleDropdown = () => setIsOpen(!isOpen);
    return (
        <div>
           <button
        className="w-full bg-slate-900 hover:bg-slate-950 text-white px-4 mt-2 py-3 rounded-lg flex justify-between items-center border-2 border-blue-400"
        onClick={toggleDropdown}
      >
        <span className="font-medium">Past Quizes</span>
        {/* <span className="bg-green-600 px-2 py-1 text-sm rounded-md">
          Quiz is active
        </span> */}
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="right-0   bg-slate-900 hover:bg-slate-950 text-white mt-2 rounded-lg shadow-lg border border-gray-700 ">
          <ol type="1" className="px-1 flex flex-row justify-between ">
            <li className="hover:bg-gray-700 rounded px-3 py-3 ">
              Name
            </li>
            <li className="hover:bg-gray-700 rounded px-3 py-3">
              Result
            </li>
            <li className="hover:bg-gray-700 rounded px-3 py-3">
              Date
            </li>
          </ol>
        </div>
      )} 
        </div>
    )
}
