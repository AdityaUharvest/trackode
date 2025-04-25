"use client";
import { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const { theme } = useTheme();
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "What is Trackode?",
      answer:
        "Trackode is a comprehensive platform designed for developers to enhance their coding skills through interactive challenges, quizzes, and contests. Our mission is to provide a supportive environment where programmers of all levels can track their progress, identify areas for improvement, and grow their technical abilities in a structured way.",
      category: "general"
    },
    {
      question: "How can I get started with Trackode?",
      answer:
        "Getting started is easy! Simply create an account using your email or social login, complete your developer profile, and you'll be guided through an onboarding process to assess your current skill level. Based on this assessment, we'll recommend a personalized learning path with appropriate challenges and resources tailored to your needs.",
      category: "account"
    },
    {
      question: "What features does Trackode offer?",
      answer:
        "Trackode offers a wide range of features including: interactive coding challenges across multiple languages and difficulty levels, timed coding competitions, specialized quizzes to test theoretical knowledge, personalized progress tracking and analytics, skill badges and certifications, community forums and discussion boards, comprehensive learning resources and tutorials, integration with GitHub to showcase your progress, and mock technical interviews for job preparation.",
      category: "features"
    },
    {
      question: "Is Trackode suitable for beginners?",
      answer:
        "Absolutely! Trackode caters to developers at all skill levels. For beginners, we offer foundational challenges and guided learning paths that introduce programming concepts step by step. Our beginner-friendly interface and comprehensive resources make it easy to start your coding journey with confidence, even if you're just writing your first lines of code.",
      category: "general"
    },
    {
      question: "What programming languages are supported?",
      answer:
        "Trackode currently supports challenges and quizzes in JavaScript, Python, Java, C++, TypeScript, Rust, Go, Ruby, PHP, C#, and Swift. We're constantly expanding our language support based on community demand. Each language includes beginner to advanced level challenges, with specialized tracks for web development, data structures, algorithms, and more.",
      category: "technical"
    },
    {
      question: "How does the ranking system work?",
      answer:
        "Our ranking system is based on a combination of factors including challenge completion, accuracy, efficiency of solutions, participation in contests, consistency, and helping other community members. As you accumulate points, you'll progress through different tiers from Bronze to Diamond, with special recognition for top performers. Your ranking is visible on your public profile and can be shared with potential employers.",
      category: "features"
    },
    {
      question: "Are there any team features for collaborative learning?",
      answer:
        "Yes! Trackode offers team capabilities where you can create or join coding groups for collaborative learning. Teams can participate in special team challenges, track collective progress, create private contests, and engage in friendly competition with other teams. This feature is particularly popular for study groups, bootcamp cohorts, and corporate training programs.",
      category: "features"
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "Currently, Trackode is optimized as a responsive web application that works well on mobile browsers. Our dedicated mobile apps for iOS and Android are in development and scheduled for release next quarter. The mobile apps will include offline challenge modes and push notifications for contests and learning reminders.",
      category: "technical"
    },
    {
      question: "How can Trackode help with job preparation?",
      answer:
        "Trackode prepares you for technical interviews through industry-relevant challenges, algorithm practice, and mock interview simulations. Our challenges are designed based on real interview questions from top tech companies. Premium members get access to company-specific interview preparation tracks and personalized feedback on their solutions from experienced developers.",
      category: "career"
    },
    {
      question: "What are the subscription options?",
      answer:
        "Trackode offers a free tier with access to basic challenges and community features. Our Premium subscription unlocks advanced challenges, detailed analytics, interview preparation resources, and priority support. For organizations, we offer Team and Enterprise plans with custom challenge creation, private leaderboards, and detailed team performance analytics. Educational institutions receive special discounted rates.",
      category: "pricing"
    }
  ];

  // Filter FAQ items based on search term
  useEffect(() => {
    const filtered = faqItems.filter(
      item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm]);

  // Initialize filtered items with all items
  useEffect(() => {
    setFilteredItems(faqItems);
  }, []);

  // Group FAQ items by category
  const categories = Array.from(new Set(faqItems.map(item => item.category)));

  return (
    <div className="py-5">
      <div
        className={`rounded-3xl px-5 py-8 max-w-6xl mx-auto shadow-xl ${
          theme === "dark" 
            ? "bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700" 
            : "bg-gradient-to-br from-white to-gray-50 border border-gray-100"
        }`}
      >
        {/* Header Section */}
        <div className="text-center mb-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p
              className={`inline-block font-semibold text-lg mb-2 px-4 py-1.5 rounded-full ${
                theme === "dark" ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"
              }`}
            >
              Trackode Support Center - FAQs
            </p>
            
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto">
        
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredItems.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`${
                    theme === "dark" ? "hover:bg-gray-800/50" : "hover:bg-gray-50/80"
                  } rounded-lg transition-colors`}
                >
                  <button
                    className={`relative flex items-center w-full p-3 text-left ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                    aria-expanded={openIndex === index ? "true" : "false"}
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className={`flex-1 font-medium text-base ${
                      openIndex === index 
                        ? theme === "dark" ? "text-blue-400" : "text-blue-600" 
                        : ""
                    }`}>
                      {item.question}
                    </span>
                    <span
                      className={`ml-4 flex-shrink-0 p-2 rounded-full transition-colors ${
                        openIndex === index
                          ? theme === "dark"
                            ? "bg-blue-900/50 text-blue-400"
                            : "bg-blue-100 text-blue-600"
                          : theme === "dark"
                          ? "bg-gray-800 text-gray-400"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 transform transition-transform duration-200 ${
                          openIndex === index ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </span>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div
                          className={`p-3 leading-relaxed ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          <div className="space-y-4">
                            <p>{item.answer}</p>
                            <div className={`text-sm inline-block px-3 py-1 rounded-full capitalize ${
                              theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
                            }`}>
                              {item.category}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </ul>
        
        </div>

        {/* Contact Section */}
        <div className="mt-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`max-w-2xl mx-auto p-3 rounded-xl ${
              theme === "dark" 
                ? "bg-gray-800/50 border border-gray-700" 
                : "bg-blue-50 border border-blue-100"
            }`}
          >
            <h3
              className={`text-lg font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Still have questions?
            </h3>
            <p
              className={`mb-4 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Our support team is here to help. Reach out to us anytime.
            </p>
            <Link
              href="/contact"
              className={`px-5 py-2 rounded-lg font-medium transition-all ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Contact Support
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}