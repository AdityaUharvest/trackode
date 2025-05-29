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
      question: "How does Trackode generate personalized quizzes?",
      answer:
        "Trackode uses AI to analyze your skill level, past performance, and learning goals to create tailored quizzes. After completing an initial assessment, our system curates questions that match your current abilities and areas for improvement, ensuring a focused learning experience.",
      category: "features",
    },
    {
      question: "Can I create and share my own quizzes?",
      answer:
        "Yes! Trackode allows you to design custom quizzes with your own questions or use our AI to generate them. You can share quizzes with others via a unique link or QR code, perfect for educators, team leads, or study groups.",
      category: "features",
    },
    {
      question: "What kind of progress tracking does Trackode offer?",
      answer:
        "Trackode provides detailed analytics, including performance trends, topic-specific strengths and weaknesses, and completion rates. You can view your progress on a personalized dashboard and earn badges for milestones, helping you stay motivated.",
      category: "features",
    },
    {
      question: "How do I join or create a coding community on Trackode?",
      answer:
        "You can join existing communities or create your own in the 'Community' section. Communities allow you to collaborate on challenges, share resources, and compete in group contests. Invite friends or colleagues to join your group for collaborative learning.",
      category: "community",
    },
    {
      question: "Are Trackode quizzes suitable for job interview prep?",
      answer:
        "Absolutely! Trackode offers mock interview challenges based on real questions from top tech companies. Our premium plan includes company-specific tracks and detailed feedback on your solutions to help you ace technical interviews.",
      category: "career",
    },
    {
      question: "Which programming languages can I practice on Trackode?",
      answer:
        "Trackode supports a wide range of languages, including Python, JavaScript, Java, C++, TypeScript, Go, and more. Each language offers challenges across beginner, intermediate, and advanced levels, covering algorithms, data structures, and real-world scenarios.",
      category: "technical",
    },
    {
      question: "How does Trackode ensure quiz quality and accuracy?",
      answer:
        "Our quizzes are created and reviewed by experienced developers and AI algorithms to ensure accuracy and relevance. Questions are regularly updated based on user feedback and industry trends to maintain high quality.",
      category: "technical",
    },
    {
      question: "Can I access Trackode on mobile devices?",
      answer:
        "Yes, Trackode is fully responsive and works seamlessly on mobile browsers. Dedicated iOS and Android apps are in development, with features like offline mode and push notifications, expected to launch soon.",
      category: "technical",
    },
    {
      question: "What are the benefits of a premium subscription?",
      answer:
        "The premium subscription unlocks advanced challenges, in-depth analytics, exclusive interview prep tracks, and priority support. It also includes access to premium community features like private contests and custom leaderboards.",
      category: "pricing",
    },
    {
      question: "How can I get help if I encounter issues?",
      answer:
        "Our support team is available 24/7 via the 'Contact Support' page. You can also browse our help center for guides or ask questions in our community forums for quick peer support.",
      category: "support",
    },
  ];

  // Filter FAQ items based on search term
  useEffect(() => {
    const filtered = faqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm]);

  // Initialize filtered items with all items
  useEffect(() => {
    setFilteredItems(faqItems);
  }, []);

  return (
    <div className="py-5">
      <div
        className={`rounded-xl px-5 py-8 max-w-6xl mx-auto shadow-xl ${
          theme === "dark"
            ? "bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700"
            : "bg-gradient-to-br from-white to-gray-50 border border-gray-100"
        }`}
      >
        <div className="max-w-7xl mt-2 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredItems.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`${
                  theme === "dark" ? "hover:bg-gray-800/50" : "hover:bg-gray-50/80"
                } rounded-lg transition-colors list-none`}
              >
                <button
                  className={`relative flex items-center w-full p-3 text-left ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                  aria-expanded={openIndex === index ? "true" : "false"}
                  onClick={() => toggleFAQ(index)}
                >
                  <span
                    className={`flex-1 font-medium lg:text-base text-sm ${
                      openIndex === index
                        ? theme === "dark"
                          ? "text-blue-400"
                          : "text-blue-600"
                        : ""
                    }`}
                  >
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
                        <div className="space-y-4 text-sm">
                          <p>{item.answer}</p>
                          <div
                            className={`text-sm inline-block px-3 py-1 rounded-full capitalize ${
                              theme === "dark"
                                ? "bg-gray-800 text-gray-400"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.category}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`max-w-2xl mx-auto p-5 rounded-xl ${
              theme === "dark"
                ? "bg-gray-800/50 border border-gray-700"
                : "bg-blue-50 border border-blue-100"
            }`}
          >
            <h3
              className={`lg:text-base text-sm font-semibold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Still have questions?
            </h3>
            <p
              className={`mb-4 text-sm ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Our support team is here to help. Reach out to us anytime.
            </p>
            <Link
              href="/contact"
              className={`px-5 py-2 rounded-lg text-sm transition-all ${
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