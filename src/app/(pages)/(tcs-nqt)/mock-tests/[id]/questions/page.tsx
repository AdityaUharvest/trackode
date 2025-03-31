'use client';

import { getMockTest } from "@/app/api/mockTests";
import QuestionGenerator from "@/components/QuestionGenerator"
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeContext"; // Adjust the import path as needed
import { useState ,useEffect} from "react";
export default function MockTestQuestionsPage({ params }: any) {
  const { theme, toggleTheme } = useTheme();
  const [mockTest, setMockTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  console.log(params)
  useEffect(() => {
    async function fetchMockTest() {
      const {id}= await params;
      try {
        console.log("hello")
        console.log("Fetching mock test with ID:", params.id);
        const data = await getMockTest(params.id);
        if (!data) {
          throw new Error("Mock test not found");
        }
        console.log(params.id);
        console.log(data);
        setMockTest(data);
      } catch (error) {
        console.error("Error fetching mock test:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMockTest();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!mockTest) {
    return <div>Mock test not found</div>;
  }

  // Example of using theme in styling
  const containerClass = theme === 'dark' 
    ? 'bg-gray-900 text-white' 
    : 'bg-white text-gray-900';

  return (
    <div className={`container mx-auto p-4 min-h-screen ${containerClass}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{mockTest.title}</h1>
        
        <div className="flex items-center gap-4">
          {mockTest.isPublished ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              Published
            </span>
          ) : (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
              Unpublished
            </span>
          )}
          
          <Button onClick={toggleTheme}>
            Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </div>
      </div>

      <QuestionGenerator isPublished={mockTest.isPublished}/>
    </div>
  );
}