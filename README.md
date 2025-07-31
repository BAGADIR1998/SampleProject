# Modern Full Stack Resume - Ravi Teja Bagadi

A modern, responsive full-stack resume application built with React.js and Node.js featuring PDF download functionality.

## 🚀 Features

- **Modern UI Design**: Clean, professional design with smooth animations
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **PDF Download**: Generate and download professional PDF resume
- **Real-time Data**: Dynamic content loading from backend API
- **Performance Optimized**: Fast loading with optimized assets
- **SEO Friendly**: Proper meta tags and structured data

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Puppeteer** - PDF generation
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Git**

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd resume-fullstack
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (root, server, and client)
npm run install-all
```

### 3. Environment Setup
```bash
# Copy environment file
cp server/.env.example server/.env

# Edit environment variables if needed
nano server/.env
```

### 4. Start the Application

#### Development Mode (Recommended)
```bash
# Start both frontend and backend concurrently
npm run dev
```

#### Production Mode
```bash
# Build the frontend
npm run build

# Start the application
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📱 Usage

### Viewing the Resume
1. Open your browser and navigate to `http://localhost:3000`
2. The resume will load automatically with all the information
3. Scroll through different sections to view the complete profile

### Downloading PDF
1. Click the "Download PDF" button in the top-right corner
2. The system will generate a professionally formatted PDF
3. The PDF will automatically download to your default download folder

## 🎨 Customization

### Updating Resume Data
To update the resume information, edit the `resumeData` object in `server/server.js`:

```javascript
const resumeData = {
  personalInfo: {
    name: "Your Name",
    title: "Your Title",
    email: "your.email@example.com",
    // ... other fields
  },
  // ... other sections
};
```

### Styling Customization
- **Colors**: Update the color scheme in `client/tailwind.config.js`
- **Fonts**: Modify font imports in `client/src/index.css`
- **Layout**: Adjust component layouts in `client/src/App.js`

## 📂 Project Structure

```
resume-fullstack/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/               # Source code
│   │   ├── App.js         # Main React component
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind configuration
├── server/                 # Node.js backend
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Environment template
├── package.json           # Root package file
└── README.md             # Project documentation
```

## 🚀 Deployment

### Heroku Deployment
1. Create a new Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git:
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Vercel Deployment (Frontend Only)
1. Build the React app: `cd client && npm run build`
2. Deploy the `build` folder to Vercel
3. For full-stack, deploy the API separately

### Traditional Hosting
1. Build the frontend: `npm run build`
2. Copy the `client/build` folder to your web server
3. Set up the Node.js backend on your server
4. Configure reverse proxy (nginx/Apache) if needed

## 🔧 API Endpoints

- `GET /api/resume` - Fetch resume data
- `POST /api/generate-pdf` - Generate and download PDF

## 🎯 Performance Features

- **Code Splitting**: Automatic code splitting with React
- **Image Optimization**: Optimized images and icons
- **Caching**: Browser caching for static assets
- **Compression**: Gzip compression for faster loading
- **Security**: Helmet.js for security headers

## 🐛 Troubleshooting

### Common Issues

1. **PDF Generation Fails**
   - Ensure Puppeteer dependencies are installed
   - Check if running in a Docker container (may need additional setup)

2. **Styling Issues**
   - Clear browser cache
   - Ensure Tailwind CSS is properly configured

3. **API Connection Issues**
   - Check if backend server is running on port 5000
   - Verify proxy configuration in `client/package.json`

### Development Tips
- Use browser developer tools for debugging
- Check console for error messages
- Ensure all dependencies are properly installed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

**Ravi Teja Bagadi**
- Email: braviteja2102@gmail.com
- Phone: +91 9849491569
- LinkedIn: [linkedin.com/in/bagadi-ravi-teja-00843b18b](https://linkedin.com/in/bagadi-ravi-teja-00843b18b)

---

⭐ Don't forget to star this repo if you found it helpful!
