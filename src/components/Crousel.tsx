"use client";
import React from "react";
import Image from "next/image";

// Map technologies to image URLs
const techImageMap: Record<string, string> = {
  "C": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  JavaScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  Python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  Java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  "CPP": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  "React.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "Node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  TypeScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  SQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  "HTML/CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  Git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  Docker: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  DBMS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
};

const techList = [
  "C", "CPP", "JavaScript", "TypeScript", "Python", "Java",
  "React.js", "Node.js", "SQL", "HTML/CSS", "Git", "Docker", "DBMS",
  // Repeat for seamless loop
  "C", "CPP", "JavaScript", "TypeScript", "Python", "Java",
  "React.js", "Node.js", "SQL", "HTML/CSS", "Git", "Docker", "DBMS"
];

const Carousel: React.FC = () => (
  <div className="pb-10 max-w-6xl overflow-hidden">
    <div
      className="flex  w-max"
      style={{
        animation: "marquee 30s linear infinite",
      }}
    >
      {techList.map((tech, idx) => (
        <div key={tech + idx} className="mx-8 transition-all group">
          <div className="rounded-full p-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <Image
              src={techImageMap[tech] || "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/codeforces.svg"}
              width={40}
              height={20}
              alt={tech}
              className="transition-all"
            />
          </div>
        </div>
      ))}
    </div>
    <style jsx>{`
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}</style>
  </div>
);

export default Carousel;
