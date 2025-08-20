# Agentic AI Code Review Platform

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://python.org)
[![Django](https://img.shields.io/badge/Django-5.1.5-green.svg)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive AI-powered code review platform that leverages multiple Large Language Models (LLMs) to provide thorough, multi-dimensional analysis of Python codebases. The system combines the power of **Groq (Llama)** and **Google Gemini** models to deliver detailed feedback across eight critical code quality dimensions.

## Features

### Multi-Model AI Analysis
- **Dual LLM Architecture**: Utilizes both Groq (Llama 3.3 70B) and Google Gemini for comprehensive reviews
- **Specialized Agent System**: Eight dedicated AI agents, each focused on specific code quality aspects
- **Comparative Analysis**: Side-by-side reviews from different models for balanced insights

### Comprehensive Code Quality Assessment
1. **Correctness**: Logic validation, bug detection, and edge case identification
2. **Readability**: Code clarity, naming conventions, and maintainability
3. **Documentation**: Docstring quality and code documentation standards
4. **Security**: Vulnerability detection and secure coding practices
5. **Performance**: Optimization opportunities and efficiency analysis
6. **Structure**: Code organization and architectural patterns
7. **Error Handling**: Exception management and robustness evaluation
8. **Test Coverage**: Testing strategy and coverage assessment

### Modern Web Interface
- **React + TypeScript Frontend**: Modern, responsive dashboard
- **Dark/Light Mode**: User preference support
- **Real-time Progress**: Live analysis progress tracking
- **File Navigation**: Tabbed interface for multi-file repositories
- **Expandable Sections**: Organized review presentation

### GitHub Integration
- **Direct Repository Analysis**: Input any public GitHub repository URL
- **Automated File Discovery**: Scans and analyzes all Python files
- **RESTful API**: Clean backend API for extensibility

## Architecture

```
Agentic-AI/
├── Backend/                      # Django REST API
│   ├── manage.py                 # Django management
│   ├── codeagent/                # Core Django project
│   │   ├── settings.py           # Configuration
│   │   ├── urls.py               # URL routing
│   │   └── wsgi.py               # WSGI application
│   ├── review/                   # Review application
│   │   ├── views.py              # API endpoints
│   │   ├── logic.py              # Core review logic
│   │   ├── models.py             # Data models
│   │   └── urls.py               # App URL patterns
│   └── prompts/                  # AI Agent Prompts
│       ├── correctness.txt       # Logic validation prompts
│       ├── security.txt          # Security analysis prompts
│       ├── performance.txt       # Performance review prompts
│       └── ...                   # Other specialized prompts
├── Frontend/                     # React TypeScript App
│   ├── src/
│   │   ├── App.tsx               # Main application component
│   │   ├── main.tsx              # Application entry point
│   │   └── index.css             # Styling
│   ├── package.json              # Dependencies
│   └── vite.config.ts            # Build configuration
├── agent.py                      # Simple AI agent example
├── codereview.py                 # Single-model reviewer
└── modelfusion.py                # Multi-model fusion system
```

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn
- API Keys for:
  - Groq (Llama models)
  - Google Gemini

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hariharanpugazh/Agentic-AI.git
   cd Agentic-AI
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install django djangorestframework django-cors-headers
   pip install groq google-generativeai python-dotenv requests tqdm
   
   # Set up environment variables
   echo "GROQ_API_KEY=your_groq_api_key_here" > .env
   echo "GEMINI_API_KEY=your_gemini_api_key_here" >> .env
   
   # Run migrations
   python manage.py migrate
   
   # Start Django server
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## Usage

### Web Interface
1. Open the dashboard at http://localhost:5173
2. Enter a GitHub repository URL (e.g., `https://github.com/user/repo`)
3. Press Enter or click the analyze button
4. View comprehensive AI-powered reviews across all code quality dimensions

### Standalone Scripts

#### Simple Agent (agent.py)
```bash
python agent.py
```
Basic example of AI-powered code review for a single function.

#### Single Model Reviewer (codereview.py)
```bash
python codereview.py
# Enter GitHub repo URL when prompted
```
Command-line tool using Groq/Llama for repository analysis.

#### Multi-Model Fusion (modelfusion.py)
```bash
python modelfusion.py
# Enter GitHub repo URL when prompted
```
Advanced CLI tool combining Groq and Gemini for comprehensive analysis.

## API Reference

### Review Endpoint
```http
POST /review/review_repo/
Content-Type: application/json

{
  "repo_url": "https://github.com/username/repository"
}
```

**Response Structure:**
```json
{
  "review": {
    "file_path.py": {
      "correctness": {
        "groq": "Analysis from Groq model...",
        "gemini": "Analysis from Gemini model..."
      },
      "security": {
        "groq": "Security review from Groq...",
        "gemini": "Security review from Gemini..."
      },
      // ... other dimensions
    }
  }
}
```

## AI Agents

Each agent is powered by specialized prompts designed for specific analysis:

| Agent | Focus Area | Key Capabilities |
|-------|------------|------------------|
| **Correctness** | Logic & Bugs | Edge cases, logic errors, undefined variables |
| **Readability** | Code Clarity | Naming conventions, code structure, maintainability |
| **Documentation** | Docstrings | API documentation, comment quality |
| **Security** | Vulnerabilities | Hardcoded secrets, injection risks, insecure functions |
| **Performance** | Optimization | Algorithm efficiency, resource usage, bottlenecks |
| **Structure** | Architecture | Code organization, design patterns |
| **Error Handling** | Robustness | Exception management, error recovery |
| **Test Coverage** | Quality Assurance | Testing strategies, coverage analysis |

## Security Considerations

- **API Key Management**: Store sensitive keys in environment variables
- **CORS Configuration**: Properly configured for frontend-backend communication
- **Input Validation**: GitHub URL validation and sanitization
- **Rate Limiting**: Consider implementing for production use

## Frontend Features

- **Responsive Design**: Tailwind CSS for modern, mobile-friendly interface
- **Dark/Light Mode**: System preference detection and manual toggle
- **Progress Tracking**: Real-time analysis progress indicators
- **Code Formatting**: Syntax highlighting and formatted output
- **Expandable Sections**: Organized review presentation with collapsible panels
- **Multi-tab Navigation**: Easy switching between analyzed files

## Development Workflow

### Adding New Review Dimensions
1. Create new prompt file in `Backend/prompts/`
2. Add agent name to `AGENT_NAMES` in `logic.py`
3. Update frontend interfaces in `App.tsx`
4. Test with sample repositories

### Extending LLM Support
1. Add new client initialization in `logic.py`
2. Implement model-specific functions
3. Update review combination logic
4. Add configuration options

## Performance Optimization

- **Concurrent Processing**: Parallel API calls to different LLM providers
- **Caching Strategy**: Consider implementing Redis for repeated analyses
- **Rate Limiting**: Built-in handling for API rate limits
- **Progress Tracking**: Real-time feedback for long-running analyses

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] **Multi-language Support**: Extend beyond Python to JavaScript, Java, C++
- [ ] **Advanced Metrics**: Code complexity scores and quality ratings
- [ ] **Integration APIs**: GitHub App, VS Code extension
- [ ] **Custom Agents**: User-defined review criteria
- [ ] **Report Generation**: PDF/HTML export functionality
- [ ] **Historical Tracking**: Repository improvement over time
- [ ] **Team Collaboration**: Shared reviews and comments

## Known Issues

- Large repositories may require extended processing time
- API rate limits may affect analysis speed
- Some edge cases in file parsing for complex repository structures

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Groq** for providing fast Llama model inference
- **Google** for Gemini API access
- **Django** and **React** communities for excellent frameworks
- **GitHub** for repository hosting and API access

## Support

For questions, issues, or contributions:
- Create an issue on GitHub
- Bug reports are always welcome
- Feature requests and suggestions appreciated

---

**Built with care by [Hariharanpugazh](https://github.com/Hariharanpugazh)**

*Empowering developers with AI-driven code quality insights*
