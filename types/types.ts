export interface QuizTypes {
    _id: string;
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
    createdAt: string;
    updatedAt: string;
    
}