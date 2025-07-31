import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, Phone, MapPin, Linkedin, Award, Code, Briefcase, GraduationCap, Globe } from 'lucide-react';
import axios from 'axios';
import './index.css';

function App() {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    try {
      const response = await axios.get('/api/resume');
      setResumeData(response.data);
    } catch (error) {
      console.error('Error fetching resume data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    setDownloadingPdf(true);
    try {
      const response = await axios.post('/api/generate-pdf', {}, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'RaviTeja_Resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error loading resume data</h2>
          <button 
            onClick={fetchResumeData}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { personalInfo, summary, technicalSkills, experience, projects, education, certifications, achievements, languages } = resumeData;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Download Button - Fixed Position */}
        <motion.div 
          className="fixed top-8 right-8 z-50 no-print"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={downloadPDF}
            disabled={downloadingPdf}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            {downloadingPdf ? 'Generating...' : 'Download PDF'}
          </button>
        </motion.div>

        {/* Header Section */}
        <motion.div 
          className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white rounded-2xl p-8 mb-8 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">{personalInfo.name}</h1>
            <h2 className="text-xl md:text-2xl opacity-90 mb-6">{personalInfo.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{personalInfo.email}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{personalInfo.phone}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{personalInfo.location}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Linkedin className="w-4 h-4" />
                <span className="truncate">{personalInfo.linkedin}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Professional Summary */}
        <motion.section 
          className="bg-white rounded-xl p-6 mb-8 shadow-lg"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary-500" />
            Professional Summary
          </h3>
          <p className="text-gray-700 leading-relaxed text-lg">{summary}</p>
        </motion.section>

        {/* Technical Skills */}
        <motion.section 
          className="bg-white rounded-xl p-6 mb-8 shadow-lg"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Code className="w-6 h-6 text-primary-500" />
            Technical Skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(technicalSkills).map(([category, skills], index) => (
              <motion.div 
                key={category}
                className="bg-gradient-to-br from-primary-50 to-secondary-50 p-4 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <h4 className="font-semibold text-primary-700 mb-3 capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex}
                      className="px-3 py-1 bg-white text-primary-600 rounded-full text-sm font-medium shadow-sm border border-primary-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Professional Experience */}
        <motion.section 
          className="bg-white rounded-xl p-6 mb-8 shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary-500" />
            Professional Experience
          </h3>
          {experience.map((exp, index) => (
            <motion.div 
              key={index}
              className="border-l-4 border-primary-500 pl-6 pb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <h4 className="text-xl font-bold text-gray-800">{exp.title}</h4>
              <p className="text-primary-600 font-semibold">{exp.company}, {exp.location}</p>
              <p className="text-gray-500 italic mb-4">{exp.period}</p>
              <ul className="space-y-2">
                {exp.responsibilities.map((resp, respIndex) => (
                  <li key={respIndex} className="text-gray-700 leading-relaxed">
                    • {resp}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.section>

        {/* Key Projects */}
        <motion.section 
          className="bg-white rounded-xl p-6 mb-8 shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Code className="w-6 h-6 text-primary-500" />
            Key Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div 
                key={index}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <h4 className="text-lg font-bold text-primary-700 mb-2">{project.name}</h4>
                <p className="text-gray-700 mb-3">{project.description}</p>
                {project.details.map((detail, detailIndex) => (
                  <p key={detailIndex} className="text-gray-600 text-sm mb-2">• {detail}</p>
                ))}
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Tech Stack:</p>
                  <div className="flex flex-wrap gap-1">
                    {project.tech.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-2 py-1 bg-secondary-100 text-secondary-500 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Two Column Layout for Education, Certifications, etc. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Education */}
          <motion.section 
            className="bg-white rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary-500" />
              Education
            </h3>
            {education.map((edu, index) => (
              <div key={index} className="mb-4 pb-4 border-b border-gray-100 last:border-b-0">
                <h4 className="font-bold text-gray-800">{edu.degree}</h4>
                <p className="text-gray-600">{edu.field}</p>
                <p className="text-primary-600 font-medium">{edu.institution}</p>
              </div>
            ))}
          </motion.section>

          {/* Languages */}
          <motion.section 
            className="bg-white rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary-500" />
              Languages
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {languages.map((lang, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
                  <span className="font-semibold text-gray-800">{lang.language}</span>
                  <span className="text-primary-600 text-sm">{lang.level}</span>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Certifications */}
        <motion.section 
          className="bg-white rounded-xl p-6 mt-8 shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-primary-500" />
            Certifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <motion.div 
                key={index}
                className="flex items-start gap-3 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border-l-4 border-primary-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Award className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{cert}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Key Achievements */}
        <motion.section 
          className="bg-white rounded-xl p-6 mt-8 mb-8 shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-primary-500" />
            Key Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div 
                key={index}
                className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-yellow-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Award className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{achievement}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer 
          className="text-center py-8 text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p>&copy; 2024 {personalInfo.name}. All rights reserved.</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;