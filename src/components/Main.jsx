import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GuessGame() {
  const [guesses, setGuesses] = useState(5);
  const [gameData, setGameData] = useState(null); // Stores game details
  const [userGuess, setUserGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState(null); // Tracks correct/incorrect guess

  // Fetch game data from your backend
  const fetchGameData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/game'); // Pointing to backend API
      const { name, coverUrl } = response.data;
      setGameData({ name, coverUrl });
    } catch (error) {
      console.error('Error fetching game data:', error.message);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  const handleGuess = () => {
    if (userGuess.toLowerCase() === gameData.name.toLowerCase()) {
      setIsCorrect(true);
    } else {
      setGuesses((prev) => prev - 1);
      setIsCorrect(false);
    }
  };

  const handleReset = () => {
    setGuesses(5);
    setIsCorrect(null);
    setUserGuess('');
    fetchGameData(); // Fetch a new random game
  };

  if (!gameData) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Guess the Game</h1>
      <img src={gameData.coverUrl} alt="Game Cover" style={{ width: '300px', height: 'auto' }} />
      <p>Remaining Guesses: {guesses}</p>

      {isCorrect === null ? (
        <>
          <input
            type="text"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            placeholder="Enter your guess"
          />
          <button onClick={handleGuess}>Submit Guess</button>
        </>
      ) : isCorrect ? (
        <p>🎉 Correct! The game was "{gameData.name}".</p>
      ) : (
        <p>❌ Incorrect! Try again.</p>
      )}

      {guesses <= 0 && <p>Out of guesses! The correct answer was "{gameData.name}".</p>}
      {(guesses <= 0 || isCorrect) && <button onClick={handleReset}>Play Again</button>}
    </div>
  );
}

export default GuessGame;

