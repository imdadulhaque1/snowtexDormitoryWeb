import React, { useState, useEffect } from "react";

interface TypingAnimationProps {
  text: string;
  status: boolean;
  availableColor: string;
  notAvailableColor: string;
  className?: any;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  status,
  availableColor,
  notAvailableColor,
  className,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (index < text.length) {
        timeout = setTimeout(() => {
          setDisplayText((prev) => prev + text[index]);
          setIndex((prev) => prev + 1);
        }, 300); // Typing speed
      } else {
        setIsTyping(false);
        timeout = setTimeout(() => setIsTyping(true), 2000); // Pause before deleting
      }
    } else {
      if (index > 0) {
        timeout = setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, -1));
          setIndex((prev) => prev - 1);
        }, 100); // Deleting speed
      } else {
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [index, isTyping, text]);

  return (
    <p
      className={`font-workSans ${
        status ? availableColor : notAvailableColor
      } text-md ${className}`}
    >
      {displayText}
      <span className="animate-blink ">|</span>
    </p>
  );
};

export default TypingAnimation;
