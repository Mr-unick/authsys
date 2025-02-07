import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const ResumeTemplate = ({ data }) => {
  const { personalInfo, education, experience, skills, certifications } = data;

  // State to manage selected colors
  const [headerColor, setHeaderColor] = useState('#4C51BF'); // Default header color
  const [sectionTitleColor, setSectionTitleColor] = useState('#1F2937'); // Default section title color
  const [textColor, setTextColor] = useState('#2D3748'); // Default text color

  const handleDownloadPDF = () => {
    const resumeContent = document.getElementById('resume-content');
    
    html2canvas(resumeContent, { 
      scale: 2,
      backgroundColor: '#ffffff'
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const scaleFactor = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * scaleFactor, imgHeight * scaleFactor);
      pdf.save('generated_resume.pdf');
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Color Customization Section */}
      <div className="max-w-4xl mx-auto mb-6 px-4">
        <div className="flex gap-4 mb-4">
          <div>
            <label htmlFor="header-color" className="block font-semibold text-gray-600">Header Color:</label>
            <input 
              type="color" 
              id="header-color" 
              value={headerColor}
              onChange={(e) => setHeaderColor(e.target.value)}
              className="w-10 h-10 border-0 rounded-full cursor-pointer"
            />
          </div>
          <div>
            <label htmlFor="section-title-color" className="block font-semibold text-gray-600">Section Title Color:</label>
            <input 
              type="color" 
              id="section-title-color" 
              value={sectionTitleColor}
              onChange={(e) => setSectionTitleColor(e.target.value)}
              className="w-10 h-10 border-0 rounded-full cursor-pointer"
            />
          </div>
          <div>
            <label htmlFor="text-color" className="block font-semibold text-gray-600">Text Color:</label>
            <input 
              type="color" 
              id="text-color" 
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-10 h-10 border-0 rounded-full cursor-pointer"
            />
          </div>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </button>
      </div>

      {/* Resume Content */}
      <div 
        id="resume-content" 
        className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8"
        style={{ color: textColor }}
      >
        {/* Header */}
        <header className="border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ color: headerColor }}>
            {personalInfo.name}
          </h1>
          <div className="flex flex-wrap gap-4 text-gray-600">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {personalInfo.email}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {personalInfo.phone}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {personalInfo.address}
            </span>
          </div>
        </header>

        {/* Experience Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ color: sectionTitleColor }}>
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Experience
          </h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <h3 className="text-xl font-semibold text-gray-900">{exp.designation}</h3>
              <p className="text-indigo-600 font-medium">{exp.company}</p>
              <p className="text-gray-600 text-sm">{exp.fromYear} - {exp.toYear}</p>
            </div>
          ))}
        </section>

        {/* Education Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ color: sectionTitleColor }}>
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            Education
          </h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-4 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <h3 className="text-xl font-semibold text-gray-900">{edu.collegeName}</h3>
              <p className="text-gray-600 text-sm">{edu.fromYear} - {edu.toYear}</p>
              <p className="text-indigo-600 font-medium">Percentage: {edu.percentage}%</p>
            </div>
          ))}
        </section>

        {/* Skills Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ color: sectionTitleColor }}>
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Certifications Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ color: sectionTitleColor }}>
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Certifications
          </h2>
          <div className="space-y-2">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-shadow duration-200">
                <p className="text-gray-700">{cert}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResumeTemplate;
