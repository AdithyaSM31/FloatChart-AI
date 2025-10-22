# FloatChart-AI 🌊# FloatChat Frontend



An AI-powered ocean data intelligence platform for analyzing ARGO float data using natural language queries.A beautiful, immersive ocean-themed frontend for FloatChat - an AI-powered ocean data intelligence platform. Built with React.js, Three.js, and modern web technologies.



![FloatChart AI](https://img.shields.io/badge/AI-Powered-blue)## 🌊 Features

![Python](https://img.shields.io/badge/Python-3.11-green)

![React](https://img.shields.io/badge/React-18.2-61dafb)### Immersive Ocean Theme

![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688)- **3D Ocean Background**: Interactive Three.js-powered ocean scene with realistic water shaders

- **Dynamic Animations**: Smooth page transitions, floating particles, and wave effects

## 🚀 Features- **Underwater Mode**: Toggle between surface and underwater views

- **Ocean Depth Indicator**: Real-time depth visualization

- 🤖 **AI-Powered Chat**: Ask questions about ocean data in natural language using Llama 3.3 70B via Groq

- 📊 **Interactive Dashboard**: Visualize ocean data with real-time analytics### Multilingual Support

- 🗺️ **Geographic Visualization**: Interactive maps showing ocean measurement locations- **12 Languages**: English, Hindi, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Odia, Malayalam, Punjabi

- 🌐 **Multilingual Support**: 12 languages including English, Hindi, Tamil, and more- **RTL Support**: Right-to-left language support for Urdu

- 🎨 **Beautiful UI**: Immersive ocean-themed interface with smooth animations- **Dynamic Language Switching**: Seamless language changes with persistent preferences

- ⚡ **Lightning Fast**: Groq's LPU inference for ultra-fast AI responses

- 🔍 **RAG System**: Vector search for context-aware responses### Interactive Components

- **Chat Interface**: Natural language query interface with AI responses

## 🛠️ Tech Stack- **Dashboard**: Comprehensive ocean data analytics and metrics

- **Data Visualization**: Interactive maps and charts for ocean data

### Frontend- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

- React 18 + Vite

- Three.js for 3D ocean effects### Modern UI/UX

- Framer Motion for animations- **Glass Morphism**: Beautiful translucent effects with backdrop blur

- React Router for navigation- **Smooth Animations**: Framer Motion powered transitions and interactions

- Leaflet for maps- **Ocean Color Palette**: Carefully crafted color scheme inspired by ocean depths

- i18next for internationalization- **Accessibility**: WCAG compliant design with proper contrast and navigation



### Backend## 🚀 Quick Start

- FastAPI (Python)

- Groq AI (Llama 3.3 70B Versatile)### Prerequisites

- PostgreSQL database- Node.js 16+ 

- ChromaDB for vector storage- npm or yarn

- LangChain for AI orchestration- Modern web browser with WebGL support

- SQLAlchemy for ORM

### Installation

## 📋 Prerequisites

1. **Clone the repository**

- Node.js 16+ and npm   ```bash

- Python 3.11+   git clone <repository-url>

- PostgreSQL database with ARGO float data   cd floatchat-frontend

- Groq API key ([Get one here](https://console.groq.com/))   ```



## 🔧 Installation2. **Install dependencies**

   ```bash

### 1. Clone the Repository   npm install

   ```

\`\`\`bash

git clone https://github.com/AdithyaSM31/FloatChart-AI.git3. **Start development server**

cd FloatChart-AI   ```bash

\`\`\`   npm run dev

   ```

### 2. Backend Setup

4. **Open your browser**

\`\`\`bash   Navigate to `http://localhost:5173`

# Install Python dependencies

pip install -r requirements.txt### Build for Production



# Create .env file from example```bash

cp .env.example .envnpm run build

npm run preview

# Edit .env and add your API keys and database credentials```

# GROQ_API_KEY=your_groq_api_key

# DB_PASSWORD=your_database_password## 🏗️ Project Structure

\`\`\`

```

### 3. Frontend Setupsrc/

├── components/

\`\`\`bash│   ├── Layout/

cd frontend│   │   └── Layout.jsx              # Main layout wrapper

npm install│   ├── Navigation/

\`\`\`│   │   └── Navigation.jsx         # Navigation component

│   ├── Language/

### 4. Database Setup│   │   └── LanguageSwitcher.jsx   # Language selection

│   └── Ocean/

Make sure you have PostgreSQL installed and running with ARGO float data loaded.│       ├── OceanBackground.jsx     # 3D ocean scene

│       └── ParticleSystem.jsx      # Floating particles

## 🚀 Running Locally├── contexts/

│   ├── OceanContext.jsx           # Ocean theme state

### Start Backend Server│   └── LanguageContext.jsx        # Language state

├── pages/

\`\`\`bash│   ├── Home.jsx                   # Landing page

# From the backend directory│   ├── Chat.jsx                   # Chat interface

cd backend│   ├── Dashboard.jsx              # Analytics dashboard

python -m uvicorn api_groq:app --host 127.0.0.1 --port 8000│   └── DataViz.jsx                # Data visualization

\`\`\`├── styles/

│   └── components.css             # Component styles

Backend will be available at \`http://localhost:8000\`├── App.jsx                        # Main app component

├── App.css                        # App-specific styles

### Start Frontend Server├── index.css                      # Global styles

├── i18n.js                        # Internationalization config

\`\`\`bash└── main.jsx                       # App entry point

# From the frontend directory```

cd frontend

npm run dev## 🎨 Design System

\`\`\`

### Color Palette

Frontend will be available at \`http://localhost:5173\`- **Ocean Deep**: `#001428` - Deep ocean blue

- **Ocean Surface**: `#0066aa` - Surface water blue  

## 🌐 Deployment- **Ocean Mist**: `#00aaff` - Light ocean blue

- **Ocean Crystal**: `#66ccff` - Crystal clear blue

### Vercel (Frontend)- **Coral**: `#ff6b6b` - Coral accent

- **Seafoam**: `#4ecdc4` - Seafoam green

The frontend is configured for Vercel deployment:- **Golden**: `#ffd93d` - Golden accent



1. Push your code to GitHub### Typography

2. Connect your repository to Vercel- **Primary Font**: Inter (clean, modern)

3. Vercel will auto-detect the Vite configuration- **Display Font**: Playfair Display (elegant headings)

4. Deploy!

### Components

**Note**: You'll need to deploy the backend separately (see below) and update the API URL in the frontend.- **Buttons**: Multiple variants (primary, secondary, ghost)

- **Cards**: Glass morphism with hover effects

### Backend Deployment Options- **Inputs**: Ocean-themed form elements

- **Navigation**: Responsive sidebar with smooth transitions

- **Railway**: Best for FastAPI + PostgreSQL

- **Render**: Free tier available## 🌐 Internationalization

- **AWS/GCP/Azure**: Production-grade hosting

- **Heroku**: Easy deployment with buildpacksThe app supports 12 languages with full RTL support:



## 📁 Project Structure- English (en)

- Hindi (hi) - हिन्दी

\`\`\`- Bengali (bn) - বাংলা

FloatChart-AI/- Telugu (te) - తెలుగు

├── backend/- Marathi (mr) - मराठी

│   ├── api_groq.py          # Main FastAPI app with Groq AI- Tamil (ta) - தமிழ்

│   ├── api.py               # Alternative with Google Gemini- Urdu (ur) - اردو (RTL)

│   ├── models.py            # Database models- Gujarati (gu) - ગુજરાતી

│   ├── load_to_sql.py       # Data loading scripts- Kannada (kn) - ಕನ್ನಡ

│   └── populate_vectordb.py # Vector DB setup- Odia (or) - ଓଡ଼ିଆ

├── frontend/- Malayalam (ml) - മലയാളം

│   ├── src/- Punjabi (pa) - ਪੰਜਾਬੀ

│   │   ├── components/      # React components

│   │   ├── pages/           # Page components### Adding New Languages

│   │   ├── contexts/        # React contexts

│   │   ├── hooks/           # Custom hooks1. Add language configuration to `src/i18n.js`

│   │   └── utils/           # Utility functions2. Create translation object with all required keys

│   ├── public/              # Static assets3. Update language list in `LanguageContext.jsx`

│   └── package.json

├── .env.example             # Environment template## 🎮 Interactive Features

├── requirements.txt         # Python dependencies

└── README.md### Ocean Controls

\`\`\`- **Depth Adjustment**: Real-time depth visualization

- **Wave Intensity**: Control ocean wave animation speed

## 🔑 Environment Variables- **Particle System**: Toggle floating particle effects

- **Underwater Mode**: Switch between surface and underwater views

Create a \`.env\` file in the root directory:

### Chat Interface

\`\`\`env- **Natural Language Queries**: Ask questions about ocean data

GROQ_API_KEY=your_groq_api_key_here- **Real-time Responses**: AI-powered data analysis

DB_PASSWORD=your_database_password- **Data Export**: Download query results as JSON

DB_USER=postgres- **SQL Query Display**: View generated SQL queries

DB_HOST=localhost- **Example Queries**: Pre-built query suggestions

DB_PORT=5432

DB_NAME=argo_db### Dashboard Analytics

\`\`\`- **Key Metrics**: Temperature, salinity, depth, pressure, oxygen, pH

- **Trend Indicators**: Visual trend arrows and change indicators

## 🎮 Usage- **Ocean Coverage**: Data coverage by ocean region

- **System Status**: Float counts and measurement statistics

1. **Navigate to Chat**: Click on the chat interface- **Recent Queries**: History of recent data queries

2. **Ask Questions**: Type natural language questions like:

   - "What is the deepest ocean measurement?"## 📱 Responsive Design

   - "Show me temperature data from the Pacific"

   - "Which floats are near the equator?"The frontend is fully responsive with breakpoints:

3. **View Results**: Get AI-generated summaries, SQL queries, and data visualizations

4. **Explore Data**: Use the dashboard and data visualization pages- **Desktop**: 1024px+ (full sidebar navigation)

- **Tablet**: 768px - 1023px (collapsible navigation)

## 🌟 Key Features- **Mobile**: < 768px (mobile-first design)



### AI Chat Interface### Mobile Features

- Natural language to SQL conversion- Touch-optimized interactions

- Context-aware responses using RAG- Swipe gestures for navigation

- Multi-part question decomposition- Optimized layouts for small screens

- Smart data limiting (prevents browser freeze)- Reduced animation complexity for performance



### Data Safety## 🔧 Configuration

- Only 100 records sent to browser (prevents crashes)

- Full database counts displayed### Environment Variables

- Timeout protection (60 seconds)Create a `.env` file in the root directory:

- Graceful error handling with fallback to demo mode

```env

### PerformanceVITE_API_URL=http://localhost:8000

- Groq LPU inference: ~1000 tokens/secondVITE_APP_NAME=FloatChat

- Vector search for relevant contextVITE_DEFAULT_LANGUAGE=en

- Optimized data transfer```

- Client-side caching

### Customization

## 📊 Supported Languages- **Colors**: Modify CSS custom properties in `src/index.css`

- **Animations**: Adjust Framer Motion configurations

- English (en)- **3D Scene**: Customize Three.js parameters in `OceanBackground.jsx`

- Hindi (hi) - हिन्दी- **Languages**: Add/remove languages in `src/i18n.js`

- Bengali (bn) - বাংলা

- Telugu (te) - తెలుగు## 🚀 Performance

- Marathi (mr) - मराठी

- Tamil (ta) - தமிழ்### Optimization Features

- Urdu (ur) - اردو- **Code Splitting**: Automatic route-based code splitting

- Gujarati (gu) - ગુજરાતી- **Lazy Loading**: Components loaded on demand

- Kannada (kn) - ಕನ್ನಡ- **Image Optimization**: Optimized asset loading

- Odia (or) - ଓଡ଼ିଆ- **Bundle Analysis**: Built-in bundle size analysis

- Malayalam (ml) - മലയാളം

- Punjabi (pa) - ਪੰਜਾਬੀ### Performance Tips

- Use `React.memo()` for expensive components

## 🤝 Contributing- Implement virtual scrolling for large lists

- Optimize Three.js scene complexity

Contributions are welcome! Please feel free to submit a Pull Request.- Use CSS transforms for animations



## 📝 License## 🧪 Testing



This project is licensed under the MIT License.```bash

# Run tests

## 👨‍💻 Authornpm test



**Adithya SM**# Run tests in watch mode

- GitHub: [@AdithyaSM31](https://github.com/AdithyaSM31)npm test:watch



## 🙏 Acknowledgments# Generate coverage report

npm test:coverage

- ARGO Float Data Program```

- Groq for ultra-fast AI inference

- LangChain for AI orchestration## 📦 Deployment

- The open-source community

### Vercel (Recommended)

## 📞 Support```bash

npm install -g vercel

For issues and questions, create an issue on GitHub.vercel --prod

```

---

### Netlify

Made with ❤️ for ocean data exploration```bash

npm run build
# Upload dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow React best practices
- Use TypeScript for type safety
- Write tests for new components
- Maintain responsive design
- Follow the ocean theme consistently

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js** for 3D graphics capabilities
- **Framer Motion** for smooth animations
- **React Three Fiber** for React integration
- **Lucide React** for beautiful icons
- **i18next** for internationalization

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation wiki

---

**FloatChat Frontend** - Dive deep into ocean data intelligence 🌊
