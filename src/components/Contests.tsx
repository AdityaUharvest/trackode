"use client";
import React, { useState } from "react";
export default function Contests() {
     const [isOpen, setIsOpen] = useState(false);
    
      const toggleDropdown = () => setIsOpen(!isOpen);
    return (
        <div>
           <button
        className="w-full bg-neutral-900 text-white px-4 hover:bg-gray-950 mt-2 py-3 rounded-lg flex justify-between items-center border-2 border-blue-400"
        onClick={toggleDropdown}
      >
        <span className="font-medium">Contests</span>
        <span className="bg-red-900 px-2 py-1 text-sm rounded-md">
          Not started !!
        </span>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute left-0 w-full bg-gray-900 text-white mt-2 rounded-lg shadow-lg border border-gray-700 ">
          <ul className="py-2 px-4 space-y-2">
            <li className="hover:bg-gray-700 rounded px-3 py-2">
              Item 1: Basic Concepts
            </li>
            <li className="hover:bg-gray-700 rounded px-3 py-2">
              Item 2: Getting Started
            </li>
            <li className="hover:bg-gray-700 rounded px-3 py-2">
              Item 3: Core Principles
            </li>
          </ul>
        </div>
      )} 
        </div>
    )
}
