const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); // Enables Cross-Origin Resource Sharing for frontend communication
app.use(express.json()); // Parses incoming JSON requests

// Basic route to test the server
app.get('/', (req, res) => {
  res.send('Hello from backend');
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});