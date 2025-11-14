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

// API endpoint to get available models (supports both GET and POST)
app.get('/api/models', (req, res) => {
  try {
    const models = nicheAnalyzer.getAvailableModels();
    const defaultProvider = process.env.AI_PROVIDER || 'openai';
    const defaultModel = process.env.DEFAULT_MODEL || 'gpt-4o-mini';

    res.json({
      models,
      defaults: {
        provider: defaultProvider,
        model: defaultModel
      }
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({
      error: 'Failed to fetch available models',
      details: error.message
    });
  }
});

// POST endpoint for models with frontend API keys
app.post('/api/models', (req, res) => {
  try {
    const { openaiKey, openrouterKey } = req.body;

    const models = nicheAnalyzer.getAvailableModels({
      openaiKey,
      openrouterKey
    });

    const defaultProvider = process.env.AI_PROVIDER || 'openai';
    const defaultModel = process.env.DEFAULT_MODEL || 'gpt-4o-mini';

    res.json({
      models,
      defaults: {
        provider: defaultProvider,
        model: defaultModel
      }
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({
      error: 'Failed to fetch available models',
      details: error.message
    });
  }
});

// API endpoint for niche analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const { topic, provider, model, openaiKey, openrouterKey } = req.body;

    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({
        error: 'Please provide a topic to analyze'
      });
    }

    console.log(`Analyzing niche: ${topic}`);
    console.log(`Provider: ${provider || 'default'}, Model: ${model || 'default'}`);
    console.log(`Using ${openaiKey ? 'frontend' : 'backend'} OpenAI key: ${openaiKey ? 'Yes' : 'No'}`);
    console.log(`Using ${openrouterKey ? 'frontend' : 'backend'} OpenRouter key: ${openrouterKey ? 'Yes' : 'No'}`);

    const options = {};
    if (provider) options.provider = provider;
    if (model) options.model = model;
    if (openaiKey) options.openaiKey = openaiKey;
    if (openrouterKey) options.openrouterKey = openrouterKey;

    const analysis = await nicheAnalyzer.analyzeNiche(topic, options);

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
  console.log(`🤖 Models endpoint: http://localhost:${PORT}/api/models`);

  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasOpenRouter = !!process.env.OPENROUTER_API_KEY;

  if (!hasOpenAI && !hasOpenRouter) {
    console.warn('⚠️  Warning: No API keys configured. Please set OPENAI_API_KEY or OPENROUTER_API_KEY in your .env file.');
  } else {
    if (hasOpenAI) console.log('✅ OpenAI API key configured');
    if (hasOpenRouter) console.log('✅ OpenRouter API key configured');
  }
});
