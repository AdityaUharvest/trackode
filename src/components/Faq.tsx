"use client"
import { useState } from "react";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "What is Trackode",
      answer:
        "Trackode is a one - stop platform for enhancing your coding skills, attempting quizes and prep for contests.It provides a variety of tools and resources to help you track your progress and improve your coding skills.",
    },
    {
      question: "How can I get started with Trackdode",
      answer:
        "To get started with Trackode, you can sign up for an account and start exploring the platform. You can access a variety of resources and tools to help you improve your coding skills and track your progress.",
    },
    {
      question: "What we offers?",
      answer:
        "Quizes, contests ,coding problems, progress tracked ,blogs, resources and many more.",
    },
  ];

  return (
    <div>
      <div className="py-16 mb-10 rounded-3xl   px-8 bg-neutral-900 max-w-5xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Header Section */}
        <div className="flex flex-col text-left basis-1/2">
          <p className="inline-block font-semibold text-primary mb-4">
            Trackode FAQs
          </p>
          <p className="sm:text-4xl text-3xl font-extrabold text-base-content">
            Frequently Asked Questions
          </p>
        </div>

        {/* FAQ List */}
        <ul className="basis-1/2">
          {faqItems.map((item, index) => (
            <li key={index}>
              <button
                className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
                aria-expanded={openIndex === index ? "true" : "false"}
                onClick={() => toggleFAQ(index)}
              >
                <span className="flex-1 text-base-content">{item.question}</span>
                <svg
                  className={`flex-shrink-0 w-4 h-4 ml-auto fill-current transform transition-transform duration-200 ${
                    openIndex === index ? "rotate-45" : ""
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
                <div className="pb-5 leading-relaxed">
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
