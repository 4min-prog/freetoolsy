"use client";

import { useEffect, useState } from "react";
import SplitText from "./SplitText";

type RotatingHeroWordProps = {
  words: string[];
  intervalMs?: number;
};

export default function RotatingHeroWord({
  words,
  intervalMs = 2600,
}: RotatingHeroWordProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, words.length]);

  const word = words[index % words.length];

  return (
    <SplitText
      key={word}
      tag="span"
      text={word}
      delay={60}
      duration={0.5}
      ease="power3.out"
      from={{ opacity: 0, y: 40 }}
      to={{ opacity: 1, y: 0 }}
      threshold={0.1}
      rootMargin="-100px"
      textAlign="left"
    />
  );
}