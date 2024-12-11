import React, { useState, useEffect } from 'react';
import './styles.css';

const buttonColors = ["red", "blue", "yellow", "green"];

function App() {
  const [gamePattern, setGamePattern] = useState([]); // Stores the game's pattern
  const [userClickedPattern, setUserClickedPattern] = useState([]); // Stores user's input
  const [level, setLevel] = useState(0); // Current level
  const [started, setStarted] = useState(false); // Tracks if the game has started
  const [speed, setSpeed] = useState(1000); // Speed of color flashing

  // Handles user button clicks
  const handleButtonClick = (color) => {
    const newUserPattern = [...userClickedPattern, color];
    setUserClickedPattern(newUserPattern);
    playSound(color);
    animatePress(color);

    // Check user's input
    checkAnswer(newUserPattern);
  };

  // Checks the user's answer against the game pattern
  const checkAnswer = (currentUserPattern) => {
    const currentIndex = currentUserPattern.length - 1;

    if (currentUserPattern[currentIndex] === gamePattern[currentIndex]) {
      // Check if user completed the sequence
      if (currentUserPattern.length === gamePattern.length) {
        setTimeout(() => {
          generateNextSequence();
        }, 1000);
      }
    } else {
      // Game over
      playSound("wrong");
      document.body.classList.add("game-over");
      setTimeout(() => document.body.classList.remove("game-over"), 200);
      document.getElementById("level-title").textContent = "Game Over! Press any key to Restart.";
      resetGame();
    }
  };

  // Generates the next color in the sequence
  const generateNextSequence = () => {
    const randomChosenColor = buttonColors[Math.floor(Math.random() * 4)];
    setGamePattern((prevPattern) => [...prevPattern, randomChosenColor]);
    setUserClickedPattern([]);
    setLevel((prevLevel) => prevLevel + 1);

    document.getElementById("level-title").textContent = `Level ${level + 1}`;
    setTimeout(() => {
      flashButton(randomChosenColor);
      playSound(randomChosenColor);
    }, 500);
  };

  // Flashes a button
  const flashButton = (color) => {
    const button = document.getElementById(color);
    button.classList.add("pressed");
    setTimeout(() => button.classList.remove("pressed"), speed);
  };

  // Plays sound for a button or game-over
  const playSound = (color) => {
    const audio = new Audio(`sounds/${color}.mp3`);
    audio.play();
  };

  // Animates button press
  const animatePress = (color) => {
    const button = document.getElementById(color);
    button.classList.add("pressed");
    setTimeout(() => button.classList.remove("pressed"), 100);
  };

  // Resets the game state
  const resetGame = () => {
    setGamePattern([]);
    setUserClickedPattern([]);
    setLevel(0);
    setStarted(false);
  };

  // Handles key press to start the game
  useEffect(() => {
    const startGame = () => {
      if (!started) {
        resetGame(); // Reset game state on restart
        document.getElementById("level-title").textContent = "Level 1";
        generateNextSequence();
        setStarted(true);
      }
    };

    document.addEventListener("keydown", startGame);
    return () => document.removeEventListener("keydown", startGame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  // Adjusts the speed of flashing
  const handleSpeedChange = (event) => {
    const selectedSpeed = event.target.value;
    switch (selectedSpeed) {
      case "slow":
        setSpeed(1500);
        break;
      case "normal":
        setSpeed(1000);
        break;
      case "fast":
        setSpeed(500);
        break;
      default:
        setSpeed(1000);
    }
  };

  return (
    <div className="App">
      <div className="navbar">
        <h2>Promind🧠</h2>
      </div>
      <h1 id="level-title">Ready to test your memory? Press any key to start the game!</h1>
      {/* How to Play Section */}
      <div className="how-to-play-box">
        <span>How to Play</span>
        <div className="tooltip-container">
          <button className="info-button">i</button>
          <div className="tooltip-text">
            Follow the sequence of colors displayed and click the buttons in the same order. 
            Each round adds a new color to the sequence. Make a mistake, and the game is over. 
            How far can you go?
          </div>
        </div>
      </div>
      <div className='speed-selector'>
        <label htmlFor="speed">Select Speed: </label>
        <select id="speed" className="custom-select" onChange={handleSpeedChange} defaultValue="normal">
          <option value="slow">Slow</option>
          <option value="normal">Normal</option>
          <option value="fast">Fast</option>
        </select>
      </div>
      <div className="container">
        <div className="row">
          {buttonColors.map((color) => (
            <div
              key={color}
              id={color}
              className={`btn ${color}`}
              onClick={() => handleButtonClick(color)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
