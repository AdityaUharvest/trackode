"use client";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';;
import axios from "axios";
import { Edit, Save, X, Trash2, Check, Share, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/ThemeContext";
import Link from "next/link";
interface Quiz {
  _id: string;
  name: string;
  active: boolean;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  totalMarks: number;
  totalQuestions: number;
  instructions: string;
  shuffleOptions: boolean;
  questions?: Question[];
}

interface Question {
  _id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  imageUrl?: string;
}

const API_BASE_URL = "/api";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const quizId = resolvedParams.id;
  const { theme } = useTheme();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingQuiz, setIsEditingQuiz] = useState(false);
  const [updatedQuiz, setUpdatedQuiz] = useState<Quiz | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [shareLink, setShareLink] = useState("");

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/quiz-get/${quizId}`);
        if (response.data.success) {
          setQuiz(response.data.quiz);
          setUpdatedQuiz(response.data.quiz); // Initialize updatedQuiz with fetched data
          setIsPublished(response.data.quiz.active);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch quiz");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Handle input changes for quiz fields
  const handleQuizChange = (field: keyof Quiz, value: string | number | boolean) => {
    setUpdatedQuiz((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  // Update the entire quiz
  const handleUpdateQuiz = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/quiz-update/${quizId}`, {updatedQuiz});
      
      if (response.data.success) {
        setQuiz(updatedQuiz);
        toast.success("Quiz updated successfully");
        setIsEditingQuiz(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update quiz");
    }
  };
  
  // Publish quiz
  
  const handleDeleteQuiz = async () => {
   
    try {
      
      const response = await axios.delete(`${API_BASE_URL}/quiz-update/${quizId}`);
      if (response.data.success) {
        
        toast.success("Quiz Deleted successfully!");
        window.location.href = "/admin-dashboard"
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to Delete quiz");
    } 
  };
  const handleUpdateQuestion = async (questionId: string, updatedQuestion: Question) => {
    
    const response = await axios.put(`${API_BASE_URL}/questions`, {questionId,newQuestion:updatedQuestion})
    
    if(response.data.success){
      toast.success("Question Updated Successfully");
      
    }
    // const updatedQuestions = quiz?.questions?.map((q) => (q._id === questionId ? updatedQuestion : q));
    setQuiz((prev) => ({
      ...prev!,
      questions: prev?.questions?.map((q) => (q._id === questionId ? updatedQuestion : q)),
    }));
  }
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${theme === "dark" ? "border-primary" : "border-indigo-600"}`}></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className={`text-xl ${theme === "dark" ? "text-white" : "text-black"}`}>Quiz not found.</p>
      </div>
    );
  }

  return (
    <div className={`p-6  lg:flex ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
      {/* Left Half: Quiz Details */}
      <div className="lg:w-1/2 md:w-1/2 sm:w-full  pr-3">
        <Card className={`h-full ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">
                {isEditingQuiz ? (
                  <Input
                    value={updatedQuiz?.name || ""}
                    onChange={(e) => handleQuizChange("name", e.target.value)}
                    className={`w-full ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}
                  />
                ) : (
                  quiz.name
                )}
              </CardTitle>
              <div className="flex gap-2">
                {isEditingQuiz ? (
                  <>
                    <Button onClick={handleUpdateQuiz} className="bg-green-600 text-white hover:bg-green-700">
                      <Save size={16} className="mr-2" />
                      Save
                    </Button>
                    <Button onClick={() => setIsEditingQuiz(false)} className="bg-gray-500 hover:bg-gray-600">
                      <X size={16} className="mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditingQuiz(true)} className="bg-indigo-600 text-white hover:bg-indigo-700">
                    <Edit size={16} className="mr-2" />
                    Edit Quiz
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                
                
                {!isPublished && (
                  <Button onClick={
                    ()=>{
                      prompt(`Are you sure you want to delete this quiz? Type "${quiz?.name}" to confirm.`) === `${quiz?.name}` && handleDeleteQuiz()
                     }}  className="bg-red-600 text-white hover:bg-red-700">
                    <Trash2></Trash2>
                  </Button>
                )}

                {isPublished && (
                  <Button
                  onClick={() => {
                    const link = `${window.location.origin}/quiz-play/${quizId}`;
                    navigator.clipboard.writeText(link)
                      .then(() => {
                        toast.success("Link copied to clipboard!");
                      })
                      .catch((error) => {
                       
                        toast.error("Failed to copy link");
                      });
                  }}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  <Share size={16} className="mr-2" />
                  Share Quiz
                </Button>
                )}
              </div>

              {/* Quiz Details */}
              {isEditingQuiz ? (
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-2">Start Date</label>
                    <Input
                      type="date"
                      value={updatedQuiz?.startDate?.split("T")[0] || ""}
                      onChange={(e) => handleQuizChange("startDate", e.target.value)}
                      className={`w-full ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">End Date</label>
                    <Input
                      type="date"
                      value={updatedQuiz?.endDate?.split("T")[0] || ""}
                      onChange={(e) => handleQuizChange("endDate", e.target.value)}
                      className={`w-full ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Start Time</label>
                    <Input
                      type="time"
                      value={updatedQuiz?.startTime || ""}
                      onChange={(e) => handleQuizChange("startTime", e.target.value)}
                      className={`w-full ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">End Time</label>
                    <Input
                      type="time"
                      value={updatedQuiz?.endTime || ""}
                      onChange={(e) => handleQuizChange("endTime", e.target.value)}
                      className={`w-full ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Total Marks</label>
                    <Input
                      type="number"
                      value={updatedQuiz?.totalMarks || 0}
                      onChange={(e) => handleQuizChange("totalMarks", Number(e.target.value))}
                      className={`w-full ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Total Questions</label>
                    <Input
                      type="number"
                      value={updatedQuiz?.totalQuestions || 0}
                      onChange={(e) => handleQuizChange("totalQuestions", Number(e.target.value))}
                      className={`w-full ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Instructions</label>
                    <Textarea
                      value={updatedQuiz?.instructions || ""}
                      onChange={(e) => handleQuizChange("instructions", e.target.value)}
                      className={`w-full ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Shuffle Options</label>
                    <input
                      type="checkbox"
                      checked={updatedQuiz?.shuffleOptions || false}
                      onChange={(e) => handleQuizChange("shuffleOptions", e.target.checked)}
                      className="ml-2 accent-indigo-800"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-sm">
                  <p><strong>Start Date:</strong> {quiz.startDate?.split("T")[0]}</p>
                  <p><strong>End Date:</strong> {quiz.endDate?.split("T")[0]}</p>
                  <p><strong>Start Time:</strong> {quiz.startTime}</p>
                  <p><strong>End Time:</strong> {quiz.endTime}</p>
                  <p><strong>Total Marks:</strong> {quiz.totalMarks}</p>
                  
                  <p><strong>Total Questions:</strong> {quiz.totalQuestions}</p>
                  <p style={{ whiteSpace: 'pre-line' }}>
                    <strong>Instructions:</strong> {quiz.instructions}
                  </p>
                  <p><strong>Shuffle Options:</strong> {quiz.shuffleOptions ? "Yes" : "No"}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Half: Questions */}
      
      <div className="lg:w-1/2 sm:w-full mt-2 lg:pl-3">
        <Card className={`h-full ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <CardHeader>
            <CardTitle className="text-xl">Questions</CardTitle>
            
          </CardHeader>
          {
      quiz.questions?.length === 0 && (
        <Link href ="/admin-dashboard" className="bg-indigo-600  ml-8 mr-8 justify-center flex text-white hover:bg-indigo-700 p-2 rounded-lg">
        Go to Dashboard
        </Link>
      )
      
      }
          <CardContent className="overflow-y-auto text-sm max-h-[calc(250vh-200px)] min-h-[calc(150vh-200px)]">
            <div className="space-y-4">
              {quiz.questions?.map((q, index) => (
                <QuestionCard
                  key={q._id}
                  question={q}
                  index={index}
                  onUpdate={(updatedQuestion) => handleUpdateQuestion(q._id!, updatedQuestion)}
                  
                  theme={theme}
                />
              )
            )}
              
            
              
              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const QuestionCard: React.FC<{
  question: Question;
  index: number;
  onUpdate: (updatedQuestion: Question) => void;
  
  theme: string;
}> = ({ question, index, onUpdate, theme }) => {
// }> = ({ question, index, theme }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedQuestion, setUpdatedQuestion] = useState(question);

  const handleSave = () => {
    onUpdate(updatedQuestion);
    setIsEditing(false);
  };

  return (
    <Card className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-sm">Q.{index + 1}</h3>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="bg-green-600 text-white hover:bg-green-700">
                  <Save size={16} className="mr-2" />
                  Save
                </Button>
                <Button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white hover:bg-gray-600">
                  <X size={16} className="mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)} className="bg-indigo-600 text-sm text-white hover:bg-indigo-700">
                  <Edit size={5} className="mr-2" />
                  Edit
                </Button>
                {/* <Button onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </Button> */}
              </>
            )}
          </div>
        </div>
        {isEditing ? (
          <div className="space-y-4 mt-4">
            <Textarea
              value={updatedQuestion.question}
              onChange={(e) => setUpdatedQuestion({ ...updatedQuestion, question: e.target.value })}
              className={`w-full ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"} text-sm`}
            />
            {updatedQuestion.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex text-xs items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => {
                    const updatedOptions = [...updatedQuestion.options];
                    updatedOptions[optionIndex] = e.target.value;
                    setUpdatedQuestion({ ...updatedQuestion, options: updatedOptions });
                  }}
                  className={`w-full ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"} text-xs`}
                />
                <input
                  type="radio"
                  name={`correctAnswer-${index}`}
                  checked={updatedQuestion.correctAnswer === option}
                  onChange={() => setUpdatedQuestion({ ...updatedQuestion, correctAnswer: option })}
                  className="ml-2 text-sm accent-indigo-800"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2 mt-4">
            <p>{question.question}</p>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center gap-2">
                <span className={option === question.correctAnswer ? "text-green-500" : ""}>
                  ({optionIndex + 1}) {option}
                </span>
                {option === question.correctAnswer && <Badge className="bg-green-600">Correct</Badge>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};