import { SmallLink } from "@/ui/molecules/global/links";
import { Topic } from "@/ui/segments/home/discover-topic";
import { cn } from "@/utils/classNames";
import { useState } from "react";

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
      return "50%";
    } else if (
      activeTopic?.title !== topic.title &&
      activeTopic?.title !== ""
    ) {
      // Another card is hovered (activeTopic is set but not this one)
      return "14%";
    } else {
      // No cards are hovered (activeTopic is empty or this one is active)
      return "33%";
    }
  };

  return (
    <div
      className="relative z-10 h-[42vh] border border-solid border-black font-whisper p-6 transition-all duration-700 ease-in-out overflow-hidden bg-white flex flex-col justify-between"
      style={{
        width: getWidth(),
        border: isHovered
          ? "0px solid rgba(0, 0, 0, 0)"
          : "1px solid rgba(0, 0, 0, 0.12)",
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
      <div className="relative z-30 flex flex-col justify-between h-full w-full">
        <div>
          <div className="text-sm">{topic.title}</div>
          <h4 className="text-5xl font-medium font-mayday uppercase tracking-wide leading-none mt-2">
            {topic.title}
          </h4>
        </div>

        <div
          id="card-description"
          style={{ opacity: isHovered ? 1 : 0 }}
          className={cn(
            "flex flex-col gap-y-3 items-start transition-opacity duration-300 ease-in-out",
            isHovered ? "delay-300 opacity-100" : "delay-0 opacity-0"
          )}
        >
          <p className="text-base leading-normal mt-4 transition-opacity duration-300 ease-in-out">
            {topic.description}
          </p>

          <SmallLink
            link={topic.link}
            label={topic.title}
            className="border-black"
          />
        </div>
      </div>
    </div>
  );
}
