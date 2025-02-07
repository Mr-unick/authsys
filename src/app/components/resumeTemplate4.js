import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const ModernResume = ({ data }) => {
  const { personalInfo, education, experience, skills, certifications, projects, summary } = data;
  const [primaryColor, setPrimaryColor] = useState('#1a5f7a');
  
  const handleDownloadPDF = () => {
    const resumeContent = document?.getElementById('resume-content');
    html2canvas(resumeContent, { scale: 2, backgroundColor: '#ffffff' })
      ?.then((canvas) => {
        const imgData = canvas?.toDataURL('image/png');
        const pdf = new jsPDF();
        const pdfWidth = pdf?.internal?.pageSize?.getWidth();
        const pdfHeight = pdf?.internal?.pageSize?.getHeight();
        const ratio = Math?.min(pdfWidth / canvas?.width, pdfHeight / canvas?.height);
        pdf?.addImage(imgData, 'PNG', 0, 0, canvas?.width * ratio, canvas?.height * ratio);
        pdf?.save('modern_resume?.pdf');
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto mb-6 px-4">
        <div className="mb-4">
          <label className="text-sm text-gray-600">Theme Color:</label>
          <input 
            type="color" 
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e?.target?.value)}
            className="block mt-1"
          />
        </div>
        <button onClick={handleDownloadPDF} className="px-4 py-2 rounded text-sm text-white" style={{ backgroundColor: primaryColor }}>
          Download PDF
        </button>
      </div>

      <div id="resume-content" className="max-w-5xl mx-auto bg-white shadow-lg">
        <div className="grid grid-cols-[2fr_5fr]">
          {/* Sidebar */}
          <div className="p-8" style={{ backgroundColor: primaryColor }}>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">{personalInfo?.name}</h1>
              <div className="text-sm space-y-2 text-white/90">
                <p>{personalInfo?.email}</p>
                <p>{personalInfo?.phone}</p>
                <p>{personalInfo?.address}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills?.map((skill, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-1 rounded bg-white/10 text-white"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* <div>
              <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Certifications</h2>
              <div className="text-sm space-y-2 text-white/90">
                {certifications?.map((cert, index) => (
                  <p key={index}>{cert}</p>
                ))}
              </div>
            </div> */}
          </div>

          {/* Main Content */}
          <div className="p-8">
            <section className="mb-8">
              <h2 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: primaryColor }}>
                Professional Summary
              </h2>
              <p className="text-sm leading-relaxed text-gray-600">{summary}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-sm font-bold mb-6 uppercase tracking-wider" style={{ color: primaryColor }}>
                Professional Experience
              </h2>
              {experience?.map((exp, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800">{exp?.title}</h3>
                      <p className="text-sm" style={{ color: primaryColor }}>{exp?.company}</p>
                    </div>
                    <span className="text-sm text-gray-500">{exp?.years}</span>
                  </div>
                  <ul className="text-sm space-y-1 text-gray-600 mt-2">
                    {exp?.summary}
                  </ul>
                </div>
              ))}
            </section>

            <section className="mb-8">
              <h2 className="text-sm font-bold mb-6 uppercase tracking-wider" style={{ color: primaryColor }}>
                Key Projects
              </h2>
              {projects?.map((project, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-bold text-gray-800">{project?.title}</h3>
                  
                  </div>
                  <p className="text-sm mb-2" style={{ color: primaryColor }}>{project?.technologies}</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    {project?.summary}
                  </ul>
                </div>
              ))}
            </section>

            <section>
              <h2 className="text-sm font-bold mb-6 uppercase tracking-wider" style={{ color: primaryColor }}>
                Education
              </h2>
              {education?.map((edu, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-800">{edu?.college}</h3>
                    <span className="text-sm text-gray-500">{edu?.years}</span>
                  </div>
              
                  <p className="text-sm text-gray-500">Score: {edu?.grade}%</p>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernResume;