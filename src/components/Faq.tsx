"use client";
import { useState } from "react";
import { useTheme } from "@/components/ThemeContext"; // Assuming you have a ThemeContext

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { theme } = useTheme(); // Use the theme context

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "What is Trackode",
      answer:
        "Trackode is a one-stop platform for enhancing your coding skills, attempting quizzes, and prepping for contests. It provides a variety of tools and resources to help you track your progress and improve your coding skills.",
    },
    {
      question: "How can I get started with Trackode",
      answer:
        "To get started with Trackode, you can sign up for an account and start exploring the platform. You can access a variety of resources and tools to help you improve your coding skills and track your progress.",
    },
    {
      question: "What do we offer?",
      answer:
        "Quizzes, contests, coding problems, progress tracking, blogs, resources, and many more.",
    },
  ];

  return (
    <div>
      <div
        className={` py-16 mb-5 rounded-3xl px-8 max-w-5xl mx-auto flex flex-col md:flex-row gap-12 ${
          theme === "dark" ? "bg-neutral-900" : "bg-amber-50"
        }`}
      >
        {/* Header Section */}
        <div className="flex flex-col text-left basis-1/2">
          <p
            className={`inline-block font-semibold mb-4 ${
              theme === "dark" ? "text-primary" : "text-blue-600"
            }`}
          >
            Trackode FAQs
          </p>
          <p
            className={`sm:text-4xl text-3xl font-extrabold ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Frequently Asked Questions
          </p>
        </div>

        {/* FAQ List */}
        <ul className="basis-1/2">
          {faqItems.map((item, index) => (
            <li key={index}>
              <button
                className={`relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg ${
                  theme === "dark"
                    ? "border-gray-700 text-white"
                    : "border-gray-300 text-black"
                }`}
                aria-expanded={openIndex === index ? "true" : "false"}
                onClick={() => toggleFAQ(index)}
              >
                <span className="flex-1">{item.question}</span>
                <svg
                  className={`flex-shrink-0 w-4 h-4 ml-auto fill-current transform transition-transform duration-200 ${
                    openIndex === index ? "rotate-45" : ""
                  } ${
                    theme === "dark" ? "fill-white" : "fill-black"
                  }`}
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    y="7"
                    width="16"
                    height="2"
                    rx="1"
                    className="origin-center"
                  ></rect>
                  <rect
                    y="7"
                    width="16"
                    height="2"
                    rx="1"
                    className="origin-center rotate-90"
                  ></rect>
                </svg>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? "max-h-screen" : "max-h-0"
                }`}
                style={{
                  maxHeight: openIndex === index ? "500px" : "0",
                }}
              >
                <div
                  className={`pb-5 leading-relaxed ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <div className="space-y-2 leading-relaxed">{item.answer}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}