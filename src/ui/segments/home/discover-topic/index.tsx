import CardTopic from "@/ui/segments/home/discover-topic/card-topic";
import { useState } from "react";

export type Topic = {
  title: string;
  description: string;
  link: string;
  textSize: string;
  heading: string[];
};

const TOPICS: Topic[] = [
  {
    title: "Discover Hangeul",
    description:
      "A Klingon will be sure to miss what they won't understand. And with what they understand, they will love what they're missing.",
    link: "/discover-hangeul",
    textSize: "30vw",
    heading: ["Type", "Design"],
  },
  {
    title: "Discover Hangeul",
    description:
      "A Klingon will be sure to miss what they won't understand. And with what they understand, they will love what they're missing.",
    link: "/discover-hangeul",
    textSize: "30vw",
    heading: ["Script", "Latin"],
  },
  {
    title: "Discover Hangeul",
    description:
      "A Klingon will be sure to miss what they won't understand. And with what they understand, they will love what they're missing.",
    link: "/discover-hangeul",
    textSize: "30vw",
    heading: ["Hangeul", "Korea"],
  },
];

export default function DiscoverTopics() {
  const [activeTopic, setActiveTopic] = useState<Topic | null>(TOPICS[0]);
  const [isAnyCardHovered, setIsAnyCardHovered] = useState(false);

  const handleCardHover = (topic: Topic) => {
    setActiveTopic(topic);
    setIsAnyCardHovered(true);
  };

  const handleCardLeave = () => {
    setIsAnyCardHovered(false);
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-white">
      <div className="relative w-[76vw] flex flex-row flex-nowrap justify-between">
        {TOPICS.map((topic: Topic) => (
          <CardTopic
            key={topic.title}
            topic={topic}
            activeTopic={activeTopic}
            setActiveTopic={handleCardHover}
            onMouseLeave={handleCardLeave}
          />
        ))}
      </div>
      <div className="absolute z-0 -bottom-12 left-0 w-full h-full flex flex-col text-black text-[22vw] font-mayday uppercase tracking-tight leading-none">
        <div className="relative w-full h-1/2 flex items-center overflow-hidden">
          <div
            id="top-heading"
            className="absolute w-full text-center transition-all duration-700 ease-in-out"
            style={{
              bottom: isAnyCardHovered ? "10px" : "-400px",
              transform: isAnyCardHovered
                ? "translateY(0)"
                : "translateY(100%)",
            }}
          >
            {activeTopic?.heading[0]}
          </div>
        </div>
        <div className="relative w-full h-1/2 flex items-center overflow-hidden">
          <div
            id="bottom-heading"
            className="absolute w-full text-center transition-all duration-700 ease-in-out"
            style={{
              top: isAnyCardHovered ? "10px" : "-400px",
              transform: isAnyCardHovered
                ? "translateY(0)"
                : "translateY(-100%)",
            }}
          >
            {activeTopic?.heading[1]}
          </div>
        </div>
      </div>
    </div>
  );
}
