const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Resume data
const resumeData = {
  personalInfo: {
    name: "Ravi Teja Bagadi",
    title: "Full Stack .NET Developer",
    email: "braviteja2102@gmail.com",
    phone: "+91 9849491569",
    location: "Hyderabad, India",
    linkedin: "linkedin.com/in/bagadi-ravi-teja-00843b18b"
  },
  summary: "Dedicated Full Stack .NET Developer with 4+ years of experience building scalable web and mobile applications. Strong expertise in ASP.NET Core, RESTful APIs, database optimization, and modern frontend technologies.",
  technicalSkills: {
    backend: ["C#", ".NET Core", "ASP.NET MVC", "Web API"],
    frontend: ["React", "JavaScript", "HTML5", "CSS3"],
    mobile: ["Xamarin", "MAUI"],
    databases: ["SQL Server", "MySQL", "SQLite", "Stored Procedures"],
    cloudDevOps: ["Azure", "CI/CD", "Git", "Azure DevOps"],
    integration: ["REST APIs", "Salesforce API", "Third-party Integration", "ESB"]
  },
  experience: [
    {
      title: "Software Engineer II",
      company: "Clean Harbors India LLP",
      location: "Hyderabad, India",
      period: "Sep 2021 - Present",
      responsibilities: [
        "Developed comprehensive RESTful APIs and integrated third-party services to enhance application capabilities and system interoperability.",
        "Built scalable web & mobile applications using Xamarin, ASP.NET Core, MVC with ADO.NET for optimal performance.",
        "Developed Windows Service that replaced legacy ProSync jobs for mobile database creation, optimizing SQLite performance by 80%.",
        "Performed extensive unit testing, comprehensive documentation, and participated in Agile sprints with deployment management.",
        "Developed Salesforce integration services and enhanced MVC UI with WCF application enhancements for improved user experience."
      ]
    }
  ],
  projects: [
    {
      name: "3M Waste Management System",
      description: "Comprehensive waste tracking with ASP.NET Core and mobile scanning capabilities.",
      details: ["Barcode scanning, real-time inventory management, and disposal workflow automation."],
      tech: ["ASP.NET Core", "C#", "Web API", "SQL Server", "ESB"]
    },
    {
      name: "Amazon Waste Tracking",
      description: "Waste tracking application provided to Amazon facilities which tracks, disposes waste from Amazon facilities to Clean Harbors disposal sites.",
      details: ["Barcode scanning, real-time inventory management, and disposal workflow automation."],
      tech: ["ASP.NET Core", "C#", "Web API", "SQL Server"]
    },
    {
      name: "Enterprise System Migration",
      description: "Led migration from PeopleSoft to modern database architecture.",
      details: ["Integration services connecting enterprise systems and third-party APIs."],
      tech: ["OIC API", ".NET Core", "REST APIs", "SQL Server"]
    },
    {
      name: "Mobile Workforce Application",
      description: "Cross-platform mobile app using Xamarin with MVVM architecture.",
      details: ["Offline data sync, document management, and dynamic UI rendering."],
      tech: ["Xamarin", "MAUI", "C#", "SQLite", "RESTful APIs", "MVVM"]
    }
  ],
  education: [
    {
      degree: "Master of Business Administration (MBA)",
      field: "Human Resources Management",
      institution: "Andhra University"
    },
    {
      degree: "B.Tech",
      field: "Electrical and Electronics Engineering",
      institution: "Andhra University College of Engineering"
    }
  ],
  certifications: [
    "Full Stack Development – Nxtwave Enterprise Technologies",
    "Cloud Computing – Simplilearn",
    "MAUI Development – Coursera",
    "Microsoft Azure Fundamentals – Microsoft"
  ],
  achievements: [
    "Received employee of the month May 2025",
    "Nominated for Inspiring Employee of the Year award",
    "Received appreciation from business stakeholders for project delivery",
    "Migrated legacy systems improving performance by 40%"
  ],
  languages: [
    { language: "English", level: "Professional" },
    { language: "Telugu", level: "Native" },
    { language: "Hindi", level: "Working" }
  ]
};

// Routes
app.get('/api/resume', (req, res) => {
  res.json(resumeData);
});

