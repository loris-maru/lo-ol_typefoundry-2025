import { SmallLink } from '@/ui/molecules/global/links';
import { Topic } from '@/ui/segments/home/discover-topic';
import { cn } from '@/utils/classNames';
import { useState } from 'react';

export default function CardTopic({
  topic,
  activeTopic,
  setActiveTopic,
  onMouseLeave,
}: {
  topic: Topic;
  activeTopic: Topic | null;
  setActiveTopic: (topic: Topic) => void;
  onMouseLeave?: () => void;
}) {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Calculate width based on hover states
  const getWidth = () => {
    if (isHovered) {
      return '50%';
    } else if (activeTopic && activeTopic.title !== topic.title) {
      // Another card is hovered (activeTopic is set but not this one)
      return '25%';
    } else {
      // No cards are hovered (activeTopic is null or this one is active)
      return '33.33%';
    }
  };

  return (
    <div
      className="font-whisper relative z-10 flex h-[42vh] flex-col justify-between overflow-hidden bg-white p-6 transition-all duration-700 ease-in-out"
      style={{
        width: getWidth(),
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        setActiveTopic(topic);
      }}
      onFocus={() => {
        setIsHovered(true);
        setActiveTopic(topic);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onMouseLeave?.();
      }}
      onBlur={() => {
        setIsHovered(false);
        onMouseLeave?.();
      }}
    >
      <div className="relative z-30 flex h-full w-full flex-col justify-between">
        <div>
          <div className="text-sm">{topic.subtitle}</div>
          <h4 className="font-mayday mt-2 text-5xl leading-none font-medium tracking-wide uppercase">
            {topic.title}
          </h4>
        </div>

        <div
          id="card-description"
          style={{ opacity: isHovered ? 1 : 0 }}
          className={cn(
            'flex flex-col items-start gap-y-3 transition-opacity duration-300 ease-in-out',
            isHovered ? 'opacity-100 delay-300' : 'opacity-0 delay-0',
          )}
        >
          <p className="mt-4 text-base leading-normal transition-opacity duration-300 ease-in-out">
            {topic.description}
          </p>

          <SmallLink link={topic.link} label={topic.title} className="border-black" />
        </div>
      </div>
    </div>
  );
}
