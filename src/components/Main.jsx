import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GuessGame() {
  const [guesses, setGuesses] = useState(5);
  const [gameData, setGameData] = useState(null); 
  const [userGuess, setUserGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState(null); 


  const fetchGameData = async () => {
    try {
      const clientId = 'your_client_id';
      const clientSecret = 'your_client_secret';
      const tokenResponse = await axios.post(
        'https://id.twitch.tv/oauth2/token',
        null,
        {
          params: {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials',
          },
        }
      );
      const token = tokenResponse.data.access_token;

      const response = await axios.post(
        'https://api.igdb.com/v4/games',
        'fields name,cover.image_id; limit 1; offset 0;',
        {
          headers: {
            'Client-ID': clientId,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const game = response.data[0];
      const coverUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`;

      setGameData({ name: game.name, coverUrl });
    } catch (error) {
      console.error('Error fetching game data:', error);
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
    fetchGameData();
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
