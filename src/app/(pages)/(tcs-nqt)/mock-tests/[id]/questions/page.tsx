import { getMockTest } from "@/app/api/mockTests";
// import PublishControls from "@/components/mock-tests/PublishControls";
import QuestionGenerator from "@/components/QuestionGenerator"
import { Button } from "@/components/ui/button";

export default async function MockTestQuestionsPage(
  {
  params,
}: any
) {
  console.log("params", params);
  const mockTest = await getMockTest(params.id);
  
  return (
    <div className="container mx-auto p-4">
      

      <QuestionGenerator
     isPublished={mockTest.isPublished}
     mockTest={mockTest.title}
     />

      {/* {!mockTest.isPublished && (
        <div className="mt-8">
          <PublishControls mockTestId={params.id} />
        </div>
      )} */}
    </div>
  );
}