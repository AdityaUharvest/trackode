"use client";
import React, { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from 'react-hot-toast';;
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTheme } from "./ThemeContext";

// Icons
import {
  Plus,
  Settings,
  Save,
  X,
  Edit,
  Trash2,
  Check,
  NotebookPen,
  ImageIcon,
  Loader2,
  BarChart2,
  Send,
  FileQuestion,
  ChevronDown,
   
 
  Share2, 
   
  Globe,
  Pencil,
  Download,
  Copy
} from "lucide-react";

// UI Components
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "./ui/tabs";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "./ui/tooltip";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

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

const API_BASE_URL = "/api";

const QuestionForm: React.FC<{
  newQuestion: Question;
  setNewQuestion: (question: Question) => void;
  onSubmit: () => void;
  onCancel: () => void;
  theme: string;
}> = ({ newQuestion, setNewQuestion, onSubmit, onCancel, theme }) => {
  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(`${API_BASE_URL}/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        setNewQuestion({ ...newQuestion, imageUrl: response.data.imageUrl });
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    }
  };

  return (
    <div className={`mt-4 border rounded-lg p-6 ${theme === "dark" ? "border-indigo-800 bg-gray-800" : "border-indigo-600 bg-gray-100"}`}>
      <h4 className={`font-bold lg:text-xl sm:text-base mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>Add New Question</h4>
      <div className="space-y-4">
        <div>
          <label className={`block lg:text-base font-medium mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>Question</label>
          <Textarea
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            placeholder="Enter your question"
            className={`w-full ${theme === "dark" ? "bg-gray-900 border-indigo-800 text-white" : "bg-white border-indigo-600 text-black"}`}
          />
        </div>
        <div className="space-y-3">
          <label className={`block lg:text-base font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>Options</label>
          {newQuestion.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex gap-2 items-center">
              <Input
                value={option}
                onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                placeholder={`Option ${optionIndex + 1}`}
                className={`${theme === "dark" ? "bg-gray-900 border-indigo-800 text-white" : "bg-white border-indigo-600 text-black"}`}
              />
              <input
                type="radio"
                name="correctAnswer"
                checked={newQuestion.correctAnswer === option}
                onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: option })}
                className="ml-2 accent-indigo-800"
              />
            </div>
          ))}
        </div>
        <div>
          <label className={`block lg:text-base font-medium mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleImageUpload(e.target.files[0]);
              }
            }}
            className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-900"
          />
          {newQuestion.imageUrl && (
            <div className="mt-2">
              <img src={newQuestion.imageUrl} alt="Question Image" className="w-32 h-32 object-cover rounded-lg" />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            onClick={onCancel}
            className=" text-white p-3 bg-red-600 hover:bg-red-900 flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            className={`${theme === "dark" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-600 hover:bg-indigo-700"} p-3 text-white flex items-center gap-2`}
          >
            <Save size={16} />
            Save Question
          </Button>
        </div>
      </div>
    </div>
  );
};

