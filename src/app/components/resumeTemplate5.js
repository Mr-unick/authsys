import React, { useState } from 'react';

const CreativeResume = ({ data }) => {
  const { personalInfo, education, experience, skills, certifications, projects, summary } = data;
  const [primaryColor, setPrimaryColor] = useState("#0369a1");

  const handleDownloadPDF = () => {
    // PDF download logic would go here
    console?.log("Download PDF");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 mb-8 w-full">
      <div className="max-w-4xl mx-auto mb-6 px-4 flex flex-row justify-between">
        <div className="mb-4">
          <label className="text-sm text-gray-600">Theme Color:</label>
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e?.target?.value)}
            className="block mt-1"
          />
        </div>
        <button
          onClick={handleDownloadPDF}
          className="bg-gray-800 text-white px-4 py-2 rounded text-sm h-8"
        >
          Download PDF
        </button>
      </div>

      <div id="resume-content" className="max-w-4xl mx-auto bg-white shadow-lg">
        <div 
          className="h-32 relative" 
          style={{ backgroundColor: primaryColor }}
        >
          <div className="absolute -bottom-16 left-8 right-8 bg-white p-8 shadow-lg rounded">
            <h1 className="text-3xl font-bold mb-2">{personalInfo?.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>{personalInfo?.email}</span>
              <span>{personalInfo?.phone}</span>
              <span>{personalInfo?.address}</span>
            </div>
          </div>
        </div>

        <div className="mt-20 p-8">
          <section className="max-w-2xl mx-auto mb-12 text-center">
            <p className="text-gray-600 leading-relaxed">{summary}</p>
          </section>

          <div className="grid grid-cols-3 gap-8 mb-12">
            {skills?.map((skill, index) => (
              <div 
                key={index}
                className="p-4 rounded text-center"
                style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}
              >
                {skill}
              </div>
            ))}
          </div>

          <div className="relative">
            <div 
              className="absolute left-1/2 top-0 bottom-0 w-0?.5" 
              style={{ backgroundColor: `${primaryColor}40` }}
            />
            
            {experience?.map((exp, index) => (
              <div key={index} className={`relative mb-12 ${index % 2 === 0 ? 'pr-1/2' : 'pl-1/2 ml-auto'}`}>
                <div 
                  className="absolute w-4 h-4 rounded-full top-0"
                  style={{ 
                    backgroundColor: primaryColor,
                    [index % 2 === 0 ? 'right' : 'left']: '-8px'
                  }}
                />
                <div className="bg-white p-6 rounded shadow-sm">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold" style={{ color: primaryColor }}>{exp?.title}</h3>
                    <span className="text-sm text-gray-500">{exp?.years}</span>
                  </div>
                  <p className="text-sm font-medium mb-2">{exp?.company}</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    {exp?.summary}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-8 mt-12">
            <section>
              <h2 className="text-xl font-bold mb-6" style={{ color: primaryColor }}>
                Education
              </h2>
              {education?.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-medium">{edu?.college}</h3>
                  <p className="text-sm text-gray-600">{edu?.grade}</p>
                  <p className="text-sm text-gray-500">{edu?.years}</p>
                </div>
              ))}
            </section>

            <section>
              <h2 className="text-xl font-bold mb-6" style={{ color: primaryColor }}>
                Projects
              </h2>
              {projects?.map((project, index) => (
                <div key={index} className="mb-6">
                  <h3 className="font-medium">{project?.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{project?.duration}</p>
                  <p className="text-sm mb-2">{project?.technologies}</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    {project?.summary}
                  </ul>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeResume;