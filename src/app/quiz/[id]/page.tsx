import connectDB from "@/lib/util";
import QuizPublicDisplay from "@/components/QuizPublicDisplay";
import Quiz from "@/app/model/Quiz";
import { Types } from "mongoose";

export async function getPostData(id: string) {
    await connectDB();
    if (!Types.ObjectId.isValid(id)) {
        return {
            notFound: true,
        };
    }
    const quiz = await Quiz.findById(new Types.ObjectId(id));
    console.log(quiz);
    if (!quiz) {
        return {
            notFound: true,
        };
    }
    return {
        props: { quiz },
    };
}


export default async function IndividualBlogPost({ params }: { params: { id: string } }) {

    const response = await getPostData(params.id);
    if (!response.props) {
        return <div>Quiz not found</div>;
    }
    return <QuizPublicDisplay quiz={response.props.quiz} />;
}
