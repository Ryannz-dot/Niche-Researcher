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
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

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

Edit the `.env` file and add your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
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

1. **Enter a Topic**: Type any niche or topic you want to explore
   - Examples: "AI productivity tools", "fitness tracking", "recipe management"

2. **Click Analyze**: The AI will analyze the market and generate insights

3. **Review Results**: Get instant access to:
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

### POST `/api/analyze`

Analyze a niche topic and generate app concepts.

**Request Body:**
```json
{
  "topic": "AI productivity tools"
}
```

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
  "timestamp": "2024-01-01T00:00:00.000Z"
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

### Changing the AI Model

Edit `services/nicheAnalyzer.js` and modify the model parameter:

```javascript
model: 'gpt-4o-mini', // Change to gpt-4, gpt-3.5-turbo, etc.
```

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
- Keep your OpenAI API key secure
- Consider implementing rate limiting for production use
- Add authentication if deploying publicly

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes | - |
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment mode | No | development |

## 🐛 Troubleshooting

### API Key Issues

If you see "Invalid API key" errors:
1. Verify your API key in `.env`
2. Ensure there are no extra spaces or quotes
3. Check that your OpenAI account has credits

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
