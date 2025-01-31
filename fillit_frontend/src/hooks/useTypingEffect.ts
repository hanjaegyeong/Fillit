import { useState, useEffect } from "react";

const useTypingEffect = (messages: string[], step: number, speed = 250) => {
  const [displayedMessages, setDisplayedMessages] = useState(["", "", ""]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

useEffect(() => {
    setDisplayedMessages(["", "", ""]);
    setCurrentMessageIndex(0);
    setCharIndex(0);
}, [step]);

  useEffect(() => {
    if (currentMessageIndex >= messages.length) return;

    const currentMessage = messages[currentMessageIndex];
    if (charIndex < currentMessage.length) {
      const timeout = setTimeout(() => {
        setDisplayedMessages((prev) => {
          const newMessages = [...prev];
          newMessages[currentMessageIndex] =
            currentMessage.slice(0, charIndex + 1);
          return newMessages;
        });
        setCharIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
        
        const nextMessageTimeout = setTimeout(() => {
        setCurrentMessageIndex((prev) => prev + 1);
        setCharIndex(0);
      }, 500);

      return () => clearTimeout(nextMessageTimeout);
    }
  }, [charIndex, currentMessageIndex, messages, speed]);

  return displayedMessages;
};

export default useTypingEffect;
