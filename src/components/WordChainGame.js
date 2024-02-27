import React, { useState, useEffect } from "react";
import "./WordChainGame.css"; // Import your CSS file for styling
import TextDisplay from "./TextDisplay"; // Import the WordleDisplay component
import MessageModal from "./MessageModel";

const WordGame = () => {
  const [inputWord, setInputWord] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [validWords, setValidWords] = useState([]);
  const [enteredWords, setEnteredWords] = useState([]);
  const [showStartingWord, setShowStartingWord] = useState(false);
  const [showMessage, setShowMessage] = useState(false); // State to control the message modal
  const [messageContent, setMessageContent] = useState(""); // State to store the message content
  const [showStartMessage, setShowStartMessage] = useState(true); // State to control the visibility of the start message

  const closeStartMessage = () => {
    setShowStartMessage(false);
  };

  useEffect(() => {
    const loadWords = async () => {
      try {
        const response = await fetch(process.env.PUBLIC_URL + "/words.txt");
        const text = await response.text();
        const words = text.split("\n").map((word) => word.trim().toLowerCase());
        setValidWords(words);
      } catch (error) {
        console.error("Error loading words:", error);
      }
    };
    loadWords();
  }, []);

  useEffect(() => {
    if (timer !== null && timer > 0 && !gameOver) {
      // Check if the timer is not null
      const countdown = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0) {
      setGameOver(true);
    }
  }, [timer, gameOver]);

  // const generateStartingWord = () => {
  //   const storedDate = localStorage.getItem("startingWordDate");
  //   const currentDate = new Date().toLocaleDateString();
  //   // Check if the stored date matches the current date
  //   if (storedDate === currentDate) {
  //     const storedWord = localStorage.getItem("startingWord");
  //     setCurrentWord(storedWord);
  //   } else {
  //     const randomIndex = Math.floor(Math.random() * validWords.length);
  //     const randomWord = validWords[randomIndex];
  //     setCurrentWord(randomWord);
  //     localStorage.setItem("startingWord", randomWord);
  //     localStorage.setItem("startingWordDate", currentDate);
  //   }

  //   setShowStartingWord(true); // Show the starting word when the button is clicked
  //   setTimer(30); // Initialize the timer when the button is clicked
  // };

  const generateStartingWord = () => {
    const storedDate = localStorage.getItem("lastGameDate");
    const currentDate = new Date().toLocaleDateString();

    if (storedDate === currentDate) {
      setMessageContent("You can only play once a day!"); // Set the message content
      setShowMessage(true); // Show the message modal
      return; // Exit the function early
    }

    const randomIndex = Math.floor(Math.random() * validWords.length);
    const randomWord = validWords[randomIndex];
    setCurrentWord(randomWord);
    localStorage.setItem("startingWord", randomWord);
    localStorage.setItem("startingWordDate", currentDate);
    localStorage.setItem("lastGameDate", currentDate);
    setShowStartingWord(true);
    setTimer(30);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const lowerCaseInput = inputWord.trim().toLowerCase();
  
    if (lowerCaseInput.length === 0 || enteredWords.includes(lowerCaseInput)) {
      // Do nothing if the input word is empty or has already been entered
      setInputWord(""); // Clear the input field
      return;
    }
  
    // Add the entered word to the entered words list
    setEnteredWords([...enteredWords, lowerCaseInput]);
  
    if (enteredWords.includes(lowerCaseInput)) {
      setMessageContent("You've already entered this word!"); // Set the message content
      setShowMessage(true); // Show the message modal
      setScore(score - 1); // Deduct one point from the score
      setInputWord(""); // Clear the input field
      return;
    }
  
    if (lowerCaseInput.length > 0) {
      if (
        currentWord === "" ||
        lowerCaseInput[0] === currentWord[currentWord.length - 1]
      ) {
        // Check if the word is valid
        let found = validWords.includes(lowerCaseInput);
        if (!found) {
          setMessageContent("The word is not in the word list!"); // Set the message content
          setShowMessage(true); // Show the message modal
          setScore(score - 1); // Deduct one point from the score
        } else {
          // Update the current word if the input is valid
          setCurrentWord(lowerCaseInput);
  
          // Calculate score based on letters
          let wordScore = 0;
          for (let letter of lowerCaseInput) {
            if (["w", "x", "v", "z", "q"].includes(letter)) {
              wordScore += 2; // Special letters: 2 points
            } else {
              wordScore += 1; // Normal letters: 1 point
            }
          }
          setScore(score + wordScore);
        }
      } else {
        setMessageContent("The word must begin with the last letter of the previous word!"); // Set the message content
        setShowMessage(true); // Show the message modal
        setScore(score - 1); // Deduct one point from the score
      }
    }
  
    // Clear the input field after submitting
    setInputWord("");
  };
  
  
  

  return (
    <div>
      {showStartMessage && (
        <div className="start-message">
          <div className="message-content">
            <h2>Welcome to the Word Chain Game!</h2>
            <p>
              The objective of the game is to create a chain of words where each
              word starts with the last letter of the previous word.
              <br />
              You earn points based on the letters in the words:
            </p>
            <ul>
              <li>Normal letters: 1 point</li>
              <li>Special letters (z, w, x, v, or q): 2 points</li>
            </ul>
            <p>
              However, if you enter a word that doesn't follow the rules or
              isn't in the word list, you'll lose a point.
            </p>
            <button className="close-button" onClick={closeStartMessage}>
              Close
            </button>
          </div>
        </div>
      )}
      <div className="word-game-container">
        {
          <div className="word-game-container">
            {" "}
            <h1 className="game-title">Word Chain Game</h1>{" "}
            <div className="game-info">
              {" "}
              {showStartingWord && (
                <p className="word">
                  Current Word: <strong>{currentWord}</strong>
                </p>
              )}{" "}
              <p className="info">
                {" "}
                Time Left:{" "}
                {timer !== null
                  ? timer
                  : 'Press "Get Word" to start the timer'}{" "}
              </p>{" "}
            </div>{" "}
            {showMessage && (
              <MessageModal
                message={messageContent}
                onClose={() => setShowMessage(false)}
              />
            )}
            {!gameOver ? (
              <form onSubmit={handleSubmit}>
                {" "}
                <div className="input-container">
                  {" "}
                  <input
                    className="word-input"
                    type="text"
                    value={inputWord}
                    onChange={(e) => setInputWord(e.target.value)}
                    placeholder="Type a word..."
                    disabled={timer === 0 || timer === null}
                  />{" "}
                </div>{" "}
                <div className="button-container">
                  {" "}
                  <button
                    className="submit-button"
                    type="submit"
                    disabled={timer === 0 || timer === null}
                  >
                    {" "}
                    Submit{" "}
                  </button>{" "}
                  <button
                    className="get-word-button"
                    onClick={generateStartingWord}
                  >
                    {" "}
                    Get Word{" "}
                  </button>{" "}
                </div>{" "}
              </form>
            ) : (
              <div className="game-over">
                {" "}
                <h2>Game Over!</h2>{" "}
                {/* <button className="restart-button" onClick={restartGame}>             Restart Game           </button> */}{" "}
              </div>
            )}{" "}
            {gameOver && (
              <TextDisplay
                enteredWords={enteredWords}
                validWords={validWords}
              />
            )}{" "}
            <div className="entered-words">
              {" "}
              <h2>Entered Words:</h2>{" "}
              {enteredWords.map((word, index) => (
                <h3 key={index} className="past-word">
                  {" "}
                  {word}{" "}
                </h3>
              ))}{" "}
            </div>{" "}
          </div>
        }
      </div>
    </div>
  );
};

export default WordGame;

//   const restartGame = () => {
//     setScore(0);
//     setTimer(null); // Reset the timer to null
//     setCurrentWord("");
//     setGameOver(false);
//     setEnteredWords([]);
//     setInputWord(""); // Reset the input field
//     setShowStartingWord(false); // Hide the starting word when the game restarts
//   };
