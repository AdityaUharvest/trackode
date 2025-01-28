"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
export default function RunningQuizes() {
  const [isOpen, setIsOpen] = useState(false);
  const [quizName, setQuizName] = useState("Quiz Name");
  const [result, setResult] = useState("Result");
  const [status, setStatus] = useState(false);
  const [started, setStarted] = useState(true);
  const toggleDropdown = () => setIsOpen(!isOpen);
  return (
    <div>
      <button
        className="w-full bg-slate-900 hover:bg-slate-950 text-white px-4 mt-2 py-3 rounded-lg flex justify-between items-center border-2 border-blue-400"
        onClick={toggleDropdown}
      >
        <span className="font-medium">Running Quizes</span>
        {/* <span className="bg-green-600 px-2 py-1 text-sm rounded-md">
          
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
            <li className=" rounded px-3 py-2">
              {started ? <button onClick={()=>{
                setStarted(!started)
                toast.warning("Quiz Stopped");
              }} className ="bg-red-500 hover:bg-red-950 px-3 py-1 rounded-lg">Stop</button> :<button onClick={() => {
                setStarted(!started)
                toast.success("Quiz Started");
              }}
              className="bg-green-500 hover:bg-green-950 px-3 py-1 rounded-lg">Start</button>
              }

            </li>

          </ol>
        </div>
      )}
    </div>
  )
}
