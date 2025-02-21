"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import PastQuizes from "./PastQuizes";
import RunningQuizes from "./RunningQuizes";
import { useTheme } from "./ThemeContext"; // Adjust the import path as necessary
import { Plus, Settings, Save, X, Edit, Trash2, Check, NotebookPen, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

export default function Quizes() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme(); // Use the theme context

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Determine the background colors based on the theme
  const buttonBgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const dropdownBgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const buttonHoverBgColor = theme === "dark" ? "hover:bg-gray-900" : "hover:bg-amber-50";
  const dropdownBorderColor = theme === "dark" ? "border-gray-700" : "border-amber-50";

  return (
    <div>
      {/* Replace the outer <button> with a <div> */}
      <div
        className={`w-full ${buttonBgColor} ${buttonHoverBgColor} text-${theme === "dark" ? "white" : "black"} px-4 mt-2 py-3 rounded-lg flex justify-between items-center border-2 border-blue-900`}
        role="button" // Make it accessible
        tabIndex={0} // Make it focusable
        onClick={toggleDropdown} // Add the click handler here
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            toggleDropdown();
          }
        }} // Handle keyboard events
      >
        <div className="flex items-center gap-2">
          <span className="lg:font-bold lg:text-lg sm:text-xs">My Quiz</span>
          <ChevronDown
            size={20}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
        <div className="flex flex-row lg:gap-2 sm:gap-1">
          <Link href="/quiz-setup">
            <Button
              className={`${theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700"
                } text-white p-2 flex items-center gap-2`}
            >
              <Plus size={16} />
              New Quiz
            </Button>
          </Link>
        </div>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div className={`right-0 ${dropdownBgColor} text-${theme === "dark" ? "white" : "black"} mt-2 p-0 rounded-sm shadow-lg border ${dropdownBorderColor}`}>
          <RunningQuizes />
          {/* <PastQuizes /> */}
        </div>
      )}
    </div>
  );
}