app.post('/api/generate-pdf', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Generate HTML content for PDF
    const htmlContent = generateResumeHTML(resumeData);
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    await browser.close();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=RaviTeja_Resume.pdf');
    res.send(pdf);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

function generateResumeHTML(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${data.personalInfo.name} - Resume</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background: white; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header h2 { font-size: 1.3em; opacity: 0.9; }
        .contact-info { display: flex; justify-content: center; gap: 20px; margin-top: 20px; flex-wrap: wrap; }
        .contact-item { font-size: 0.9em; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 1.4em; color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 5px; margin-bottom: 15px; }
        .summary { font-size: 1.1em; line-height: 1.7; color: #555; }
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .skill-category h4 { color: #764ba2; margin-bottom: 8px; }
        .skill-list { display: flex; flex-wrap: wrap; gap: 5px; }
        .skill-tag { background: #f0f4ff; color: #667eea; padding: 4px 8px; border-radius: 15px; font-size: 0.85em; }
        .experience-item, .project-item { margin-bottom: 20px; }
        .job-title { font-weight: bold; color: #333; }
        .company { color: #667eea; font-weight: 600; }
        .period { color: #888; font-style: italic; }
        .responsibilities { margin-top: 10px; }
        .responsibilities li { margin-bottom: 5px; }
        .project-name { font-weight: bold; color: #764ba2; }
        .tech-stack { margin-top: 5px; }
        .tech-item { background: #e8f2ff; color: #2c5aa0; padding: 2px 6px; border-radius: 10px; font-size: 0.8em; margin-right: 5px; }
        .education-item { margin-bottom: 15px; }
        .degree { font-weight: bold; }
        .institution { color: #667eea; }
        .certifications ul, .achievements ul { list-style-type: none; }
        .certifications li, .achievements li { background: #f8f9ff; padding: 8px; margin-bottom: 5px; border-radius: 5px; border-left: 3px solid #667eea; }
        .languages { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
        .language-item { text-align: center; background: #f0f4ff; padding: 10px; border-radius: 8px; }
        .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        @media print { body { font-size: 12px; } .container { padding: 0; } }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${data.personalInfo.name}</h1>
          <h2>${data.personalInfo.title}</h2>
          <div class="contact-info">
            <div class="contact-item">${data.personalInfo.email}</div>
            <div class="contact-item">${data.personalInfo.phone}</div>
            <div class="contact-item">${data.personalInfo.location}</div>
            <div class="contact-item">${data.personalInfo.linkedin}</div>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">PROFESSIONAL SUMMARY</h3>
          <p class="summary">${data.summary}</p>
        </div>

        <div class="section">
          <h3 class="section-title">TECHNICAL SKILLS</h3>
          <div class="skills-grid">
            <div class="skill-category">
              <h4>Backend</h4>
              <div class="skill-list">
                ${data.technicalSkills.backend.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
            </div>
            <div class="skill-category">
              <h4>Frontend</h4>
              <div class="skill-list">
                ${data.technicalSkills.frontend.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
            </div>
            <div class="skill-category">
              <h4>Mobile</h4>
              <div class="skill-list">
                ${data.technicalSkills.mobile.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
            </div>
            <div class="skill-category">
              <h4>Databases</h4>
              <div class="skill-list">
                ${data.technicalSkills.databases.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
            </div>
            <div class="skill-category">
              <h4>Cloud & DevOps</h4>
              <div class="skill-list">
                ${data.technicalSkills.cloudDevOps.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
            </div>
            <div class="skill-category">
              <h4>Integration</h4>
              <div class="skill-list">
                ${data.technicalSkills.integration.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">PROFESSIONAL EXPERIENCE</h3>
          ${data.experience.map(exp => `
            <div class="experience-item">
              <div class="job-title">${exp.title}</div>
              <div class="company">${exp.company}, ${exp.location}</div>
              <div class="period">${exp.period}</div>
              <ul class="responsibilities">
                ${exp.responsibilities.map(resp => `<li>• ${resp}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h3 class="section-title">KEY PROJECTS</h3>
          ${data.projects.map(project => `
            <div class="project-item">
              <div class="project-name">${project.name}</div>
              <p>${project.description}</p>
              ${project.details.map(detail => `<p>• ${detail}</p>`).join('')}
              <div class="tech-stack">
                <strong>Tech Stack:</strong> ${project.tech.map(tech => `<span class="tech-item">${tech}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="two-column">
          <div>
            <div class="section">
              <h3 class="section-title">EDUCATION</h3>
              ${data.education.map(edu => `
                <div class="education-item">
                  <div class="degree">${edu.degree}</div>
                  <div>${edu.field}</div>
                  <div class="institution">${edu.institution}</div>
                </div>
              `).join('')}
            </div>

            <div class="section certifications">
              <h3 class="section-title">CERTIFICATIONS</h3>
              <ul>
                ${data.certifications.map(cert => `<li>${cert}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div>
            <div class="section achievements">
              <h3 class="section-title">KEY ACHIEVEMENTS</h3>
              <ul>
                ${data.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
              </ul>
            </div>

            <div class="section">
              <h3 class="section-title">LANGUAGES</h3>
              <div class="languages">
                ${data.languages.map(lang => `
                  <div class="language-item">
                    <strong>${lang.language}</strong><br>
                    <small>${lang.level}</small>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});