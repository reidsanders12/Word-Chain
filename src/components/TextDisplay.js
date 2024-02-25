import React, { useState } from "react";
import "./TextDisplay.css";

const TextDisplay = ({ enteredWords, validWords }) => {
  const [copied, setCopied] = useState(false);

  const countEmojis = () => {
    let greenCount = 0;
    let blueCount = 0;
    let redCount = 0;

    enteredWords.forEach((word) => {
        if (validWords.includes(word)) {
          let isGreen = false; // Flag to track if the word contains a special letter
      
          for (let i = 0; i < word.length; i++) {
            const letter = word[i];
            if (letter === "w" || letter === "x" || letter === "v" || letter === "z") {
              isGreen = true; // Set the flag to true if the letter is special
              break; // Exit the loop since we found a special letter
            }
          }
      
          if (isGreen) {
            greenCount++;
          } else {
            blueCount++;
          }
        } else {
          redCount++;
        }
      });
      
    return { greenCount, blueCount, redCount };
  };

  const { greenCount, blueCount, redCount } = countEmojis();
  const score = greenCount * 2 + blueCount - redCount;

  const copyToClipboard = () => {
    const currentDate = new Date().toLocaleDateString(); // Get current date
    const emojiCountText = `Word Chains ${currentDate}\nGreen: ${greenCount} 🟩\nBlue: ${blueCount} 🟦\nRed: ${redCount} 🟥\nScore: ${score}`;
    navigator.clipboard.writeText(emojiCountText); // Copy emoji count, score, and date details to clipboard
    setCopied(true); // Update state to indicate details have been copied
  };

  return (
    <div className="wordle-display">
      <h2>Results:</h2>
      <div className="emoji-count">
        <div>Green: {greenCount} 🟩</div>
        <div>Blue: {blueCount} 🟦</div>
        <div>Red: {redCount} 🟥</div>
        <div>Score: {score}</div>
      </div>
      <button
        className="copy-button"
        onClick={copyToClipboard}
        disabled={copied}
      >
        {copied ? "Copied!" : "Copy to Clipboard"}
      </button>
    </div>
  );
};

export default TextDisplay;
