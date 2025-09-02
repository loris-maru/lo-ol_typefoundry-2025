import CardTopic from '@/ui/segments/home/discover-topic/card-topic';
import { useState } from 'react';

export type Topic = {
  title: string;
  subtitle: string;
  description: string;
  link: string;
  textSize: string;
  heading: string[];
};

const TOPICS: Topic[] = [
  {
    subtitle: 'Discover',
    title: 'Hangeul',
    description:
      "A Klingon will be sure to miss what they won't understand. And with what they understand, they will love what they're missing.",
    link: '/discover-hangeul',
    textSize: '30vw',
    heading: ['Hangeul', 'Design'],
  },
  {
    subtitle: 'Tailored',
    title: 'Custom typeface',
    description:
      "A Klingon will be sure to miss what they won't understand. And with what they understand, they will love what they're missing.",
    link: '/discover-hangeul',
    textSize: '30vw',
    heading: ['Custom', 'Type'],
  },
  {
    subtitle: 'Learn',
    title: 'Workshops',
    description:
      "A Klingon will be sure to miss what they won't understand. And with what they understand, they will love what they're missing.",
    link: '/discover-hangeul',
    textSize: '30vw',
    heading: ['Latin', 'Hangeul'],
  },
];

export default function DiscoverTopics() {
  const [activeTopic, setActiveTopic] = useState<Topic | null>(TOPICS[0]);
  const [isAnyCardHovered, setIsAnyCardHovered] = useState(false);
  const [isContentChanging, setIsContentChanging] = useState(false);

  const handleCardHover = (topic: Topic) => {
    // If switching to a different topic, trigger content change animation
    if (activeTopic && activeTopic.title !== topic.title) {
      setIsContentChanging(true);
      // First: slide out in opposite directions
      setTimeout(() => {
        setActiveTopic(topic);
        // Then: slide back in after content change
        setTimeout(() => {
          setIsContentChanging(false);
        }, 50); // Small delay to ensure content is updated
      }, 300); // Wait for slide out animation to complete
    } else {
      setActiveTopic(topic);
    }
    setIsAnyCardHovered(true);
  };

  const handleCardLeave = () => {
    setIsAnyCardHovered(false);
    setActiveTopic(null);
    setIsContentChanging(false);
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-white">
      <div className="relative flex w-[76vw] flex-row flex-nowrap justify-between divide-x divide-black border border-solid border-black">
        {TOPICS.map((topic: Topic, index: number) => (
          <CardTopic
            key={`${topic.title}-${index}`}
            topic={topic}
            activeTopic={activeTopic}
            setActiveTopic={handleCardHover}
            onMouseLeave={handleCardLeave}
          />
        ))}
      </div>
      <div className="font-mayday absolute -bottom-12 left-0 z-0 flex h-full w-full flex-col text-[22vw] leading-none tracking-tight text-black uppercase">
        <div className="relative flex h-1/2 w-full items-center overflow-hidden">
          <div
            id="top-heading"
            className="absolute w-full text-center transition-all duration-300 ease-in-out"
            style={{
              bottom: isAnyCardHovered && !isContentChanging ? '10px' : '-400px',
              transform:
                isAnyCardHovered && !isContentChanging
                  ? 'translateY(0)'
                  : isContentChanging
                    ? 'translateY(-100%)' // Slide down when changing
                    : 'translateY(100%)', // Slide up when hiding
            }}
          >
            {activeTopic?.heading[0]}
          </div>
        </div>
        <div className="relative flex h-1/2 w-full items-center overflow-hidden">
          <div
            id="bottom-heading"
            className="absolute w-full text-center transition-all duration-300 ease-in-out"
            style={{
              top: isAnyCardHovered && !isContentChanging ? '10px' : '-400px',
              transform:
                isAnyCardHovered && !isContentChanging
                  ? 'translateY(0)'
                  : isContentChanging
                    ? 'translateY(100%)' // Slide up when changing
                    : 'translateY(-100%)', // Slide down when hiding
            }}
          >
            {activeTopic?.heading[1]}
          </div>
        </div>
      </div>
    </div>
  );
}
