require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000; // Port for the backend server

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to get game data
app.get('/api/game', async (req, res) => {
  try {
    // Step 1: Get the token from Twitch API
    const tokenResponse = await axios.post(
      'https://id.twitch.tv/oauth2/token',
      null,
      {
        params: {
          client_id: process.env.CLIENT_ID, // Client ID from .env
          client_secret: process.env.CLIENT_SECRET, // Client Secret from .env
          grant_type: 'client_credentials',
        },
      }
    );
    const token = tokenResponse.data.access_token;

    // Step 2: Fetch random game data from IGDB
    const response = await axios.post(
      'https://api.igdb.com/v4/games',
      'fields name,cover.image_id; limit 1; offset 0;',
      {
        headers: {
          'Client-ID': process.env.CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const game = response.data[0];
    const coverUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`;

    // Step 3: Respond with the game data
    res.json({ name: game.name, coverUrl });
  } catch (error) {
    console.error('Error fetching game data:', error.message);
    res.status(500).json({ error: 'Failed to fetch game data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
