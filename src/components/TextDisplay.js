import React, { useState } from "react";
import "./TextDisplay.css";

const TextDisplay = ({ enteredWords, validWords}) => {
  const [copied, setCopied] = useState(false); // Define the copied state and setCopied function

  const countEmojis = () => {
    let greenCount = 0;
    let blueCount = 0;
    let redCount = 0;
  
    enteredWords.forEach((word) => {
      if (validWords.includes(word)) {
        let wordGreenCount = 0; // Count of green letters in the current word
        let wordBlueCount = 0; // Count of blue letters in the current word
  
        for (let i = 0; i < word.length; i++) {
          const letter = word[i];
          if (["w", "x", "v", "z", "q"].includes(letter)) {
            wordGreenCount++; // Increment the count of green letters
          } else {
            wordBlueCount++; // Increment the count of blue letters
          }
        }
  
        // Update counts based on the presence of green and blue letters in the word
        greenCount += wordGreenCount; // Special letters: 2 points per letter
        blueCount += wordBlueCount; // Normal letters: 1 point per letter
      } else {
        // Increment red count by 1 for each invalid word
        redCount += 1;
      }
    });
  
    return { greenCount, blueCount, redCount };
  };
  
  

  const { greenCount, blueCount, redCount } = countEmojis();
  const score = (greenCount*2) + blueCount - redCount;

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
