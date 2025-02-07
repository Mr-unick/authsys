import React, { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const MinimalResume = ({ data }) => {
  const {
    personalInfo,
    education,
    experience,
    skills,
    certifications,
    projects,
    summary,
  } = data;
  const [primaryColor, setPrimaryColor] = useState("#334155");

  const handleDownloadPDF = () => {
    const resumeContent = document.getElementById("resume-content");
    html2canvas(resumeContent, { scale: 2, backgroundColor: "#ffffff" }).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(
          pdfWidth / canvas.width,
          pdfHeight / canvas.height
        );
        pdf.addImage(
          imgData,
          "PNG",
          0,
          0,
          canvas.width * ratio,
          canvas.height * ratio
        );
        pdf.save("minimal_resume.pdf");
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 mb-8 w-full">
      <div className="max-w-4xl mx-auto mb-6 px-4 flex flex-row justify-between">
        <div className="mb-4">
          <label className="text-sm text-gray-600">Theme Color:</label>
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
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

      <div
        id="resume-content"
        className="max-w-4xl mx-auto bg-white shadow-sm p-12"
      >
        <header className="text-center mb-12">
          <h1
            className="text-3xl font-light mb-4"
            style={{ color: primaryColor }}
          >
            {personalInfo?.name}
          </h1>
          <div className="text-sm space-x-4 text-gray-600">
            <span>{personalInfo?.email}</span>
            <span>•</span>
            <span>{personalInfo?.phone}</span>
            <span>•</span>
            <span>{personalInfo?.address}</span>
          </div>
        </header>

        <div className="max-w-2xl mx-auto">
          <section className="mb-10">
            <p className="text-sm leading-relaxed text-gray-600">{summary}</p>
          </section>

          <section className="mb-10">
            <h2
              className="text-xs font-semibold mb-6 pb-2 border-b"
              style={{ color: primaryColor }}
            >
              EXPERIENCE
            </h2>
            {experience?.map((exp, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-medium" style={{ color: primaryColor }}>
                    {exp.title}
                  </h3>
                  <span className="text-xs text-gray-500">{exp.years}</span>
                </div>
                <p className="text-sm mb-2 text-gray-600">{exp.company}</p>
                <ul className="text-sm space-y-1 text-gray-600">
                  {exp.summary}
                </ul>
              </div>
            ))}
          </section>

          <section className="mb-10">
            <h2
              className="text-xs font-semibold mb-6 pb-2 border-b"
              style={{ color: primaryColor }}
            >
              PROJECTS
            </h2>
            {projects?.map((project, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-medium" style={{ color: primaryColor }}>
                    {project.title}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {project.duration}
                  </span>
                </div>
                <p className="text-sm mb-2 text-gray-600">
                  {project.technologies}
                </p>
                <ul className="text-sm space-y-1 text-gray-600">
                  {project.summary}
                </ul>
              </div>
            ))}
          </section>

          <div className="grid grid-cols-2 gap-8">
            <section>
              <h2
                className="text-xs font-semibold mb-4 pb-2 border-b"
                style={{ color: primaryColor }}
              >
                EDUCATION
              </h2>
              {education?.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h3
                    className="text-sm font-medium"
                    style={{ color: primaryColor }}
                  >
                    {edu.college}
                  </h3>
                  <p className="text-xs text-gray-600">{edu.grade}</p>
                  <p className="text-xs text-gray-500">{edu.years}</p>
                </div>
              ))}
            </section>

            <section>
              <h2
                className="text-xs font-semibold mb-4 pb-2 border-b"
                style={{ color: primaryColor }}
              >
                SKILLS
              </h2>
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: `${primaryColor}10`,
                        color: primaryColor,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  {/* {certifications.map((cert, index) => (
                    <p key={index}>{cert}</p>
                  ))} */}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimalResume;
