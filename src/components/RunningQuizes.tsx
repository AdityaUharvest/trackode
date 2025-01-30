import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Plus, Settings, Save, X, Edit, Trash2, Check,NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
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

interface Quiz {
  name: string;
  active: boolean;
  questions?: Question[];
}

interface Question {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function RunningQuizes() {
  const [quizes, setQuizes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeQuizIndex, setActiveQuizIndex] = useState<number | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<Question>({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: ""
  });

  const getQuizes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/quiz/quiz-get");
      if (response.data.success) {
        setQuizes(response.data.quiz);
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
  }, []);

  const handleAddQuestion = (index: number) => {
    setActiveQuizIndex(activeQuizIndex === index ? null : index);
    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: ""
    });
    setEditingQuestionId(null);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleSubmitQuestion = async () => {
    try {
      // here will be add question works 
      // const response = await axios.post(
      //   "/api/quiz/quiz-add-question",
        
      // )
      // Add your API call here to save the question
      const updatedQuizes = [...quizes];
      if (!updatedQuizes[activeQuizIndex!].questions) {
        updatedQuizes[activeQuizIndex!].questions = [];
      }
      
      const newQuestionWithId = {
        ...newQuestion,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      updatedQuizes[activeQuizIndex!].questions?.push(newQuestionWithId);
      setQuizes(updatedQuizes);
      console.log(newQuestion)
      toast.success("Question added successfully!");
      setNewQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: ""
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add question");
    }
  };

  const handleEditQuestion = (questionId: string, quiz: Quiz) => {
    const question = quiz.questions?.find(q => q.id === questionId);
    if (question) {
      setNewQuestion(question);
      setEditingQuestionId(questionId);
    }
  };

  const handleUpdateQuestion = async (quizIndex: number, questionId: string) => {
    try {
      const updatedQuizes = [...quizes];
      const questionIndex = updatedQuizes[quizIndex].questions?.findIndex(q => q.id === questionId) ?? -1;
      
      if (questionIndex !== -1 && updatedQuizes[quizIndex].questions) {
        updatedQuizes[quizIndex].questions[questionIndex] = {
          ...newQuestion,
          id: questionId
        };
        setQuizes(updatedQuizes);
        setEditingQuestionId(null);
        setNewQuestion({
          question: "",
          options: ["", "", "", ""],
          correctAnswer: ""
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
      const updatedQuizes = [...quizes];
      updatedQuizes[quizIndex].questions = updatedQuizes[quizIndex].questions?.filter(
        q => q.id !== questionId
      );
      setQuizes(updatedQuizes);
      toast.success("Question deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete question");
    }
  };

  return (
    <Card className="w-full text-white bg-neutral-900 mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Running Quizes</CardTitle>
            <CardDescription>
              Manage your active quizes
            </CardDescription>
          </div>
          <Link href="/quiz-setup">
          <Button
           className="bg-blue-800 hover:bg-blue-950 p-2  flex items-center gap-2">
            <Plus size={16} />
            New Quiz
          </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : quizes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No quizes available. Create one to get started!
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {quizes.map((quiz, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-xl">{quiz.name}</span>
                      <Badge variant={quiz.active ? "success" : "danger"}>
                        {quiz.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex gap-4 pt-2">
                    <Button 
                      onClick={() => handleAddQuestion(index)}
                      className="bg-blue-800 hover:bg-blue-950 p-5 text-base flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Questions
                    </Button>
                    <Button className="bg-blue-800 hover:bg-blue-950 p-5 text-base flex items-center gap-2">
                      <NotebookPen size={16} />
                      Final Result
                    </Button>
                    <Button className="bg-blue-800 hover:bg-blue-950 p-5 text-base flex items-center gap-2">
                      <Settings size={16} />
                      Settings
                    </Button>
                  </div>

                  {/* Display Existing Questions */}
                  {quiz.questions && quiz.questions.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {quiz.questions.map((q, qIndex) => (
                        <div key={q.id} className="border border-blue-800 rounded-lg p-4 bg-neutral-800">
                          {editingQuestionId === q.id ? (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">Question</label>
                                <Textarea
                                  value={newQuestion.question}
                                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                                  className="w-full bg-neutral-900 border-blue-800 text-white"
                                />
                              </div>
                              
                              <div className="space-y-3">
                                <label className="block text-sm font-medium">Options</label>
                                {newQuestion.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex gap-2 items-center">
                                    <Input
                                      value={option}
                                      onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                                      className="bg-neutral-900 border-blue-800 text-white"
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

                              <div className="flex justify-end gap-2">
                                <Button
                                  onClick={() => setEditingQuestionId(null)}
                                  className="bg-neutral-700 hover:bg-neutral-600 p-3 flex items-center gap-2"
                                >
                                  <X size={16} />
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => handleUpdateQuestion(index, q.id!)}
                                  className="bg-blue-800 hover:bg-blue-950 p-3 flex items-center gap-2"
                                >
                                  <Check size={16} />
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // Display Question
                            <div>
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="text-lg font-medium">{q.question}</h4>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleEditQuestion(q.id!, quiz)}
                                    className="bg-blue-800 hover:bg-blue-950 p-2"
                                  >
                                    <Edit size={16} />
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteQuestion(index, q.id!)}
                                    className="bg-red-800 hover:bg-red-900 p-2"
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-2 text-base pl-4">
                                {q.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center gap-2">
                                    <span className={option === q.correctAnswer ? "text-green-500" : ""}>
                                      ({optionIndex+1})  {option}
                                    </span>
                                    {option === q.correctAnswer && (
                                      <Badge className="bg-green-800">Correct</Badge>
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
                    <div className="mt-4 border border-blue-800 rounded-lg p-6 bg-neutral-800">
                      <h4 className="font-bold text-xl mb-4">Add New Question</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-base font-medium mb-2">Question</label>
                          <Textarea
                            value={newQuestion.question}
                            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                            placeholder="Enter your question"
                            className="w-full bg-neutral-900 border-blue-800 text-base text-white"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <label className="block text-base font-medium">Options</label>
                          {newQuestion.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex gap-2 items-center">
                              <Input
                                value={option}
                                onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                                placeholder={`Option ${optionIndex + 1}`}
                                className="bg-neutral-900 text-base border-blue-800 text-white"
                              />
                              <input 
                                type="radio"
                                name="correctAnswer"
                                checked={newQuestion.correctAnswer === option}
                                onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: option })}
                                className="ml-2 p-3 accent-blue-800"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end">
                          <Button
                            onClick={handleSubmitQuestion}
                            className="bg-blue-800 hover:bg-blue-950 p-5 text-lg flex items-center gap-2"
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