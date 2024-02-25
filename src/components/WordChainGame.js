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

//   const generateStartingWord = () => {
//     const storedDate = localStorage.getItem("lastGameDate");
//     const currentDate = new Date().toLocaleDateString();

//     if (storedDate === currentDate) {
//       setMessageContent("You can only play once a day!"); // Set the message content
//       setShowMessage(true); // Show the message modal
//       return; // Exit the function early
//     }

//     const randomIndex = Math.floor(Math.random() * validWords.length);
//     const randomWord = validWords[randomIndex];
//     setCurrentWord(randomWord);
//     localStorage.setItem("startingWord", randomWord);
//     localStorage.setItem("startingWordDate", currentDate);
//     localStorage.setItem("lastGameDate", currentDate);
//     setShowStartingWord(true);
//     setTimer(30);
//   };

const generateStartingWord = () => {
    const storedDate = localStorage.getItem("startingWordDate");
    const currentDate = new Date().toLocaleDateString();
    // Check if the stored date matches the current date
    if (storedDate === currentDate) {
      const storedWord = localStorage.getItem("startingWord");
      setCurrentWord(storedWord);
    } else {
      const randomIndex = Math.floor(Math.random() * validWords.length);
      const randomWord = validWords[randomIndex];
      setCurrentWord(randomWord);
      localStorage.setItem("startingWord", randomWord);
      localStorage.setItem("startingWordDate", currentDate);
    }

    setShowStartingWord(true); // Show the starting word when the button is clicked
    setTimer(30); // Initialize the timer when the button is clicked
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const lowerCaseInput = inputWord.trim().toLowerCase();
    
    // Add the entered word to the entered words list
    setEnteredWords([...enteredWords, lowerCaseInput]);
  
    if (enteredWords.includes(lowerCaseInput)) {
      setMessageContent("You've already entered this word!"); // Set the message content
      setShowMessage(true); // Show the message modal
      setScore(score - 1); // Deduct one point from the score
      return;
    }
    
    if (lowerCaseInput.length > 0) {
      if (
        currentWord === "" ||
        lowerCaseInput[0] === currentWord[currentWord.length - 1]
      ) {
        let found = validWords.includes(lowerCaseInput);
        if (!found) {
          setMessageContent("The word is not in the word list!"); // Set the message content
          setShowMessage(true); // Show the message modal
          setScore(score - 1); // Deduct one point from the score
        }
        if (found) {
          // Check if the word starts with the last letter of the previous word
          if (currentWord !== "" && lowerCaseInput[0] !== currentWord[currentWord.length - 1]) {
            setScore(score - 1); // Penalize the score by minus a point
          }
  
          setCurrentWord(lowerCaseInput);
          setInputWord("");
          let wordScore = 0;
          for (let letter of lowerCaseInput) {
            if (["w", "x", "v", "z"].includes(letter)) {
              wordScore += 2;
            } else {
              wordScore += 1;
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
  };
  
  
  const restartGame = () => {
    setScore(0);
    setTimer(null); // Reset the timer to null
    setCurrentWord("");
    setGameOver(false);
    setEnteredWords([]);
    setInputWord(""); // Reset the input field
    setShowStartingWord(false); // Hide the starting word when the game restarts
  };

  return (
    <div className="word-game-container">
      <h1 className="game-title">Word Chain Game</h1>
      <div className="game-info">
        {showStartingWord && (
          <p className="word">Current Word: <strong>{currentWord}</strong></p>
        )}
        <p className="info">
          Time Left:{" "}
          {timer !== null ? timer : 'Press "Get Word" to start the timer'}
        </p>
      </div>
      {!gameOver ? (
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              className="word-input"
              type="text"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              placeholder="Type a word..."
              disabled={timer === 0 || timer === null}
            />
          </div>
          <div className="button-container">
            <button
              className="submit-button"
              type="submit"
              disabled={timer === 0 || timer === null}
            >
              Submit
            </button>
            <button className="get-word-button" onClick={generateStartingWord}>
              Get Word
            </button>
          </div>
        </form>
      ) : (
        <div className="game-over">
          <h2>Game Over!</h2>
          <button className="restart-button" onClick={restartGame}>
            Restart Game
          </button>
        </div>
      )}
      {gameOver && (
        <TextDisplay enteredWords={enteredWords} validWords={validWords} />
      )}
      <div className="entered-words">
        <h2>Entered Words:</h2>
        {enteredWords.map((word, index) => (
          <h3 key={index} className="past-word">
            {word}
          </h3>
        ))}
      </div>
      {showMessage && (
        <MessageModal
          message={messageContent}
          onClose={() => setShowMessage(false)}
        />
      )}
    </div>
  );
};

export default WordGame;
