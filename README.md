# AI Niche Finder 🚀

Discover profitable web app and website ideas with instant AI-powered market analysis. Enter any topic and get competition scores, trend data, opportunity ratings, and complete AI-generated app concepts with features and monetization strategies.

![AI Niche Finder](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

## ✨ Features

- **Instant Market Analysis**: Get comprehensive market insights in seconds
- **Competition Scoring**: Understand the competitive landscape (1-100 scale)
- **Trend Analysis**: See current market trends and growth potential
- **Opportunity Rating**: Overall viability score for your niche
- **AI-Generated App Concepts**: Complete app ideas with:
  - Detailed feature lists
  - Target audience profiles
  - Monetization strategies
  - Recommended tech stacks
  - Estimated development time
- **Smart Recommendations**: Actionable advice for your niche
- **Risk Assessment**: Potential challenges to consider
- **Beautiful UI**: Modern, responsive design that works on all devices

## 🛠️ Technology Stack

- **Backend**: Node.js + Express.js
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **AI Integration**: OpenAI GPT-4
- **Styling**: Custom CSS with modern design patterns

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)
- **At least one of the following API keys:**
  - OpenAI API key ([Get one here](https://platform.openai.com/api-keys)) - For GPT-4, GPT-3.5 models
  - OpenRouter API key ([Get one here](https://openrouter.ai/keys)) - For access to Claude, GPT-4, Gemini, Llama, and more

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Niche-Researcher
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file and configure your AI provider:

**Option A: Using OpenAI (GPT models)**
```env
OPENAI_API_KEY=your_openai_api_key_here
AI_PROVIDER=openai
DEFAULT_MODEL=gpt-4o-mini
PORT=3000
NODE_ENV=development
```

**Option B: Using OpenRouter (Claude, GPT, Gemini, etc.)**
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
AI_PROVIDER=openrouter
DEFAULT_MODEL=anthropic/claude-3.5-sonnet
PORT=3000
NODE_ENV=development
```

**Option C: Using Both (Switch in UI)**
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
AI_PROVIDER=openai
DEFAULT_MODEL=gpt-4o-mini
PORT=3000
NODE_ENV=development
```

### 4. Start the Application

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### 5. Open Your Browser

Navigate to:
```
http://localhost:3000
```

## 📖 Usage

1. **Select Your AI Provider & Model**: Choose from the dropdown menus
   - **OpenAI**: GPT-4o, GPT-4o Mini, GPT-4 Turbo, GPT-3.5 Turbo
   - **OpenRouter**: Claude 3.5 Sonnet, Claude 3 Opus, GPT-4o, Gemini Pro, Llama 3.1, Mistral, and more

2. **Enter a Topic**: Type any niche or topic you want to explore
   - Examples: "AI productivity tools", "fitness tracking", "recipe management"

3. **Click Analyze**: The AI will analyze the market and generate insights

4. **Review Results**: Get instant access to:
   - Competition, trend, and opportunity scores
   - Market size and difficulty level
   - Detailed competition and trend analysis
   - 2-3 complete app concepts with full specifications
   - Recommendations and risk assessments

4. **Explore Concepts**: Each app concept includes:
   - Name and description
   - Target audience
   - Unique selling points
   - Key features (5+ items)
   - Monetization strategies (3+ options)
   - Recommended tech stack
   - Estimated development time

## 🎯 API Endpoints

### GET `/api/models`

Get available AI models and providers.

**Response:**
```json
{
  "models": {
    "openai": [...],
    "openrouter": [...]
  },
  "defaults": {
    "provider": "openai",
    "model": "gpt-4o-mini"
  }
}
```

### POST `/api/analyze`

Analyze a niche topic and generate app concepts.

**Request Body:**
```json
{
  "topic": "AI productivity tools",
  "provider": "openai",
  "model": "gpt-4o-mini"
}
```

Note: `provider` and `model` are optional. If not specified, defaults from `.env` will be used.

**Response:**
```json
{
  "topic": "AI productivity tools",
  "competitionScore": 65,
  "trendScore": 85,
  "opportunityRating": 78,
  "marketSize": "large",
  "difficultyLevel": "medium",
  "competitionAnalysis": {
    "level": "medium",
    "description": "...",
    "keyCompetitors": ["..."]
  },
  "trendAnalysis": {
    "direction": "rising",
    "description": "...",
    "growthPotential": "high"
  },
  "appConcepts": [
    {
      "name": "...",
      "description": "...",
      "features": ["..."],
      "targetAudience": "...",
      "uniqueSellingPoint": "...",
      "monetization": ["..."],
      "estimatedDevTime": "...",
      "techStack": ["..."]
    }
  ],
  "recommendations": ["..."],
  "risks": ["..."],
  "timestamp": "2024-01-01T00:00:00.000Z",
  "provider": "openai",
  "model": "gpt-4o-mini"
}
```

### GET `/api/health`

Check API health status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🤖 Why Use OpenRouter?

OpenRouter provides several advantages:

1. **Access to Multiple Models**: Use Claude, GPT-4, Gemini, Llama, and more with a single API key
2. **Cost Optimization**: Automatically route to the best model for your budget
3. **No Vendor Lock-in**: Switch between models without changing your code
4. **Built-in Rate Limiting**: Automatic cost controls and usage limits
5. **Unified Billing**: One bill for all AI models
6. **Latest Models**: Get access to new models as soon as they're released

## 🏗️ Project Structure

```
Niche-Researcher/
├── public/
│   ├── index.html       # Main HTML file
│   ├── styles.css       # Styling
│   └── app.js           # Frontend JavaScript
├── services/
│   └── nicheAnalyzer.js # AI analysis logic
├── server.js            # Express server
├── package.json         # Dependencies
├── .env.example         # Environment template
├── .gitignore          # Git ignore rules
└── README.md           # Documentation
```

## 🎨 Customization

### Switching AI Providers

You can switch between providers in two ways:

1. **Via UI**: Use the provider dropdown in the web interface
2. **Via Environment**: Set `AI_PROVIDER` and `DEFAULT_MODEL` in `.env`

### Available Models

**OpenAI Models:**
- `gpt-4o` - Most capable, best for complex analysis
- `gpt-4o-mini` - Fast and affordable, recommended for most use cases
- `gpt-4-turbo` - Fast GPT-4 variant
- `gpt-3.5-turbo` - Fastest and cheapest option

**OpenRouter Models:**
- `anthropic/claude-3.5-sonnet` - Best overall, excellent reasoning
- `anthropic/claude-3-opus` - Most capable Claude model
- `anthropic/claude-3-haiku` - Fastest Claude model
- `openai/gpt-4o` - GPT-4o via OpenRouter
- `google/gemini-pro-1.5` - Google's Gemini Pro
- `meta-llama/llama-3.1-70b-instruct` - Open source Llama
- `mistralai/mistral-large` - Mistral's largest model
- And many more!

### Adjusting Analysis Depth

Modify the prompt in `services/nicheAnalyzer.js` to add or remove analysis criteria.

### Styling

Edit `public/styles.css` to customize the look and feel. The CSS uses CSS variables for easy theming:

```css
:root {
    --primary: #6366f1;
    --secondary: #8b5cf6;
    /* ... other variables */
}
```

## 🔒 Security Notes

- Never commit your `.env` file with real API keys
- Keep your API keys secure (both OpenAI and OpenRouter)
- Consider implementing rate limiting for production use
- Add authentication if deploying publicly
- OpenRouter provides built-in rate limiting and cost controls

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | No* | - |
| `OPENROUTER_API_KEY` | Your OpenRouter API key | No* | - |
| `AI_PROVIDER` | Default AI provider (openai or openrouter) | No | openai |
| `DEFAULT_MODEL` | Default model to use | No | gpt-4o-mini |
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment mode | No | development |

\* At least one API key (OPENAI_API_KEY or OPENROUTER_API_KEY) is required

## 🐛 Troubleshooting

### API Key Issues

**For OpenAI:**
1. Verify your API key in `.env`
2. Ensure there are no extra spaces or quotes
3. Check that your OpenAI account has credits
4. Verify the key starts with `sk-`

**For OpenRouter:**
1. Get your API key from https://openrouter.ai/keys
2. Ensure you have credits in your OpenRouter account
3. Check the key format in `.env`
4. OpenRouter keys start with `sk-or-`

### Port Already in Use

If port 3000 is taken:
1. Change the `PORT` in `.env`
2. Or kill the process using port 3000

### Module Not Found

If you see module errors:
1. Delete `node_modules/` folder
2. Run `npm install` again

## 🚀 Deployment

### Deploy to Heroku

```bash
heroku create your-app-name
heroku config:set OPENAI_API_KEY=your_key
git push heroku main
```

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Add environment variables in Vercel dashboard

### Deploy to Railway

1. Connect your GitHub repo to Railway
2. Add environment variables
3. Deploy automatically on push

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Powered by OpenAI's GPT models
- Built with Express.js and modern web technologies
- Designed for entrepreneurs and developers

## 📧 Support

If you have questions or need help, please open an issue in the repository.

---

**Built with ❤️ for entrepreneurs and developers seeking their next big idea**
