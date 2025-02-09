"use client";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Plus, Settings, Save, X, Edit, Trash2, Check, NotebookPen, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/ThemeContext";

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
    <div className={`mt-4 border rounded-lg p-6 ${theme === "dark" ? "border-blue-800 bg-neutral-800" : "border-blue-600 bg-amber-100"}`}>
      <h4 className={`font-bold lg:text-xl sm:text-base mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>Add New Question</h4>
      <div className="space-y-4">
        <div>
          <label className={`block lg:text-base font-medium mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>Question</label>
          <Textarea
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            placeholder="Enter your question"
            className={`w-full ${theme === "dark" ? "bg-neutral-900 border-blue-800 text-white" : "bg-white border-blue-600 text-black"}`}
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
                className={`${theme === "dark" ? "bg-neutral-900 border-blue-800 text-white" : "bg-white border-blue-600 text-black"}`}
              />
              <input
                type="radio"
                name="correctAnswer"
                checked={newQuestion.correctAnswer === option}
                onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: option })}
                className="ml-2 accent-blue-800"
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
            className="w-full px-4 py-2 rounded-lg bg-amber-50 text-gray-900"
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
            className={`${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"} p-3 text-white flex items-center gap-2`}
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
}> = ({ questions, onConfirm, onCancel, theme, editableQuestions, setEditableQuestions }) => {
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
      <div className={`rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${theme === "dark" ? "bg-neutral-800" : "bg-amber-100"}`}>
        <h2 className="text-xl font-bold mb-4">Preview Generated Questions</h2>
        <div className="space-y-4">
          {editableQuestions.map((q, index) => (
            <div key={index} className={`border rounded-lg p-4 ${theme === "dark" ? "border-blue-800" : "border-blue-600"}`}>
              <div className="space-y-2">
               Question ({index+1})
                <Textarea
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  placeholder="Enter your question"
                  className={`w-full ${theme === "dark" ? "bg-neutral-900 border-blue-800 text-white" : "bg-white border-blue-600 text-black"}`}
                />
                {q.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-2">
                    ({optionIndex+1})
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                      placeholder={`Option ${optionIndex + 1}`}
                      className={`${theme === "dark" ? "bg-neutral-900 border-blue-800 text-white" : "bg-white border-blue-600 text-black"}`}
                    />
                    <input
                      type="radio"
                      name={`correctAnswer-${index}`}
                      checked={q.correctAnswer === option}
                      onChange={() => handleCorrectAnswerChange(index, option)}
                      className="ml-2 accent-blue-800"
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
          <Button onClick={onConfirm} className="bg-blue-600 hover:bg-blue-700">
            Confirm and Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
const RunningQuizes: React.FC = () => {
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const [quizes, setQuizes] = useState<Quiz[]>([]);
  const [quizId, setQuizId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeQuizIndex, setActiveQuizIndex] = useState<number | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<Question>({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    imageUrl: "",
  });
  const [bulkQuestionCount, setBulkQuestionCount] = useState(2);
  const [isGeneratingBulkQuestions, setIsGeneratingBulkQuestions] = useState(false);
  const [previewQuestions, setPreviewQuestions] = useState<Question[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [editablePreviewQuestions, setEditablePreviewQuestions] = useState<Question[]>([]);
  const getQuizes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/quiz-get`);
      if (response.data.success) {
        const quizesWithQuestions = response.data.quizzes.map((quiz: Quiz) => ({
          ...quiz,
          questions: quiz.questions || [],
        }));
        setQuizes(quizesWithQuestions);
      } else {
        toast.success("You can start by creating a new quiz");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch quizes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getQuizes();
  }, [getQuizes]);

  const handleAddQuestion = (index: number, quizid: string) => {
    setActiveQuizIndex(activeQuizIndex === index ? null : index);
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
          id: response.data.questionId,
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
      const response = await axios.post(`${API_BASE_URL}/generate-instructions`, {
        prompt: `Generate ${bulkQuestionCount} questions in about ${quizes[quizIndex].name}. Each question should include:

        A clear and concise question.
        
        Four options, with one being the correct answer.
        
        The correct answer should be explicitly specified using the key correctAnswer and must be one of the options (not a/b/c/d).
        
        Do not include any topics, explanations, or additional text outside the array. Ensure the response is in plain key value format without any markdown formatting (e.g., no json).
        All the question should be inside an array of objects { } with key value pairs. Each question should be separated by a comma.`,
      });
  
      if (response.data) {
        let generatedQuestions = response.data.instructions;
  
        // If the response is a string, parse it into an array
        
          try {
            generatedQuestions = JSON.parse(generatedQuestions);
          } catch (error) {
            console.error("Failed to parse generated questions:", error);
            toast.error("Server is busy try again");
            return;
          }
        
  
        // Validate the response
        if (!Array.isArray(generatedQuestions)) {
          console.error("Generated questions is not an array:", generatedQuestions);
          toast.error("AI server is busy try again");
          return;
        }
  
        // Show preview of generated questions
        setPreviewQuestions(generatedQuestions);
        setEditablePreviewQuestions([...generatedQuestions]); // Initialize editable state
        setQuizId(quizId);
        setShowPreview(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate questions");
    } finally {
      setIsGeneratingBulkQuestions(false);
    }
  };

  const handleConfirmPreview = async (quizId: any) => {
    console.log("Confirming preview questions:", editablePreviewQuestions);
    console.log("Quiz ID:", quizId);
    try {
      const response = await axios.post(`${API_BASE_URL}/questions`, {
        questions: editablePreviewQuestions,
        quizId,
      });
      if (response.data.success) {
        toast.success("Questions added successfully!");
        setShowPreview(false);
        
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add questions");
    }
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

  return (
    <Card className={`w-full mx-auto ${theme === "dark" ? "bg-neutral-900 text-white" : "bg-amber-50 text-black"}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="lg:text-base">Running Quizes</CardTitle>
            <CardDescription className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>Manage your active quizes</CardDescription>
          </div>
          {/* <Link href="/quiz-setup">
            <Button className={`${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"} p-2 text-white flex items-center gap-2`}>
              <Plus size={16} />
              New Quiz
            </Button>
          </Link> */}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${theme === "dark" ? "border-primary" : "border-blue-600"}`}></div>
          </div>
        ) : quizes.length === 0 ? (
          <div className={`text-center py-8 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>No quizes available. Create one to get started!</div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {quizes.map((quiz, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-4">
                      <span className="font-bold lg:text-base">{quiz.name}</span>
                      <Badge
                        variant={quiz.active ? "outline" : "destructive"}
                        className={quiz.active ? (theme === "dark" ? "bg-green-500 hover:bg-green-700" : "bg-green-600 hover:bg-green-700") : ""}
                      >
                        {quiz.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex gap-1 ml-0 sm:p-0 sm:text-end pt-1">
                    <Button
                      onClick={() => handleAddQuestion(index, quiz._id)}
                      className={`sm:text-end ${theme === "dark" ? "bg-blue-800 text-white hover:bg-blue-950" : "bg-blue-600 hover:bg-blue-700"} lg:p-5 lg:text-base flex items-center`}
                    >
                      Question
                      <Plus size={1} />
                    </Button>
                    <Button
                      className={`${theme === "dark" ? "bg-blue-800 text-white hover:bg-blue-950" : "bg-blue-600 hover:bg-blue-700"} lg:p-5 lg:text-base sm:text-end flex items-center`}
                    >
                      <NotebookPen size={2} />
                      Result
                    </Button>
                    <Link 
                    href={`admin-dashboard/quiz-settings/${quiz._id}`}
                      className={`${theme === "dark" ? "bg-blue-800 text-white hover:bg-blue-950" : "bg-blue-600 hover:bg-blue-700"} lg:p-5 h-1 rounded-lg text-white lg:text-base sm:text-end flex items-center`}
                    >
                      <Settings size={16} />
                    </Link>
                  </div>

                  {/* Bulk Question Generation */}
                  <div className="mt-4 flex items-center gap-4">
                    <Input
                      type="number"
                      value={bulkQuestionCount}
                      onChange={(e) => setBulkQuestionCount(Number(e.target.value))}
                      placeholder="Number of questions"
                      className="w-32"
                    />
                    <Button
                      onClick={() => handleGenerateBulkQuestions(index, quiz._id)}
                      disabled={isGeneratingBulkQuestions}
                      className="flex bg-green-600 text-white hover:bg-green-700 items-center gap-2"
                    >
                      {
                      isGeneratingBulkQuestions ? (
                        <>
                          <Loader2 className="animate-spin" />
                          <span>Cheers ✨✨</span>
                        </>
                      ) : (
                        <>Generate {bulkQuestionCount} Questions</>
                      )
                    }
                    </Button>
                  </div>

                  {quiz.questions && quiz.questions.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {quiz.questions.map((q, qIndex) => (
                        <div
                          key={q._id}
                          className={`border rounded-lg p-4 ${theme === "dark" ? "border-blue-800 text-white bg-neutral-800" : "border-blue-600 bg-amber-100"}`}
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
                                <h3 className={`m-2 ml-4 ${theme === "dark" ? "text-white" : "text-black"}`}>Q.({qIndex + 1}) {q.question}</h3>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleEditQuestion(q._id!, quiz)}
                                    className={`${theme === "dark" ? "bg-blue-800 hover:bg-blue-950" : "bg-blue-600 hover:bg-blue-700"} p-2`}
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
                              {q.imageUrl && (
                                <div className="mt-2">
                                  <img src={q.imageUrl} alt="Question Image" className="w-32 h-32 object-cover rounded-lg" />
                                </div>
                              )}
                              <div className="space-y-2 pl-4">
                                {q.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center gap-2">
                                    <span className={option === q.correctAnswer ? "text-green-500" : theme === "dark" ? "text-white" : "text-black"}>
                                     ({optionIndex+1}) {option}
                                    </span>
                                    {option === q.correctAnswer && (
                                      <Badge className={theme === "dark" ? "bg-green-800 text-white" : "bg-green-600 text-white"}>Correct</Badge>
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
        />
      )}
    </Card>
  );
};

export default RunningQuizes;