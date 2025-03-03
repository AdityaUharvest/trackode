"use client";
import { useEffect, useState } from "react";

const initialFormData = {
  course: "Bachelor of Technology",
  department: "Computer Science and Engineering",
  semester: "",
  year: "",
  fileType: "",
  subjectName: "",
  submittedByName: "",
  submittedByRollNo: "",
  submittedToName: "",
  submittedToDesignation: "",
  session: "2024-25",
  subjectCode: "",
};

const getOrdinalYear = (year) => {
  const years = [
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
  ];
  return years[year - 1] || "";
};

const getRomanSemester = (semester) => {
  const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  return romans[semester - 1] || "";
};

export default function LabFileCover() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePrint = () => {
    const printContent = document.getElementById("print-content").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();

    document.body.innerHTML = originalContent;
    window.location.reload(); // To restore the original state
  };

  // Load from localStorage
  useEffect(() => {
    const savedData =
      JSON.parse(localStorage.getItem("labFileData")) || initialFormData;
    const savedStep = parseInt(localStorage.getItem("labFileStep")) || 1;
    const savedSubmitted = localStorage.getItem("labFileSubmitted") === "true";

    setFormData(savedData);
    setCurrentStep(savedStep);
    setIsSubmitted(savedSubmitted);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("labFileData", JSON.stringify(formData));
    localStorage.setItem("labFileStep", currentStep.toString());
    localStorage.setItem("labFileSubmitted", isSubmitted.toString());
  }, [formData, currentStep, isSubmitted]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white p-8 relative">
      <p className="text-center text-xl print-controls mb-10 mt-8 font-bold animate-bounce text-blue-600">Cover Page Generator - GITM !</p>

      {!isSubmitted ? (
        <div className="max-w-2xl mx-auto">
          {/* Form Steps */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            {/* Step Indicators */}
            <div className="flex justify-center mb-8">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 
                    ${
                      currentStep === step
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300"
                    }`}
                >
                  {step}
                </div>
              ))}
            </div>

            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Course
                  </label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option>Bachelor of Technology</option>
                    <option>Master of Technology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option>Computer Science and Engineering</option>
                    <option>Information Technology</option>
                    <option>Mechanical Engineering</option>
                    <option>Electrical Engineering</option>
                    <option>Electronics Engineering</option>
                    <option>BioTech Engineering</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Semester
                    </label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Semester</option>
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Year
                    </label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Year</option>
                      {Array.from({ length: 7 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    File Type
                  </label>
                  <select
                    name="fileType"
                    value={formData.fileType}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Type</option>
                    <option>Lab</option>
                    <option>Practical</option>
                    <option>Thesis</option>
                    <option>Project</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    name="subjectName"
                    value={formData.subjectName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    name="subjectCode"
                    value={formData.subjectCode}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Session
                  </label>
                  <input
                    type="text"
                    name="session"
                    value={formData.session}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            )}
            
            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="submittedByName"
                      value={formData.submittedByName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      name="submittedByRollNo"
                      value={formData.submittedByRollNo}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Faculty Name
                    </label>
                    <input
                      type="text"
                      name="submittedToName"
                      value={formData.submittedToName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Designation
                    </label>
                    <input
                      type="text"
                      name="submittedToDesignation"
                      value={formData.submittedToDesignation}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="bg-gray-300 px-4 py-2 rounded-md disabled:opacity-50"
              >
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
          <div className="">
          <p className="text-center mt-10 text-xl text-blue-500 mb-4 font-bold">Sample Preview</p>
          <img className="mx-auto border shadow-blue-600 shadow-md" src="coverpage.png" loading="lazy" ></img>
          </div>
        </div>
      
    ) : (
        /* Cover Page */
        <div>
          <div className="flex gap-4 mb-4 print-controls">
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Edit
            </button>
            <button
              onClick={handlePrint}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Print/Save PDF
            </button>
          </div>
          <div id="print-content">
            <div className="a4-sheet">
              <div className="text-center  space-y-4">
                <div className="mb-12">
                  <h1 className="text-2xl  font-serif font-bold uppercase">
                    Goel Institute of Technology and Management, Lucknow
                  </h1>
                </div>

                <div className="mb-3">
                  <h2 className="text-2xl font-serif font-bold uppercase">
                    Department of {formData.department}
                  </h2>
                </div>

                <div className="mb-20">
                  <p className="text-2xl mb-4">
                    {formData.semester % 2 === 0 ? "Even" : "Odd"} Semester (
                    {formData.session})
                  </p>
                  <div className="text-5xl font-bold mb-10 mt-10 justify-center flex">
                    <img src="gitm.png" alt="College Logo" className="h-96"/>
                  </div>
                  <h3 className="text-2xl font-serif font-bold uppercase">
                    {formData.course}
                  </h3>
                  <p className="text-xl mt-2">
                    {getOrdinalYear(formData.year)} Year (
                    {getRomanSemester(formData.semester)} Sem)
                  </p>
                </div>

                <div className="mb-24">
                  <h2 className="text-2xl font-bold">
                    {formData.fileType} File
                  </h2>
                  <h2 className="text-2xl mt-2">of</h2>
                  <p className="text-2xl mt-4">{formData.subjectName}</p>
                  <p className="text-2xl mt-2">{formData.subjectCode}</p>
                </div>

                <div className="flex justify-between max-w-3xl mx-auto">
                  <div className="text-left ">
                    <p className="text-2xl font-bold mt-16">Submitted By:</p>
                    <p className="text-2xl mt-4">
                      Name: {formData.submittedByName}
                    </p>
                    <p className="text-2xl">
                      Roll No.: {formData.submittedByRollNo}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold mt-16">Submitted To:</p>
                    <p className="text-2xl mt-4">
                      Faculty Name: {formData.submittedToName}
                    </p>
                    <p className="text-2xl">
                      Designation: {formData.submittedToDesignation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          .print-controls, nav,
        footer,
        header,
        .navbar,
        .footer,
        .site-header,
        .site-footer,
        .navigation,
        .menu,
        .nav-container,
        .footer-container{
            display: none !important;
          }

          @page {
            size: A4;
            margin-top:25mm;
            margin:10mm;
          }
          #print-content {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 5;
          }
          .a4-sheet {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 7mm;
            box-sizing: border-box;
          }
        }
        

        /* Ensure the body takes full width on any device */
        body {
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: visible !important;
        }

        /* Force page breaks to be respected on all devices */
        .page-break {
          page-break-before: always;
        }
      `}</style>
    </div>
  );
}
