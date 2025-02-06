"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, HelpCircle, Play, Timer, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Quiz {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    duration: number;
    totalQuestions: number;
    totalMarks: number;
    isPaid: boolean;
    price: string;
    negativeMarking: boolean;
    shuffleOptions: boolean;
}

interface QuizPublicDisplayProps {
    quiz: Quiz;
}

const QuizPublicDisplay: React.FC<QuizPublicDisplayProps> = ({ quiz }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [quizStatus, setQuizStatus] = useState('');

    const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const startTime = new Date(quiz.startDate).getTime();
        const endTime = new Date(quiz.endDate).getTime();

        if (now < startTime) {
            // Quiz hasn't started
            const difference = startTime - now;
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            setQuizStatus('upcoming');
        } else if (now > endTime) {
            setTimeLeft('Quiz has ended');
            setQuizStatus('ended');
        } else {
            setTimeLeft('Quiz is live!');
            setQuizStatus('live');
        }
    };

    useEffect(() => {
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [quiz.startDate, quiz.endDate]);


    const formatDate = (date: string | undefined): string => {
        if (!date) return 'Not set';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            {/* Status Banner */}
            <Alert className={`${quizStatus === 'live' ? 'bg-green-50' :
                quizStatus === 'upcoming' ? 'bg-blue-50' : 'bg-gray-50'
                }`}>
                <Timer className="h-4 w-4" />
                <AlertDescription className="font-medium">
                    {timeLeft}
                </AlertDescription>
            </Alert>

            <Card className="w-full shadow-lg">
                <CardHeader className="space-y-4">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                        <div className="space-y-2">
                            <CardTitle className="text-3xl font-bold">{quiz.name}</CardTitle>
                            <CardDescription className="text-lg">{quiz.description}</CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {quiz.isPaid && (
                                <Badge className="bg-yellow-500 text-white px-4 py-1">
                                    <DollarSign className="w-4 h-4 mr-1 inline" />
                                    {quiz.price}
                                </Badge>
                            )}
                            <Badge className={`px-4 py-1 ${quizStatus === 'live' ? 'bg-green-500' :
                                quizStatus === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'
                                } text-white`}>
                                {quizStatus === 'live' ? 'Live Now' :
                                    quizStatus === 'upcoming' ? 'Coming Soon' : 'Ended'}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Key Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Quiz Details</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-gray-500" />
                                    <span>Duration: {quiz.duration === 0 ? 'No time limit' : `${quiz.duration} minutes`}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <HelpCircle className="w-5 h-5 text-gray-500" />
                                    <span>{quiz.totalQuestions} Questions • {quiz.totalMarks} Marks</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Schedule</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-gray-500" />
                                    <span>Starts: {formatDate(quiz.startDate)}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-gray-500" />
                                    <span>Ends: {formatDate(quiz.endDate)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Important Notes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {quiz.negativeMarking && (
                                <Alert variant="destructive" className="bg-red-50 border-red-200">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                        This quiz has negative marking
                                    </AlertDescription>
                                </Alert>
                            )}
                            {quiz.shuffleOptions && (
                                <Alert className="bg-purple-50 border-purple-200">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                        Questions will have shuffled options
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-center p-6">
                    <Button
                        size="lg"
                        className={`w-full md:w-auto ${quizStatus === 'live' ? 'bg-green-600 hover:bg-green-700' :
                            'bg-gray-400 cursor-not-allowed'
                            }`}
                        disabled={quizStatus !== 'live'}
                    >
                        <Play className="w-5 h-5 mr-2" />
                        {quizStatus === 'live' ? 'Start Quiz' :
                            quizStatus === 'upcoming' ? 'Quiz Starting Soon' : 'Quiz Ended'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default QuizPublicDisplay;