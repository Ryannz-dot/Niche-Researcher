const axios = require('axios');

class NicheAnalyzer {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async analyzeNiche(topic) {
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
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-4o-mini',
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
          temperature: 0.7,
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      const analysis = JSON.parse(content);

      // Add timestamp
      analysis.timestamp = new Date().toISOString();

      return analysis;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your OPENAI_API_KEY in .env file');
      } else if (error.response?.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later');
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
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new NicheAnalyzer();
