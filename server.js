const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const nicheAnalyzer = require('./services/nicheAnalyzer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for niche analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({
        error: 'Please provide a topic to analyze'
      });
    }

    console.log(`Analyzing niche: ${topic}`);

    const analysis = await nicheAnalyzer.analyzeNiche(topic);

    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze niche. Please check your API key configuration.',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Niche Finder running on http://localhost:${PORT}`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/api/analyze`);

  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  Warning: OPENAI_API_KEY not set. Please configure your .env file.');
  }
});
