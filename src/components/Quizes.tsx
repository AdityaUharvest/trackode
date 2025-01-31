"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import PastQuizes from "./PastQuizes";
import RunningQuizes from "./RunningQuizes";
import { useTheme } from "./ThemeContext"; // Adjust the import path as necessary

export default function Quizes() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme(); // Use the theme context

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Determine the background colors based on the theme
  const buttonBgColor = theme === "dark" ? "bg-neutral-900" : "bg-amber-50";
  const dropdownBgColor = theme === "dark" ? "bg-neutral-900" : "bg-amber-50";
  const buttonHoverBgColor = theme === "dark" ? "hover:bg-gray-950" : "hover:bg-amber-100";
  const dropdownBorderColor = theme === "dark" ? "border-gray-700" : "border-amber-200";

  return (
    <div>
      <button
        className={`w-full ${buttonBgColor} ${buttonHoverBgColor} text-${theme === "dark" ? "white" : "black"} px-4 mt-2 py-3 rounded-lg flex justify-between items-center border-2 border-blue-400`}
        onClick={toggleDropdown}
      >
        <span className="font-bold text-xl">Quizes</span>
        <span className="bg-green-600 px-2 py-1 rounded-md">
          Quiz is active
        </span>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className={`right-0 ${dropdownBgColor} text-${theme === "dark" ? "white" : "black"} mt-2 pb-10 rounded-lg shadow-lg border ${dropdownBorderColor}`}>
          <ul className="py-2 px-4 space-y-2">
            <li className="rounded px-3 py-2">
              <RunningQuizes />
              {/* <PastQuizes /> */}
              {/* <Link href="/quiz-setup" className="mt-2 float-right hover:bg-gray-950 shadow-sm-light hover:shadow-blue-900  bg-slate-900 rounded-lg p-2">New + </Link> */}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}