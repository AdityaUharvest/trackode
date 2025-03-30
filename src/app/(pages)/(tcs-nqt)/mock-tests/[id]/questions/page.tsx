
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{mockTest.title}</h1>

        {mockTest.isPublished ?(
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            Published
          </span>
        ):(
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
            Unpublished
          </span>
        )
        }
       
      </div>

      <QuestionGenerator isPublished={mockTest.isPublished}/>

      {/* {!mockTest.isPublished && (
        <div className="mt-8">
          <PublishControls mockTestId={params.id} />
        </div>
      )} */}
    </div>
  );
}