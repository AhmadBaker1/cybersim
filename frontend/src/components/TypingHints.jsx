import { useEffect, useState } from "react";

const hints = [
  "Try: ' OR '1'='1",
  "Try: admin' --",
  "Try: ' OR 1=1 --",
  "Try: ' OR 'x'='x",
  "Hint: SQL doesn't like truthy shortcuts 😉",
];

export default function TypingHints() {
  const [hintIndex, setHintIndex] = useState(0);
  const [text, setText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentHint = hints[hintIndex];
    if (charIndex < currentHint.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + currentHint[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      const resetTimeout = setTimeout(() => {
        setText("");
        setCharIndex(0);
        setHintIndex((prev) => (prev + 1) % hints.length);
      }, 2500);
      return () => clearTimeout(resetTimeout);
    }
  }, [charIndex, hintIndex]);

  return <span className="animate-pulse">{text}</span>;
}
