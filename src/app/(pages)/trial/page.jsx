"use client"
import { useEffect, useState } from 'react';

const initialFormData = {
  course: 'Bachelor of Technology',
  department: 'Computer Science and Engineering',
  semester: '',
  year: '',
  fileType: '',
  subjectName: '',
  submittedByName: '',
  submittedByRollNo: '',
  submittedToName: '',
  submittedToDesignation: '',
  session: '2024-25'
};

const getOrdinalYear = (year) => {
  const years = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh'];
  return years[year - 1] || '';
};

const getRomanSemester = (semester) => {
  const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  return romans[semester - 1] || '';
};

export default function LabFileCover() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePrint = () => {
    const printContent = document.getElementById('print-content').innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();

    document.body.innerHTML = originalContent;
    window.location.reload(); // To restore the original state
  };

  // Load from localStorage
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('labFileData')) || initialFormData;
    const savedStep = parseInt(localStorage.getItem('labFileStep')) || 1;
    const savedSubmitted = localStorage.getItem('labFileSubmitted') === 'true';

    setFormData(savedData);
    setCurrentStep(savedStep);
    setIsSubmitted(savedSubmitted);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('labFileData', JSON.stringify(formData));
    localStorage.setItem('labFileStep', currentStep.toString());
    localStorage.setItem('labFileSubmitted', isSubmitted.toString());
  }, [formData, currentStep, isSubmitted]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white p-8 relative">
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
                    ${currentStep === step ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                >
                  {step}
                </div>
              ))}
            </div>

            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Course</label>
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
                  <label className="block text-sm font-medium mb-2">Department</label>
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
                    <label className="block text-sm font-medium mb-2">Semester</label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Semester</option>
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Year</label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Year</option>
                      {Array.from({ length: 7 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">File Type</label>
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

                <div>
                  <label className="block text-sm font-medium mb-2">Subject Name</label>
                  <input
                    type="text"
                    name="subjectName"
                    value={formData.subjectName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Session</label>
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
                    <label className="block text-sm font-medium mb-2">Your Name</label>
                    <input
                      type="text"
                      name="submittedByName"
                      value={formData.submittedByName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Roll Number</label>
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
                    <label className="block text-sm font-medium mb-2">Faculty Name</label>
                    <input
                      type="text"
                      name="submittedToName"
                      value={formData.submittedToName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Designation</label>
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
        </div>
      ) : (
        /* Cover Page */
        <div>
          <div className="flex gap-4 mb-4 print:hidden">
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
          <div  className="a4-sheet">
            <div  className="text-center  space-y-4">
              <div className="mb-12">
                <h1 className="text-2xl font-serif font-bold uppercase">
                  Goel Institute of Technology and Management, Lucknow
                </h1>
              </div>

              <div className="mb-3">
                <h2 className="text-2xl font-serif font-bold uppercase">
                  Department of {formData.department}
                </h2>
              </div>

              <div className="mb-20">
                <p className="text-xl mb-4">{formData.semester % 2 === 0 ? 'Even' : 'Odd'} Semester ({formData.session})</p>
                <div className="text-4xl font-bold mb-10 mt-10 justify-center flex">
                  <img src="gitm.png" alt="College Logo"  />
                </div>
                <h3 className="text-2xl font-serif font-bold uppercase">{formData.course}</h3>
                <p className="text-xl mt-2">
                  {getOrdinalYear(formData.year)} Year ({getRomanSemester(formData.semester)} Sem)
                </p>
              </div>

              <div className="mb-24">
                <h2 className="text-2xl font-bold">{formData.fileType} File</h2>
                <h2 className="text-2xl mt-4">of</h2>
                <p className="text-2xl mt-4">{formData.subjectName}</p>
              </div>

              <div className="flex justify-between max-w-2xl mx-auto">
                <div className="text-left ">
                  <p className="text-xl font-bold mt-16">Submitted By:</p>
                  <p className="text-xl mt-4">Name: {formData.submittedByName}</p>
                  <p className="text-xl">Roll No.: {formData.submittedByRollNo}</p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold mt-16">Submitted To:</p>
                  <p className="text-xl mt-4">Faculty Name: {formData.submittedToName}</p>
                  <p className="text-xl">Designation: {formData.submittedToDesignation}</p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media print {
  body {
    margin: 0;
    padding: 0;
  }

  @page {
    size: A4;
    margin: 10mm;
  }

  .a4-sheet {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 10mm;
    box-sizing: border-box;
  }

  .text-2xl {
    font-size: 1.5rem;
  }

  .text-xl {
    font-size: 1.25rem;
  }

  .mb-12 {
    margin-bottom: 3rem;
  }

  .mb-3 {
    margin-bottom: 0.75rem;
  }

  .mb-20 {
    margin-bottom: 5rem;
  }

  .mb-24 {
    margin-bottom: 6rem;
  }

  .mt-16 {
    margin-top: 4rem;
  }

  .mt-4 {
    margin-top: 1rem;
  }

  .mt-2 {
    margin-top: 0.5rem;
  }

  .mt-10 {
    margin-top: 2.5rem;
  }

  .space-y-4 > * + * {
    margin-top: 1rem;
  }

  .flex {
    display: flex;
  }

  .justify-between {
    justify-content: space-between;
  }

  .max-w-2xl {
    max-width: 42rem;
  }

  .mx-auto {
    margin-left: auto;
    margin-right: auto;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .text-center {
    text-align: center;
  }

  .uppercase {
    text-transform: uppercase;
  }

  .font-bold {
    font-weight: bold;
  }

  .font-semibold {
    font-weight: 600;
  }

  .font-serif {
    font-family: serif;
  }

  .bg-white {
    background-color: white;
  }

  .shadow-md {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .rounded-lg {
    border-radius: 0.5rem;
  }

  .p-6 {
    padding: 1.5rem;
  }

  .p-2 {
    padding: 0.5rem;
  }

  .p-8 {
    padding: 2rem;
  }

  .border {
    border-width: 1px;
  }

  .rounded-md {
    border-radius: 0.375rem;
  }

  .w-full {
    width: 100%;
  }

  .h-full {
    height: 100%;
  }

  .min-h-screen {
    min-height: 100vh;
  }

  .print\:hidden {
    display: none;
  }
}
      `}</style>
    </div>
  );
}