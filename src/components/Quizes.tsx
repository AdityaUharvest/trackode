"use client";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import RunningQuizes from "./RunningQuizes";
import { useTheme } from "./ThemeContext"; // Adjust the import path as necessary
import { Plus, Settings, Save, X, Edit, Trash2, Check, NotebookPen, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
interface Quiz {
  _id: string;
  name: string;
  active: boolean;
  questions?: Question[];
  createdAt: string;
  public?: boolean;
  randomize?: boolean;
  shareCode:String;
  isPublished?: boolean;
}
interface Question {
  _id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  imageUrl?: string;
}

export default function Quizes({ quizes,setQuizes,getQuizes }: { quizes: Quiz[]; setQuizes: React.Dispatch<React.SetStateAction<Quiz[]>>; getQuizes: () => Promise<void>; }) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme(); // Use the theme context
  
   // Adjust the base URL as neede
  return (
    <div className={`flex flex-col gap-4 p-4 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
      <div className="flex justify-between items-center">
        {/* Replace the outer <button> with a <div> */}
        <div className={`flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
          <span className="text-sm font-semibold">My Quiz</span>
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
      <RunningQuizes quizes={quizes} setQuizes={setQuizes} getQuizes={getQuizes}/>
      
    </div>
  );
}
    