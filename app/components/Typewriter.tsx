"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  "The community memecoin honoring the king of Solana calls.",
  "Built by degens, for degens.",
  "From the trenches to the top.",
  "No insiders. No presale. No BS.",
  "If you know Ansem, you know why.",
];

export default function Typewriter() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const phrase = PHRASES[phraseIndex];

    if (!deleting && charIndex <= phrase.length) {
      const timeout = setTimeout(() => {
        setText(phrase.slice(0, charIndex));
        setCharIndex((c) => c + 1);
      }, 40 + Math.random() * 30);
      return () => clearTimeout(timeout);
    }

    if (!deleting && charIndex > phrase.length) {
      const timeout = setTimeout(() => setDeleting(true), 2500);
      return () => clearTimeout(timeout);
    }

    if (deleting && charIndex > 0) {
      const timeout = setTimeout(() => {
        setCharIndex((c) => c - 1);
        setText(phrase.slice(0, charIndex - 1));
      }, 20);
      return () => clearTimeout(timeout);
    }

    if (deleting && charIndex === 0) {
      setDeleting(false);
      setPhraseIndex((p) => (p + 1) % PHRASES.length);
    }
  }, [charIndex, deleting, phraseIndex]);

  return (
    <span>
      {text}
      <span className="inline-block w-[2px] h-[1em] bg-chad-green ml-0.5 align-middle animate-pulse" />
    </span>
  );
}
