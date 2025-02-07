import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { jsPDF } from "jspdf"; // We can still keep jsPDF for custom formatting if needed
import html2canvas from "html2canvas"; // Import html2canvas
import { ResumeContext, ResumeProvider } from "./resumecontext.js"; // Import context
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Resumesignin from "./resumesignin.js";
import { sampleData } from "./const.js";
import MinimalResume from "../../app/components/resumeTemplate3";

const Builder = () => {
  const { data, setData } = useContext(ResumeContext); // Get data and setData from context

  const [generatedResume, setGeneratedResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [change, setChange] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  // Update context whenever formData changes
  useEffect(() => {
    console.log("Current context data:", data); // This will log the data every time it changes.
  }, [data]);

  const handleInputChange = (e) => {
    // Example of handling form data changes
    setData(prevData => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        [e.target.name]: e.target.value
      }
    }));
  };

  const handleGenerate = async (data) => {


  setGeneratedResume(data);
  return;

    setLoading(true);
    setError(null);

    const prompt = `
      Please generate a resume using the following structure. The output should follow the exact same format as the sample JSON provided below. Ensure that all values are filled and no fields are left empty or null.

      Here is the sample data structure that must be followed strictly:

      ${JSON.stringify(sampleData, null, 2)}

      And here is the data I have provided:

      ${JSON.stringify(data, null, 2)}

      For each experience, use the values from the 'experience.position' to generate the responsibilities in 'experience.responsibilities'. Similarly, for each project, use 'project.name' and 'project.technologies' to generate a summary for 'projects.details'.

      Ensure the following:

      1. For experience, generate a brief summary in 'experience.responsibilities' based on the 'experience.position'.
      2. For projects, generate a concise summary in 'projects.details' based on the 'project.name' and 'project.technologies'.
      3. Follow all other fields as provided in the fromData, leaving no fields empty or null.
      4. Every value provided in formData should remain the same as it is, just add extra details.

      Please generate a resume in the exact format as the sample JSON, replacing values from the provided data. Ensure there are no empty or null fields in the output.

      Only output the JSON data, do not provide any note or other text except the JSON data.
    `;

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${"YOUR_GOOGLE_API_KEY"}`,
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      const generatedText = response.data.candidates[0].content.parts[0].text.slice(7, -4);
      setGeneratedResume(JSON.parse(generatedText));

    } catch (err) {
      setError(err.message || "Error generating resume.");
      console.error("API Error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedResume) return;

    const resumeContent = document.getElementById("resume-content");
    html2canvas(resumeContent).then((canvas) => {
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 10, 10, 180, 160);
      pdf.save("generated_resume.pdf");
    });
  };

  if (status === "loading") return <div>Loading...</div>;

  if (!session) {
    router.push("/resume/resumeLanding");
    return null;
  }

  return <Resumesignin onSubmit={(data)=>{handleGenerate(data)}} />
  
};

export default function ResumeBuilder() {
  return (
    <ResumeProvider>
      <Builder />
    </ResumeProvider>
  );
}
