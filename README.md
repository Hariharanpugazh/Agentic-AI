# 🤖 Agentic AI Code Review System

An intelligent, multi-agent AI system that provides comprehensive code reviews for GitHub repositories using multiple LLMs and specialized review agents.

## 🌟 Overview

This project implements an advanced code review system that leverages multiple AI agents to analyze Python code across different dimensions. Each agent specializes in a specific aspect of code quality, providing thorough and actionable feedback.

### Key Features

- **8 Specialized Review Agents**: Each focusing on a specific code quality aspect
- **Multi-LLM Support**: Uses both Groq (Llama) and Google Gemini for comprehensive analysis
- **Multiple Interfaces**: CLI tools, REST API, and web dashboard
- **GitHub Integration**: Automatically fetches and analyzes Python files from repositories
- **Real-time Dashboard**: Interactive React frontend for reviewing results

## 🏗️ Architecture

### Review Agents

The system includes 8 specialized agents, each with tailored prompts:

1. **Correctness Agent** - Logic errors, bugs, edge cases
2. **Readability Agent** - Code clarity, naming conventions, organization
3. **Documentation Agent** - Docstrings, comments, API documentation
4. **Security Agent** - Vulnerabilities, secure coding practices
5. **Performance Agent** - Optimization opportunities, bottlenecks
6. **Structure Agent** - Code architecture, design patterns
7. **Error Handling Agent** - Exception handling, error recovery
8. **Test Coverage Agent** - Testing strategies, missing test cases

### Components

```
├── CLI Tools/
│   ├── agent.py           # Simple single-agent demo
│   ├── codereview.py      # Single-LLM GitHub reviewer
│   └── modelfusion.py     # Multi-LLM fusion reviewer
├── Backend/               # Django REST API
│   ├── codeagent/        # Django project
│   ├── review/           # Review app with multi-agent logic
│   └── prompts/          # Specialized agent prompts
└── Frontend/             # React dashboard
    └── src/              # TypeScript React components
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- API Keys for:
  - [Groq](https://console.groq.com/) (Llama models)
  - [Google Gemini](https://makersuite.google.com/app/apikey)

### 1. Environment Setup

```bash
# Clone the repository
git clone https://github.com/Hariharanpugazh/Agentic-AI.git
cd Agentic-AI

# Create and configure environment file
cp .env.example .env
# Edit .env with your API keys:
# GROQ_API_KEY=your_groq_api_key_here
# GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Backend Setup (Django API)

```bash
cd Backend

# Install Python dependencies
pip install django djangorestframework django-cors-headers python-dotenv
pip install groq google-generativeai requests tqdm

# Run migrations
python manage.py migrate

# Start the Django server
python manage.py runserver
```

### 3. Frontend Setup (React Dashboard)

```bash
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:5173`

## 💻 Usage

### Option 1: Web Dashboard (Recommended)

1. Open the React dashboard at `http://localhost:5173`
2. Enter a GitHub repository URL (e.g., `https://github.com/username/repo`)
3. Click "Analyze Repository"
4. View comprehensive multi-agent reviews organized by file and agent type

### Option 2: CLI Tools

#### Simple Agent Demo
```bash
python agent.py
```

#### Single-LLM GitHub Reviewer
```bash
python codereview.py
# Enter GitHub repository URL when prompted
```

#### Multi-LLM Fusion Reviewer
```bash
python modelfusion.py
# Enter GitHub repository URL when prompted
```

### Option 3: Direct API Usage

```bash
curl -X POST http://localhost:8000/review/review_repo/ \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/username/repository"}'
```

## 📋 API Reference

### POST `/review/review_repo/`

Analyzes a GitHub repository with all 8 agents.

**Request Body:**
```json
{
  "repo_url": "https://github.com/username/repository"
}
```

**Response:**
```json
{
  "review": {
    "filename.py": {
      "correctness": {
        "groq": "Correctness analysis from Groq...",
        "gemini": "Correctness analysis from Gemini..."
      },
      "security": {
        "groq": "Security analysis from Groq...",
        "gemini": "Security analysis from Gemini..."
      },
      "performance": {
        "groq": "Performance analysis from Groq...",
        "gemini": "Performance analysis from Gemini..."
      }
      // ... other agents
    }
  }
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### Model Configuration

Models can be configured in the respective files:

- **Groq Model**: `llama3-70b-8192` (configurable in `Backend/review/logic.py`)
- **Gemini Model**: `gemini-1.5-flash-8b` (configurable in `Backend/review/logic.py`)

## 📊 Dashboard Features

The React dashboard provides:

- **Progress Tracking**: Real-time analysis progress
- **Tabbed Interface**: Easy navigation between files
- **Agent Filtering**: Focus on specific review aspects
- **Model Comparison**: Side-by-side Groq vs Gemini results
- **Responsive Design**: Works on desktop and mobile

## 🛠️ Development

### Backend Development

```bash
cd Backend

# Run tests
python manage.py test

# Create new migrations
python manage.py makemigrations

# Django admin
python manage.py createsuperuser
```

### Frontend Development

```bash
cd Frontend

# Type checking
npm run build

# Linting
npm run lint

# Preview production build
npm run preview
```

## 📁 Project Structure

```
Agentic-AI/
├── .env                     # Environment variables
├── agent.py                 # Simple demo agent
├── codereview.py           # Single-LLM CLI reviewer
├── modelfusion.py          # Multi-LLM CLI reviewer
├── Backend/
│   ├── manage.py           # Django management
│   ├── codeagent/          # Django project settings
│   ├── review/             # Review app
│   │   ├── logic.py        # Multi-agent review logic
│   │   ├── views.py        # API endpoints
│   │   └── urls.py         # URL routing
│   └── prompts/            # Agent prompt templates
│       ├── correctness.txt
│       ├── security.txt
│       ├── performance.txt
│       └── ...
└── Frontend/
    ├── package.json        # Dependencies
    ├── vite.config.ts      # Vite configuration
    └── src/
        ├── App.tsx         # Main dashboard component
        ├── main.tsx        # React entry point
        └── index.css       # Tailwind styles
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### Common Issues

**API Key Errors**
- Ensure `.env` file is properly configured
- Verify API keys are valid and have sufficient credits

**CORS Issues**
- Backend includes CORS middleware for localhost:3000
- Modify `CORS_ALLOWED_ORIGINS` in settings.py if needed

**Import Errors**
- Install all required dependencies: `pip install -r requirements.txt`
- For frontend: `npm install`

**GitHub API Rate Limits**
- The system uses GitHub's public API
- For private repos or higher limits, consider adding GitHub token authentication

### Getting Help

- Check the console logs for detailed error messages
- Ensure all services are running (Django backend + React frontend)
- Verify network connectivity to GitHub and AI service APIs

## 🔮 Future Enhancements

- Support for additional programming languages
- Integration with more LLM providers
- Batch repository analysis
- Custom agent creation interface
- Integration with GitHub Actions/webhooks
- Enhanced visualization and reporting features

---

**Built with ❤️ using Django, React, and cutting-edge AI models**