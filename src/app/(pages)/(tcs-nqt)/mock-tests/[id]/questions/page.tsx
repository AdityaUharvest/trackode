import { getMockTest } from "@/app/api/mockTests";
// import PublishControls from "@/components/mock-tests/PublishControls";
import QuestionGenerator from "@/components/QuestionGenerator"


export default async function MockTestQuestionsPage(
  {
  params,
}: any
) {
  
  const mockTest = await getMockTest(params.id);
  
  return (
    
      

      <QuestionGenerator
     isPublished={mockTest.isPublished}
     mockTest={mockTest.title}
    shareCode={mockTest.shareCode}
     />

      
    
  );
}