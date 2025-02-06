"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Plus, Settings, Save, X, Edit, Trash2, Check, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
// import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/ThemeContext"; // Assuming you have a ThemeContext
import { useSession } from "next-auth/react";

interface Quiz {
  _id: string;
  name: string;
  active: boolean;
  questions?: Question[];
}

interface Question {
  _id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function RunningQuizes() {
  const { data: session, status } = useSession();
  const { theme } = useTheme(); // Use the theme context
  const [quizes, setQuizes] = useState<Quiz[]>([]);
  const [quizId, setQuizId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeQuizIndex, setActiveQuizIndex] = useState<number | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<Question>({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  const getQuizes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/quiz-get");
      console.log(response)
      if (response.data.success) {
        const quizesWithQuestions = response.data.quizzes.map((quiz: Quiz) => ({
          ...quiz,
          questions: quiz.questions || [], // Ensure questions is always an array
        }));
        setQuizes(quizesWithQuestions);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch quizes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getQuizes();
  }, [setQuizes]);

  const handleAddQuestion = (index: number, quizid: string) => {
    setActiveQuizIndex(activeQuizIndex === index ? null : index);
    setQuizId(quizid);
    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    });
    setEditingQuestionId(null);
  };

  const handleSubmitQuestion = async () => {
    try {
      const response = await axios.post(
        `/api/questions/questions-create/${quizId}`,
        newQuestion
      );
      if (response.data.success) {
        const updatedQuizes = [...quizes];
        if (!updatedQuizes[activeQuizIndex!].questions) {
          updatedQuizes[activeQuizIndex!].questions = []; // Initialize questions as an empty array if it's null/undefined
        }
        const newQuestionWithId = {
          ...newQuestion,
          id: response.data.questionId, // Use the ID from the server response
        };
        updatedQuizes[activeQuizIndex!].questions?.push(newQuestionWithId);
        setQuizes(updatedQuizes);
        toast.success("Question added successfully!");
        setNewQuestion({
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add question");
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleEditQuestion = (questionId: string, quiz: Quiz) => {
    const question = quiz.questions?.find((q) => q._id === questionId);
    if (question) {
      setNewQuestion(question);
      setEditingQuestionId(questionId);
    }
  };

  const handleUpdateQuestion = async (quizIndex: number, questionId: string) => {
    try {
      const response = await axios.put(
        `/api/questions/question-update/${questionId}`,
        newQuestion
      );
      if (!response.data.success) {
        toast.error(response.data.message);
      }
      const updatedQuizes = [...quizes];
      const questionIndex =
        updatedQuizes[quizIndex].questions?.findIndex((q) => q._id === questionId) ?? -1;
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
      const response = await axios.delete(
        `/api/questions/questions-delete/${questionId}`
      );
      const updatedQuizes = [...quizes];
      updatedQuizes[quizIndex].questions = updatedQuizes[quizIndex].questions?.filter(
        (q) => q._id !== questionId
      );
      setQuizes(updatedQuizes);
      toast.success("Question deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete question");
    }
  };

  return (
    <Card
      className={`w-full mx-auto ${theme === "dark" ? "bg-neutral-900 text-white" : "bg-amber-50 text-black"
        }`}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="lg:text-lg">Running Quizes</CardTitle>
            <CardDescription
              className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
            >
              Manage your active quizes
            </CardDescription>
          </div>
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
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div
              className={`animate-spin rounded-full h-8 w-8 border-b-2 ${theme === "dark" ? "border-primary" : "border-blue-600"
                }`}
            ></div>
          </div>
        ) : quizes.length === 0 ? (
          <div
            className={`text-center py-8 ${theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
          >
            No quizes available. Create one to get started!
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {quizes.map((quiz, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-4">
                      <span className="font-bold lg:text-lg">{quiz.name}</span>
                      <Badge
                        variant={quiz.active ? "outline" : "destructive"}
                        className={
                          quiz.active
                            ? theme === "dark"
                              ? "bg-green-500 hover:bg-green-700"
                              : "bg-green-600 hover:bg-green-700"
                            : ""
                        }
                      >
                        {quiz.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex lg:gap-4 sm:gap-2 sm:p-0 sm:text-xs pt-1">
                    <Button
                      onClick={() => handleAddQuestion(index, quiz._id)}
                      className={`${theme === "dark"
                          ? "bg-blue-800 hover:bg-blue-950"
                          : "bg-blue-600 hover:bg-blue-700"
                        } lg:p-5 flex items-center`}
                    >
                      <Plus size={5} />
                      Add
                    </Button>
                    <Button
                      className={`${theme === "dark"
                          ? "bg-blue-800 hover:bg-blue-950"
                          : "bg-blue-600 hover:bg-blue-700"
                        } lg:p-5 sm:p-2 lg:text-base sm:text-xs flex items-center`}
                    >
                      <NotebookPen size={16} />
                      Result
                    </Button>
                    <Button
                      className={`${theme === "dark"
                          ? "bg-blue-800 hover:bg-blue-950"
                          : "bg-blue-600 hover:bg-blue-700"
                        } lg:p-5 lg:text-base sm:text-sm flex items-center`}
                    >
                      <Settings size={16} />
                    </Button>
                  </div>

                  {/* Display Existing Questions */}
                  {quiz.questions && quiz.questions.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {quiz.questions.map((q, qIndex) => (
                        <div
                          key={q._id}
                          className={`border rounded-lg p-4 ${theme === "dark"
                              ? "border-blue-800 bg-neutral-800"
                              : "border-blue-600 bg-amber-100"
                            }`}
                        >
                          {editingQuestionId === q._id ? (
                            <div className="space-y-4">
                              <div>
                                <label
                                  className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-white" : "text-black"
                                    }`}
                                >
                                  Question
                                </label>
                                <Textarea
                                  value={newQuestion.question}
                                  onChange={(e) =>
                                    setNewQuestion({ ...newQuestion, question: e.target.value })
                                  }
                                  className={`w-full ${theme === "dark"
                                      ? "bg-neutral-900 border-blue-800 text-white"
                                      : "bg-white border-blue-600 text-black"
                                    }`}
                                />
                              </div>

                              <div className="space-y-3">
                                <label
                                  className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-black"
                                    }`}
                                >
                                  Options
                                </label>
                                {newQuestion.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex gap-2 items-center">
                                    <Input
                                      value={option}
                                      onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                                      className={`${theme === "dark"
                                          ? "bg-neutral-900 border-blue-800 text-white"
                                          : "bg-white border-blue-600 text-black"
                                        }`}
                                    />
                                    <input
                                      type="radio"
                                      name="correctAnswer"
                                      checked={newQuestion.correctAnswer === option}
                                      onChange={() =>
                                        setNewQuestion({ ...newQuestion, correctAnswer: option })
                                      }
                                      className="ml-2 accent-blue-800"
                                    />
                                  </div>
                                ))}
                              </div>

                              <div className="flex justify-end gap-2">
                                <Button
                                  onClick={() => setEditingQuestionId(null)}
                                  className={`${theme === "dark"
                                      ? "bg-neutral-700 hover:bg-neutral-600"
                                      : "bg-gray-300 hover:bg-gray-400"
                                    } p-3 flex items-center gap-2`}
                                >
                                  <X size={16} />
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => handleUpdateQuestion(index, q._id!)}
                                  className={`${theme === "dark"
                                      ? "bg-blue-800 hover:bg-blue-950"
                                      : "bg-blue-600 hover:bg-blue-700"
                                    } p-3 flex items-center gap-2`}
                                >
                                  <Check size={16} />
                                  Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // Display Question
                            <div>
                              <div className="flex justify-between items-start mb-3">
                                <h3
                                  className={`m-2 ml-4 ${theme === "dark" ? "text-white" : "text-black"
                                    }`}
                                >
                                  Q.({qIndex + 1}) {q.question}
                                </h3>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleEditQuestion(q._id!, quiz)}
                                    className={`${theme === "dark"
                                        ? "bg-blue-800 hover:bg-blue-950"
                                        : "bg-blue-600 hover:bg-blue-700"
                                      } p-2`}
                                  >
                                    <Edit size={10} />
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteQuestion(index, q._id!)}
                                    className="bg-red-800 hover:bg-red-900 p-2"
                                  >
                                    <Trash2 size={10} />
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-2 pl-4">
                                {q.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center gap-2">
                                    <span
                                      className={
                                        option === q.correctAnswer
                                          ? "text-green-500"
                                          : theme === "dark"
                                            ? "text-white"
                                            : "text-black"
                                      }
                                    >
                                      ({optionIndex + 1}) {option}
                                    </span>
                                    {option === q.correctAnswer && (
                                      <Badge
                                        className={
                                          theme === "dark"
                                            ? "bg-green-800"
                                            : "bg-green-600"
                                        }
                                      >
                                        Correct
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
                  )}

                  {/* Add New Question Form */}
                  {activeQuizIndex === index && !editingQuestionId && (
                    <div
                      className={`mt-4 border rounded-lg p-6 ${theme === "dark"
                          ? "border-blue-800 bg-neutral-800"
                          : "border-blue-600 bg-amber-100"
                        }`}
                    >
                      <h4
                        className={`font-bold lg:text-xl sm:text-base mb-4 ${theme === "dark" ? "text-white" : "text-black"
                          }`}
                      >
                        Add New Question
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label
                            className={`block lg:text-base font-medium mb-2 ${theme === "dark" ? "text-white" : "text-black"
                              }`}
                          >
                            Question
                          </label>
                          <Textarea
                            value={newQuestion.question}
                            onChange={(e) =>
                              setNewQuestion({ ...newQuestion, question: e.target.value })
                            }
                            placeholder="Enter your question"
                            className={`w-full ${theme === "dark"
                                ? "bg-neutral-900 border-blue-800 text-white"
                                : "bg-white border-blue-600 text-black"
                              }`}
                          />
                        </div>

                        <div className="space-y-3">
                          <label
                            className={`block lg:text-base font-medium ${theme === "dark" ? "text-white" : "text-black"
                              }`}
                          >
                            Options
                          </label>
                          {newQuestion.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex gap-2 items-center">
                              <Input
                                value={option}
                                onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                                placeholder={`Option ${optionIndex + 1}`}
                                className={`${theme === "dark"
                                    ? "bg-neutral-900 border-blue-800 text-white"
                                    : "bg-white border-blue-600 text-black"
                                  }`}
                              />
                              <input
                                type="radio"
                                name="correctAnswer"
                                checked={newQuestion.correctAnswer === option}
                                onChange={() =>
                                  setNewQuestion({ ...newQuestion, correctAnswer: option })
                                }
                                className="ml-2 accent-blue-800"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end">
                          <Button
                            onClick={handleSubmitQuestion}
                            className={`${theme === "dark"
                                ? "bg-blue-800 hover:bg-blue-950"
                                : "bg-blue-600 hover:bg-blue-700"
                              } p-5 lg:text-lg flex items-center gap-2`}
                          >
                            <Save size={16} />
                            Save Question
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}