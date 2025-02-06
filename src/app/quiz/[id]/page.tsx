import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Quiz from '@/app/model/Quiz';
import { Types } from 'mongoose';
import connectDB from '@/lib/util';
import QuizPublicDisplay from '@/components/QuizPublicDisplay';
import { QuizTypes } from '../../../../types/types';

const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
            </Alert>
            <div className="mt-6 flex justify-center">
                <Button
                    onClick={() => window.location.href = '/quizzes'}
                    variant="outline"
                >
                    Back to Quizzes
                </Button>
            </div>
        </Card>
    </div>
);

const LoadingDisplay = () => (
    <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
);


const serializeDocument = (doc: any) => {
    const serialized = JSON.parse(JSON.stringify(doc));

    if (serialized._id) {
        serialized._id = serialized._id.toString();
    }
    if (serialized.createdBy) {
        serialized.createdBy = serialized.createdBy.toString();
    }

    ['createdAt', 'updatedAt', 'startDate', 'endDate'].forEach(field => {
        if (serialized[field]) {
            serialized[field] = new Date(serialized[field]).toISOString();
        }
    });
    return serialized;
};

export async function getPostData(id: string) {
    try {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) {
            return {
                notFound: true,
                error: "Invalid quiz ID format"
            };
        }

        const quizData = await Quiz.findById(new Types.ObjectId(id))
            .select('-questions')
            .lean();

        if (!quizData) {
            return {
                notFound: true,
                error: "Quiz not found"
            };
        }


        const serializedQuiz = serializeDocument(quizData);


        if (!serializedQuiz.name || !serializedQuiz.description) {
            return {
                notFound: true,
                error: "Invalid quiz data"
            };
        }

        return {
            props: {
                quiz: serializedQuiz
            }
        };
    } catch (error) {
        console.error('Error in getPostData:', error);
        throw new Error('Failed to fetch quiz data');
    }
}

export default async function QuizPage({ params }: { params: { id: string } }) {
    try {
        if (!params?.id) {
            return <ErrorDisplay message="Quiz ID is required" />;
        }

        const response = await getPostData(params.id);

        if (!response.props) {
            return <ErrorDisplay message="Quiz not found or has been removed" />;
        }

        const quiz = response.props.quiz as QuizTypes;

        if (!quiz.name || !quiz.description) {
            return <ErrorDisplay message="Invalid quiz data" />;
        }

        return <QuizPublicDisplay quiz={quiz} />;
    } catch (error) {
        console.error('Error loading quiz:', error);
        return (
            <ErrorDisplay
                message="Something went wrong while loading the quiz. Please try again later."
            />
        );
    }
}