const PreviewModal: React.FC<{
  questions: Question[];
  onConfirm: () => void;
  onCancel: () => void;
  theme: string;
  editableQuestions: Question[];
  setEditableQuestions: (questions: Question[]) => void;
  isLoading: boolean;
}> = ({ questions, onConfirm, onCancel, theme, editableQuestions, setEditableQuestions, isLoading }) => {
  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...editableQuestions];
    updatedQuestions[index].question = value;
    setEditableQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...editableQuestions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setEditableQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex: number, correctAnswer: string) => {
    const updatedQuestions = [...editableQuestions];
    updatedQuestions[questionIndex].correctAnswer = correctAnswer;
    setEditableQuestions(updatedQuestions);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${theme === "dark" ? "text-white" : "text-black"}`}>
      <div className={`rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
        <h2 className="text-xl font-bold mb-4">Preview Generated Questions</h2>
        <div className="space-y-4">
          {editableQuestions.map((q, index) => (
            <div key={index} className={`border rounded-lg p-4 ${theme === "dark" ? "border-indigo-800" : "border-indigo-600"}`}>
              <div className="space-y-2">
                Question ({index+1})
                <Textarea
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  placeholder="Enter your question"
                  className={`w-full ${theme === "dark" ? "bg-gray-900 border-indigo-800 text-white" : "bg-white border-indigo-600 text-black"}`}
                />
                {q.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-2">
                    ({optionIndex+1})
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                      placeholder={`Option ${optionIndex + 1}`}
                      className={`${theme === "dark" ? "bg-gray-900 border-indigo-800 text-white" : "bg-white border-indigo-600 text-black"}`}
                    />
                    <input
                      type="radio"
                      name={`correctAnswer-${index}`}
                      checked={q.correctAnswer === option}
                      onChange={() => handleCorrectAnswerChange(index, option)}
                      className="ml-2 accent-indigo-800"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <Button onClick={onCancel} className="bg-gray-500 hover:bg-gray-600">
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              "Confirm and Submit"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
interface RunningQuizesProps {
  quizes: Quiz[];
  setQuizes: React.Dispatch<React.SetStateAction<Quiz[]>>;
  getQuizes: () => Promise<void>;
}

const RunningQuizes: React.FC<RunningQuizesProps> = ({ quizes,setQuizes,getQuizes }) => {
  
  const { theme } = useTheme();

  const [quizId, setQuizId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeQuizIndex, setActiveQuizIndex] = useState<number | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<Question>({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    imageUrl: "",
  });
  const [bulkQuestionCount, setBulkQuestionCount] = useState(5);
  const [isGeneratingBulkQuestions, setIsGeneratingBulkQuestions] = useState(false);
  const [previewQuestions, setPreviewQuestions] = useState<Question[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [editablePreviewQuestions, setEditablePreviewQuestions] = useState<Question[]>([]);
  
  

  const handleAddQuestion = (index: number, quizid: string) => {
    setActiveQuizIndex(index); // Always set to the clicked index
    setQuizId(quizid);
    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      imageUrl: "",
    });
    setEditingQuestionId(null);
  };

  const handleSubmitQuestion = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/questions`, {
        questions: [newQuestion],
        quizId: quizId,
      });
      if (response.data.success) {
        const updatedQuizes = [...quizes];
        if (!updatedQuizes[activeQuizIndex!].questions) {
          updatedQuizes[activeQuizIndex!].questions = [];
        }
        const newQuestionWithId = {
          ...newQuestion,
          _id: response.data.questionId,
        };
        updatedQuizes[activeQuizIndex!].questions?.push(newQuestionWithId);
        setQuizes(updatedQuizes);
        toast.success("Question added successfully!");
        setNewQuestion({
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          imageUrl: "",
        });
        setActiveQuizIndex(null); // Close the form after submission
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add question");
    }
  };

  const handleGenerateBulkQuestions = async (quizIndex: number, quizId: string) => {
    try {
      setIsGeneratingBulkQuestions(true);
      
      // First try to generate all requested questions
      let response;
      try {
        response = await axios.post(`${API_BASE_URL}/generate-instructions`, {
          prompt: `Generate ${bulkQuestionCount} questions about ${quizes[quizIndex].name}. Each question should include:
            A clear and concise question.
            Four options, with one being the correct answer.
            The correct answer should be explicitly specified using the key correctAnswer and must be one of the options (not a/b/c/d).
            Return the response as a plain array of objects without any formatting or markdown.
            Format: [{question: "", options: [], correctAnswer: ""}, {...}]`,
        });
      } catch (initialError) {
        console.warn("Failed to generate all questions at once, trying smaller batches", initialError);
        
        // If initial request fails, try with smaller batches
        const batchSize = 25;
        let successfullyGenerated: any[] = [];
        
        for (let i = 0; i < Math.ceil(bulkQuestionCount / batchSize); i++) {
          const currentBatchSize = Math.min(batchSize, bulkQuestionCount - (i * batchSize));
          if (currentBatchSize <= 0) break;
          
          try {
            const batchResponse = await axios.post(`${API_BASE_URL}/generate-instructions`, {
              prompt: `Generate ${currentBatchSize} questions about ${quizes[quizIndex].name}. Each question should include:
                A clear and concise question.
                Four options, with one being the correct answer.
                The correct answer should be explicitly specified using the key correctAnswer and must be one of the options (not a/b/c/d).
                Return the response as a plain array of objects without any formatting or markdown.
                Format: [{question: "", options: [], correctAnswer: ""}, {...}]`,
            });
            
            if (batchResponse.data) {
              const batchQuestions = parseGeneratedQuestions(batchResponse.data.instructions);
              successfullyGenerated = [...successfullyGenerated, ...batchQuestions];
            }
          } catch (batchError) {
            console.error(`Failed to generate batch ${i + 1}`, batchError);
            // Continue to next batch even if this one fails
          }
        }
        
        if (successfullyGenerated.length > 0) {
          processValidQuestions(successfullyGenerated, quizId);
          return;
        } else {
          throw initialError;
        }
      }
  
      // Original processing if the initial request succeeded
      if (response.data) {
        const parsedQuestions = parseGeneratedQuestions(response.data.instructions);
        processValidQuestions(parsedQuestions, quizId);
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to generate questions. Please try with a smaller number or try again later.");
    } finally {
      setIsGeneratingBulkQuestions(false);
    }
  };
  
  const parseGeneratedQuestions = (generatedQuestions: any): any[] => {
    let parsedQuestions = [];
    
    if (typeof generatedQuestions === "string") {
      generatedQuestions = generatedQuestions.replace(/```(json)?\s*|\s*```/g, '');
      
      try {
        parsedQuestions = JSON.parse(generatedQuestions);
      } catch (error) {
        console.warn("Failed to parse complete response, attempting partial parse");
        
        try {
          const lastValidBracket = generatedQuestions.lastIndexOf(']');
          if (lastValidBracket !== -1) {
            const truncatedJson = generatedQuestions.substring(0, lastValidBracket + 1);
            parsedQuestions = JSON.parse(truncatedJson);
          } else {
            const questionMatches = generatedQuestions.match(/\{[^{}]*\}/g);
            if (questionMatches) {
              parsedQuestions = questionMatches.map((q: any) => {
                try {
                  return JSON.parse(q);
                } catch {
                  return null;
                }
              }).filter((q: any) => q !== null);
            }
          }
        } catch (innerError) {
          console.error("Failed to salvage partial response:", innerError);
          return [];
        }
      }
    }
    
    return parsedQuestions;
  };
  
  const processValidQuestions = (parsedQuestions: any[], quizId: string) => {
    const validQuestions = parsedQuestions.filter((q: any) => 
      q && 
      typeof q === 'object' &&
      q.question && 
      Array.isArray(q.options) && 
      q.options.length === 4 && 
      q.correctAnswer && 
      q.options.includes(q.correctAnswer)
    );
  
    if (validQuestions.length === 0) {
      toast.error(`No valid questions were generated. Please try again.`);
      return;
    }
  
    if (validQuestions.length < bulkQuestionCount) {
      toast.dismiss(`Generated ${validQuestions.length}/${bulkQuestionCount} questions`);
    } else {
      toast.success(`Successfully generated ${validQuestions.length} questions`);
    }
  
    setPreviewQuestions(validQuestions);
    setEditablePreviewQuestions([...validQuestions]);
    setQuizId(quizId);
    setShowPreview(true);
  };

  const handleConfirmPreview = async (quizId: any) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/questions`, {
        questions: editablePreviewQuestions,
        quizId,
      });
      if (response.data.success) {
        toast.success("Questions added successfully!");
        setShowPreview(false);
        getQuizes(); // Refresh the quiz list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add questions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditQuestion = (questionId: string, quiz: Quiz) => {
    const question = quiz.questions?.find((q) => q._id === questionId);
    if (question) {
      setNewQuestion(question);
      setEditingQuestionId(questionId);
      setActiveQuizIndex(quizes.findIndex(q => q._id === quiz._id)); // Ensure the accordion is open
    }
  };

  const handleUpdateQuestion = async (quizIndex: number, questionId: string) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/questions`, {
        newQuestion,
        questionId,
      });
      if (!response.data.success) {
        toast.error(response.data.message);
      }
      const updatedQuizes = [...quizes];
      const questionIndex = updatedQuizes[quizIndex].questions?.findIndex((q) => q._id === questionId) ?? -1;
      if (questionIndex !== -1 && updatedQuizes[quizIndex].questions) {
        updatedQuizes[quizIndex].questions[questionIndex] = {
          ...newQuestion,
          _id: questionId,
        };
        setQuizes(updatedQuizes);
        setEditingQuestionId(null);
        setNewQuestion({
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          imageUrl: "",
        });
        toast.success("Question updated successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update question");
    }
  };

  const handleDeleteQuestion = async (quizIndex: number, questionId: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/questions`, {
        data: { id: questionId },
      });
      const updatedQuizes = [...quizes];
      updatedQuizes[quizIndex].questions = updatedQuizes[quizIndex].questions?.filter((q) => q._id !== questionId);
      setQuizes(updatedQuizes);
      toast.success("Question deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete question");
    }
  };
  // adding publish and delete and share quiz functionality
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const handlePublishQuiz = async (quizId:any, active:any) => {
    
    try {
      setIsPublishing(true);
      const response = await axios.put(`${API_BASE_URL}/quiz-update/${quizId}`,{updatedQuiz:{active, quizId}});
      if (response.data.success) {
        setQuizes(prevQuizes => 
          prevQuizes.map(quiz => 
            quiz._id === quizId 
              ? { ...quiz, active: !quiz.active } // Toggle the active status
              : quiz
          )
        );
        setIsPublished(true);
        setShareLink(`${window.location.origin}/quiz-play/${quizId}`);
        
        toast.success("Quiz published successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to publish quiz");
    } finally {
      setIsPublishing(false);
    }
  };
  
  const handleDeleteQuiz = async (quizId:any) => {
   
    try {
      const response = await axios.delete(`${API_BASE_URL}/quiz-update/${quizId}`);
      if (response.data.success) {
        
        toast.success("Quiz Deleted successfully!");
        setQuizes((prevQuizes) => prevQuizes.filter((quiz) => quiz._id !== quizId));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to Delete quiz");
    } 
  };
  const handleShareQuiz = async (quizId:any) => {
    
        // Copy the share link to clipboard
        const shareLink = `https://trackode.in/quiz-play/${quizId}`;

        await navigator.clipboard.writeText(shareLink);
        await navigator.share(
          {
          title: "Share Quiz",
          text: "Check out this quiz!",
          url: shareLink,
        }).catch((error) => {
          console.error("Error sharing the link:", error);
        })
        setShareLink(shareLink);
        toast.success("Quiz code copied to clipboard!");
     
  };
  return (
    <Card className={`w-full border-none  ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
      <TooltipProvider > 
        <CardContent className="p-0  ">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${theme === "dark" ? "border-primary" : "border-indigo-600"}`}></div>
            </div>
          ) : quizes.length === 0 ? (
            <div className={`text-center py-8 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              No quizzes available. Create one to get started!
            </div>
          ) : (
            <Accordion type="single" className="w-full  space-y-3" collapsible>
              {quizes.map((quiz, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className={`border rounded-lg transition-all ${theme === "dark" ? "border-indigo-800 bg-gray-800" : "border-indigo-200 bg-white"}`}
                >
                  <AccordionTrigger className="hover:no-underline px-3 py-2 sm:px-4 sm:py-3">
                    <div className="flex flex-1 items-center justify-between gap-2">
                      <div className="flex flex-col items-start overflow-hidden">
                        <span className="text-sm font-medium sm:text-base truncate max-w-[180px] sm:max-w-xs">
                          {quiz.name}
                        </span>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {quiz.questions?.length || 0} questions
                          </span>
                          <span className="hidden sm:inline text-xs text-gray-500">
                            • {new Date(quiz.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={quiz.active ? "outline" : "destructive"}
                          className={`text-xs ${quiz.active ? (theme === "dark" ? "bg-green-500 hover:bg-green-700 text-white" : "bg-green-600 text-white hover:bg-green-700") : ""}`}
                        >
                          {quiz.active ? "Active" : "Inactive"}
                        </Badge>
                       
                      </div>
                    </div>
                  </AccordionTrigger>
  
                  <AccordionContent className="px-3 py-2 sm:px-4">
                    <Tabs defaultValue="info" className="w-full">
                      <TabsList className={`grid w-full grid-cols-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} h-10`}>
                        <TabsTrigger value="info" className="text-xs sm:text-sm py-1">Settings</TabsTrigger>
                        <TabsTrigger value="questions" className="text-xs sm:text-sm py-1">
                          Questions ({quiz.questions?.length || 0})
                        </TabsTrigger>
                      </TabsList>
  
                      {/* Settings Tab */}
                      <TabsContent value="info" className="mt-3">
                        <div className="space-y-3">
                          {/* Action Buttons Grid */}
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                            <Button 
                              onClick={() => handleAddQuestion(index, quiz._id)}
                              className={`text-xs sm:text-sm h-8 ${theme === "dark" ? "bg-indigo-700 hover:bg-indigo-800" : "bg-indigo-600 hover:bg-indigo-700"} text-white`}
                            >
                              <Plus size={14} className="mr-1 sm:mr-2" />
                              Add
                            </Button>
                            
                            <Button 
                              asChild
                              variant="outline"
                              className={`text-xs sm:text-sm h-8 ${theme === "dark" ? "border-indigo-700 text-indigo-400" : "border-indigo-600 text-indigo-700"}`}
                            >
                              <Link href={`quiz-result/${quiz._id}`}>
                                <BarChart2 size={14} className="mr-1 sm:mr-2" />
                                Results
                              </Link>
                            </Button>
                            
                            <Button 
                              onClick={() => handlePublishQuiz(quiz._id, quiz.active)}
                              className={`text-xs sm:text-sm h-8 ${theme === "dark" ? "bg-green-700 hover:bg-green-800" : "bg-green-600 hover:bg-green-700"} text-white`}
                            >
                              <Globe size={14} className="mr-1 sm:mr-2" />
                              {!quiz.active ? 'Publish' : 'Unpublish'}
                            </Button>
                            
                            <Button 
                              asChild
                              variant="outline"
                              className={`text-xs sm:text-sm h-8 ${theme === "dark" ? "bg-gray-700 text-white-400" : "border-gray-300 text-gray-700"}`}
                            >
                              <Link href={`admin-dashboard/quiz-settings/${quiz._id}`}>
                                <Pencil size={14} className="mr-1 sm:mr-2" />
                                Settings
                              </Link>
                            </Button>
                            
                            <Button 
                              onClick={() => handleShareQuiz(quiz._id)}
                              variant="outline"
                              className={`text-xs sm:text-sm h-8 ${theme === "dark" ? "border-purple-700 text-purple-400" : "border-purple-600 text-purple-700"}`}
                            >
                              <Share2 size={14} className="mr-1 sm:mr-2" />
                              Share
                            </Button>
                            
                            <Button 
                              onClick={() => handleDeleteQuiz(quiz._id)}
                              variant="outline"
                              className="text-xs sm:text-sm h-8 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            >
                              <Trash2 size={14} className="mr-1 sm:mr-2" />
                              Delete
                            </Button>
                          </div>
  
                          {/* Share Section */}
                          <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                            <h3 className="font-medium text-sm mb-2">Share Quiz</h3>
                            <div className="flex gap-2">
                              <Input 
                                value={`${quiz.shareCode}`} 
                                readOnly 
                                className="flex-1 h-8 text-xs sm:text-sm"
                              />
                              <Button 
                                variant="outline" 
                                onClick={() => (
                                  navigator.clipboard.writeText(`${quiz.shareCode}`) 
                                    .then(() => toast.success("Quiz code copied to clipboard!"))
                                    .catch(() => toast.error("Failed to copy quiz code"))
                                )}
                                className="h-8 px-2"
                              >
                                <Copy size={14} className="mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Copy</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
  
                      {/* Questions Tab */}
                      <TabsContent value="questions" className="mt-3">
                        <div className={`mb-4 p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                          <h4 className="font-medium text-sm mb-2">Bulk Generate Questions</h4>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={bulkQuestionCount}
                              onChange={(e) => setBulkQuestionCount(Number(e.target.value))}
                              placeholder="Number"
                              className="w-20 h-8 text-xs sm:text-sm"
                              min={1}
                              max={20}
                            />
                            <Button
                              onClick={() => handleGenerateBulkQuestions(index, quiz._id)}
                              disabled={isGeneratingBulkQuestions}
                              className="flex-1 h-8 text-xs sm:text-sm bg-green-600 text-white hover:bg-green-700"
                            >
                              {isGeneratingBulkQuestions ? (
                                <>
                                  <Loader2 className="animate-spin h-4 w-4 mr-1" />
                                  <span>Generating</span>
                                </>
                              ) : (
                                <>Generate {bulkQuestionCount}</>
                              )}
                            </Button>
                          </div>
                        </div>
  
                        {quiz.questions && quiz.questions.length > 0 ? (
                          <div className="mt-4 space-y-4">
                            {quiz.questions.map((q, qIndex) => (
                              <div
                                key={q._id}
                                className={`border rounded-lg p-4 ${theme === "dark" ? "border-indigo-800 text-white bg-gray-800" : "border-indigo-600 bg-gray-100"}`}
                              >
                                {editingQuestionId === q._id ? (
                                  <QuestionForm
                                    newQuestion={newQuestion}
                                    setNewQuestion={setNewQuestion}
                                    onSubmit={() => handleUpdateQuestion(index, q._id!)}
                                    onCancel={() => setEditingQuestionId(null)}
                                    theme={theme}
                                  />
                                ) : (
                                  <div>
                                    <div className="flex justify-between items-start mb-3">
                                      <h3 className={`m-2 ml-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
                                        Q{qIndex + 1}. {q.question}
                                      </h3>
                                      <div className="flex gap-2">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              onClick={() => handleEditQuestion(q._id!, quiz)}
                                              variant="ghost"
                                              size="icon"
                                              className="hover:bg-indigo-500 hover:bg-opacity-20"
                                            >
                                              <Edit size={16} />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Edit question</p>
                                          </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              onClick={() => handleDeleteQuestion(index, q._id!)}
                                              variant="ghost"
                                              size="icon"
                                              className="hover:bg-red-500 hover:bg-opacity-20"
                                            >
                                              <Trash2 size={16} />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Delete question</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </div>
                                    </div>
                                    {q.imageUrl && (
                                      <div className="mt-2 mb-3">
                                        <img 
                                          src={q.imageUrl} 
                                          alt="Question Image" 
                                          className="w-full max-w-xs h-auto object-cover rounded-lg border"
                                          style={{ borderColor: theme === "dark" ? "#1E40AF" : "#93C5FD" }}
                                        />
                                      </div>
                                    )}
                                    <div className="space-y-2 pl-4">
                                      {q.options.map((option, optionIndex) => (
                                        <div key={optionIndex} className="flex items-center gap-2">
                                          <span className={option === q.correctAnswer ? "font-semibold" : ""}>
                                            {String.fromCharCode(65 + optionIndex)}. {option}
                                          </span>
                                          {option === q.correctAnswer && (
                                            <Badge 
                                              variant="outline" 
                                              className={theme === "dark" ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800"}
                                            >
                                              Correct Answer
                                            </Badge>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className={`p-6 text-center rounded-lg ${theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                            <FileQuestion size={20} className="mx-auto mb-2" />
                            <p className="text-sm">No questions yet</p>
                            <p className="text-xs mt-1">Add your first question to get started</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
  
                    {/* Question Form */}
                    {activeQuizIndex === index && !editingQuestionId && (
                      <QuestionForm
                        newQuestion={newQuestion}
                        setNewQuestion={setNewQuestion}
                        onSubmit={handleSubmitQuestion}
                        onCancel={() => setActiveQuizIndex(null)}
                        theme={theme}
                        
                      />
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
  
        {/* Preview Modal */}
        {showPreview && (
          <PreviewModal
            questions={previewQuestions}
            onConfirm={() => handleConfirmPreview(quizId)}
            onCancel={() => setShowPreview(false)}
            theme={theme}
            editableQuestions={editablePreviewQuestions}
            setEditableQuestions={setEditablePreviewQuestions}
            isLoading={isLoading}
          />
        )}
      </TooltipProvider> 
    </Card>
  );
};

export default RunningQuizes;