"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import PastQuizes from "./PastQuizes";
import RunningQuizes from "./RunningQuizes";
import { useTheme } from "./ThemeContext"; // Adjust the import path as necessary
import { Plus, Settings, Save, X, Edit, Trash2, Check, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        className={`w-full ${buttonBgColor} ${buttonHoverBgColor} text-${theme === "dark" ? "white" : "black"} px-4 mt-2 py-3 rounded-lg flex justify-between items-center border-2 border-blue-900`}
        onClick={toggleDropdown}
      >
        <span className="lg:font-bold lg:text-lg sm:text-xs">My Quiz</span>
        <div className="flex flex-row lg:gap-2 sm:gap-1">
        
        <Link href="/quiz-setup">
            <Button
              className={`${theme === "dark"
                  ? "bg-blue-800 hover:bg-blue-950"
                  : "bg-blue-600 hover:bg-blue-700"
                } p-2 flex items-center gap-2`}
            >
              <Plus size={16} />
              New Quiz
            </Button>
        </Link>
        </div>
        
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className={`right-0 ${dropdownBgColor} text-${theme === "dark" ? "white" : "black"} mt-2 p-0  rounded-sm shadow-lg border ${dropdownBorderColor}`}>
         
           
              <RunningQuizes />
              {/* <PastQuizes /> */}
              {/* <Link href="/quiz-setup" className="mt-2 float-right hover:bg-gray-950 shadow-sm-light hover:shadow-blue-900  bg-slate-900 rounded-lg p-2">New + </Link> */}
  
          
        </div>
      )}
    </div>
  );
}