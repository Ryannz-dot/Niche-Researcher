const axios = require('axios');

class NicheAnalyzer {
  constructor() {
    // API Keys
    this.openaiKey = process.env.OPENAI_API_KEY;
    this.openrouterKey = process.env.OPENROUTER_API_KEY;

    // Default configuration
    this.defaultProvider = process.env.AI_PROVIDER || 'openai';
    this.defaultModel = process.env.DEFAULT_MODEL || 'gpt-4o-mini';

    // API URLs
    this.providers = {
      openai: {
        url: 'https://api.openai.com/v1/chat/completions',
        key: this.openaiKey
      },
      openrouter: {
        url: 'https://openrouter.ai/api/v1/chat/completions',
        key: this.openrouterKey
      }
    };

    // Available models
    this.models = {
      openai: [
        { id: 'gpt-4o', name: 'GPT-4o (Most Capable)', category: 'openai' },
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Fast & Affordable)', category: 'openai' },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', category: 'openai' },
        { id: 'gpt-4', name: 'GPT-4', category: 'openai' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Fastest)', category: 'openai' }
      ],
      openrouter: [
        { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Best)', category: 'claude' },
        { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', category: 'claude' },
        { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', category: 'claude' },
        { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku (Fast)', category: 'claude' },
        { id: 'openai/gpt-4o', name: 'GPT-4o', category: 'openai' },
        { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', category: 'openai' },
        { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', category: 'openai' },
        { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5', category: 'google' },
        { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5', category: 'google' },
        { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', category: 'meta' },
        { id: 'mistralai/mistral-large', name: 'Mistral Large', category: 'mistral' },
        { id: 'mistralai/mixtral-8x7b-instruct', name: 'Mixtral 8x7B', category: 'mistral' }
      ]
    };
  }

  getAvailableModels() {
    const models = {};

    if (this.openaiKey) {
      models.openai = this.models.openai;
    }

    if (this.openrouterKey) {
      models.openrouter = this.models.openrouter;
    }

    return models;
  }

  async analyzeNiche(topic, options = {}) {
    const provider = options.provider || this.defaultProvider;
    const model = options.model || this.defaultModel;

    // Validate provider
    if (!this.providers[provider]) {
      throw new Error(`Invalid provider: ${provider}. Must be 'openai' or 'openrouter'`);
    }

    // Get API key (prioritize frontend-provided keys, then fall back to env keys)
    let apiKey;
    if (provider === 'openai' && options.openaiKey) {
      apiKey = options.openaiKey;
    } else if (provider === 'openrouter' && options.openrouterKey) {
      apiKey = options.openrouterKey;
    } else {
      apiKey = this.providers[provider].key;
    }

    if (!apiKey) {
      throw new Error(`API key not configured for ${provider}. Please configure your API key in Settings or set ${provider.toUpperCase()}_API_KEY in your .env file`);
    }

    const apiUrl = this.providers[provider].url;

    const prompt = `Analyze the following niche/topic for a web application opportunity: "${topic}"

Please provide a comprehensive analysis in the following JSON format:

{
  "topic": "${topic}",
  "competitionScore": <number 1-100>,
  "trendScore": <number 1-100>,
  "opportunityRating": <number 1-100>,
  "marketSize": "<small/medium/large>",
  "difficultyLevel": "<easy/medium/hard>",
  "competitionAnalysis": {
    "level": "<low/medium/high>",
    "description": "<brief description>",
    "keyCompetitors": ["<competitor1>", "<competitor2>", "<competitor3>"]
  },
  "trendAnalysis": {
    "direction": "<rising/stable/declining>",
    "description": "<brief description>",
    "growthPotential": "<low/medium/high>"
  },
  "appConcepts": [
    {
      "name": "<app name>",
      "description": "<brief description>",
      "features": [
        "<feature1>",
        "<feature2>",
        "<feature3>",
        "<feature4>",
        "<feature5>"
      ],
      "targetAudience": "<target audience description>",
      "uniqueSellingPoint": "<what makes this unique>",
      "monetization": [
        "<monetization strategy 1>",
        "<monetization strategy 2>",
        "<monetization strategy 3>"
      ],
      "estimatedDevTime": "<timeframe>",
      "techStack": ["<tech1>", "<tech2>", "<tech3>"]
    },
    {
      "name": "<another app name>",
      "description": "<brief description>",
      "features": ["<feature1>", "<feature2>", "<feature3>", "<feature4>", "<feature5>"],
      "targetAudience": "<target audience description>",
      "uniqueSellingPoint": "<what makes this unique>",
      "monetization": ["<strategy1>", "<strategy2>", "<strategy3>"],
      "estimatedDevTime": "<timeframe>",
      "techStack": ["<tech1>", "<tech2>", "<tech3>"]
    }
  ],
  "recommendations": [
    "<recommendation1>",
    "<recommendation2>",
    "<recommendation3>"
  ],
  "risks": [
    "<risk1>",
    "<risk2>",
    "<risk3>"
  ]
}

Provide realistic scores and actionable insights. Focus on creating 2-3 unique, viable app concepts.`;

    try {
      const requestBody = {
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert market analyst and startup consultant specializing in web application opportunities. Provide detailed, data-driven analysis with realistic assessments.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      };

      // Add JSON mode for OpenAI
      if (provider === 'openai') {
        requestBody.response_format = { type: 'json_object' };
      }

      const headers = {
        'Content-Type': 'application/json'
      };

      // Set appropriate authorization header
      if (provider === 'openai') {
        headers['Authorization'] = `Bearer ${apiKey}`;
      } else if (provider === 'openrouter') {
        headers['Authorization'] = `Bearer ${apiKey}`;
        headers['HTTP-Referer'] = 'https://niche-finder.app';
        headers['X-Title'] = 'AI Niche Finder';
      }

      const response = await axios.post(apiUrl, requestBody, { headers });

      const content = response.data.choices[0].message.content;

      // Parse JSON response
      let analysis;
      try {
        analysis = JSON.parse(content);
      } catch (parseError) {
        // If JSON parsing fails, try to extract JSON from markdown code blocks
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[1]);
        } else {
          throw new Error('Failed to parse AI response as JSON');
        }
      }

      // Add metadata
      analysis.timestamp = new Date().toISOString();
      analysis.provider = provider;
      analysis.model = model;

      return analysis;
    } catch (error) {
      console.error('Analysis error:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        throw new Error(`Invalid API key for ${provider}. Please check your configuration`);
      } else if (error.response?.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later');
      } else if (error.response?.status === 400) {
        const errorMsg = error.response.data?.error?.message || 'Bad request';
        throw new Error(`API error: ${errorMsg}`);
      } else if (error.response) {
        throw new Error(`API error: ${error.response.data.error?.message || 'Unknown error'}`);
      } else {
        throw new Error(`Network error: ${error.message}`);
      }
    }
  }

  // Fallback method with mock data (for testing without API key)
  async getMockAnalysis(topic) {
    return {
      topic: topic,
      competitionScore: 65,
      trendScore: 78,
      opportunityRating: 82,
      marketSize: 'medium',
      difficultyLevel: 'medium',
      competitionAnalysis: {
        level: 'medium',
        description: 'Moderate competition with established players but room for innovation',
        keyCompetitors: ['Competitor A', 'Competitor B', 'Competitor C']
      },
      trendAnalysis: {
        direction: 'rising',
        description: 'Growing interest and market demand',
        growthPotential: 'high'
      },
      appConcepts: [
        {
          name: `${topic} Manager Pro`,
          description: 'A comprehensive platform for managing and optimizing your workflow',
          features: [
            'Real-time analytics dashboard',
            'Automated workflow management',
            'AI-powered insights',
            'Team collaboration tools',
            'Mobile app integration'
          ],
          targetAudience: 'Small to medium businesses and professionals',
          uniqueSellingPoint: 'AI-driven automation with intuitive interface',
          monetization: [
            'Subscription model ($9.99-$49.99/month)',
            'Premium features and integrations',
            'Enterprise licensing'
          ],
          estimatedDevTime: '3-6 months',
          techStack: ['React', 'Node.js', 'PostgreSQL', 'AWS']
        }
      ],
      recommendations: [
        'Focus on user experience and intuitive design',
        'Start with MVP to validate market demand',
        'Build strong community and support channels'
      ],
      risks: [
        'Market saturation in some segments',
        'Need for continuous innovation',
        'Customer acquisition costs'
      ],
      timestamp: new Date().toISOString(),
      provider: 'mock',
      model: 'mock'
    };
  }
}

module.exports = new NicheAnalyzer();
