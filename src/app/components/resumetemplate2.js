import React, { useState } from 'react';

const ClassicResume = ({ data }) => {
  const { personalInfo, education, experience, skills, certifications, projects, summary } = data;
  const [primaryColor, setPrimaryColor] = useState("#14532d");

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

      <div id="resume-content" className="max-w-4xl mx-auto bg-white shadow-lg p-8">
        <div className="border-b-4" style={{ borderColor: primaryColor }}>
          <h1 className="text-4xl font-serif mb-2">{personalInfo?.name}</h1>
          <div className="flex gap-4 text-sm mb-4">
            <span>{personalInfo?.email}</span>
            <span>{personalInfo?.phone}</span>
            <span>{personalInfo?.address}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-8">
          <div className="col-span-1 space-y-8">
            <section>
              <h2 className="font-serif text-lg mb-4" style={{ color: primaryColor }}>
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
              <h2 className="font-serif text-lg mb-4" style={{ color: primaryColor }}>
                Skills
              </h2>
              <div className="space-y-2">
                {skills?.map((skill, index) => (
                  <div key={index} className="text-sm py-1">{skill}</div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-serif text-lg mb-4" style={{ color: primaryColor }}>
                Certifications
              </h2>
              {certifications?.map((cert, index) => (
                <div key={index} className="text-sm mb-2">{cert}</div>
              ))}
            </section>
          </div>

          <div className="col-span-2 space-y-8">
            <section>
              <h2 className="font-serif text-lg mb-4" style={{ color: primaryColor }}>
                Professional Summary
              </h2>
              <p className="text-sm leading-relaxed">{summary}</p>
            </section>

            <section>
              <h2 className="font-serif text-lg mb-4" style={{ color: primaryColor }}>
                Experience
              </h2>
              {experience?.map((exp, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{exp?.title}</h3>
                    <span className="text-sm text-gray-500">{exp?.years}</span>
                  </div>
                  <p className="text-sm font-medium mb-2">{exp?.company}</p>
                  <ul className="text-sm space-y-1 text-gray-600 list-disc pl-4">
                    {exp?.summary}
                  </ul>
                </div>
              ))}
            </section>

            <section>
              <h2 className="font-serif text-lg mb-4" style={{ color: primaryColor }}>
                Projects
              </h2>
              {projects?.map((project, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{project?.title}</h3>
                    <span className="text-sm text-gray-500">{project?.duration}</span>
                  </div>
                  <p className="text-sm mb-2">{project?.technologies}</p>
                  <ul className="text-sm space-y-1 text-gray-600 list-disc pl-4">
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

export default ClassicResume;