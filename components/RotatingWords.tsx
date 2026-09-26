"use client";

import { useEffect, useState } from "react";

type RotatingWord = {
  text: string;
  color: string;
};

type RotatingWordsProps = {
  words: RotatingWord[];
  intervalMs?: number;
};

export default function RotatingWords({
  words,
  intervalMs = 2600,
}: RotatingWordsProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, words.length]);

  const word = words[index % words.length];

  return (
    <span key={word.text} className={`hero-rotating-word ${word.color}`}>
      {word.text}
    </span>
  );
}