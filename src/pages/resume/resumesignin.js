"use client"

import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios'; // Add axios for generating summaries
import { createResume } from './services';
import { GEMNIKEY } from '../../../const';
import { ResumeContext, ResumeProvider } from './resumecontext';
import { useRouter } from 'next/router';

const PersonalInfoForm = ({ onNext, initialData }) => {
  const [formState, setFormState] = useState(initialData);
  const handleNext = () => {
    onNext(formState);
  };

  return (
    <div className="space-y-4">
     
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={formState?.name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={formState?.email}
          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="tel"
          value={formState?.phone}
          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <textarea
          value={formState?.address}
          onChange={(e) => setFormState({ ...formState, address: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          rows="3"
        />
      </div>
      <div className="flex justify-end mt-6">
        <button
          onClick={handleNext}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

const EducationForm = ({ onNext, onPrev, initialData }) => {
  const [educationList, setEducationList] = useState(initialData || []);
  const [currentEducation, setCurrentEducation] = useState({
    college: '',
    years: '',
    grade: ''
  });

  const handleAdd = () => {
    if (currentEducation.college && currentEducation.years && currentEducation.grade) {
      setEducationList([...educationList, currentEducation]);
      setCurrentEducation({ college: '', years: '', grade: '' });
    }
  };

  const handleNext = () => {
    onNext(educationList);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 mb-6">
        {educationList?.map((edu, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded">
            <p className="font-medium">{edu.college}</p>
            <p className="text-sm text-gray-600">{edu.years}</p>
            <p className="text-sm text-gray-600">Grade: {edu.grade}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">College/University Name</label>
          <input
            type="text"
            value={currentEducation.college}
            onChange={(e) => setCurrentEducation({ ...currentEducation, college: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Years</label>
          <input
            type="text"
            value={currentEducation.years}
            onChange={(e) => setCurrentEducation({ ...currentEducation, years: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 2020-2024"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CGPA/Percentage</label>
          <input
            type="text"
            value={currentEducation.grade}
            onChange={(e) => setCurrentEducation({ ...currentEducation, grade: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleAdd}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Education
        </button>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          className="flex items-center px-4 py-2 bg-gray-200 rounded"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </button>
        <button
          onClick={handleNext}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

const ProjectsForm = ({ onNext, onPrev, initialData }) => {
  const [projectsList, setProjectsList] = useState(initialData || []);
  const [currentProject, setCurrentProject] = useState({
    title: '',
    technologies: '',
    summary: ''
  });
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    if (currentProject.title && currentProject.technologies) {
      setProjectsList([...projectsList, currentProject]);
      setCurrentProject({ title: '', technologies: '', summary: '' });
    }
  };

  const handleNext = () => {
    onNext(projectsList);
  };

  const handleGenerateSummary = async () => {
    if (!currentProject.title || !currentProject.technologies) {
      alert('Please fill in project title and technologies first');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMNIKEY}`,
        {
          contents: [{
            parts: [{
              text: `Generate a concise project summary for a project with title "${currentProject.title}" using technologies "${currentProject.technologies}". Keep it professional and under 100 words.`
            }]
          }]
        }
      );

      const summary = response.data.candidates[0].content.parts[0].text;
      setCurrentProject(prev => ({ ...prev, summary }));
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 mb-6">
        {projectsList?.map((project, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded">
            <p className="font-medium">{project.title}</p>
            <p className="text-sm text-gray-600">{project.technologies}</p>
            <p className="text-sm mt-2">{project.summary}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Project Title</label>
          <input
            type="text"
            value={currentProject.title}
            onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Technologies Used</label>
          <input
            type="text"
            value={currentProject.technologies}
            onChange={(e) => setCurrentProject({ ...currentProject, technologies: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., React, Node.js, MongoDB"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium">Project Summary</label>
            <button
              onClick={handleGenerateSummary}
              disabled={loading}
              className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
            >
              {loading ? 'Generating...' : 'Generate Summary'}
            </button>
          </div>
          <textarea
            value={currentProject.summary}
            onChange={(e) => setCurrentProject({ ...currentProject, summary: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>
        <button
          onClick={handleAdd}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Project
        </button>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          className="flex items-center px-4 py-2 bg-gray-200 rounded"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </button>
        <button
          onClick={handleNext}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

const ExperienceForm = ({ onNext, onPrev, initialData }) => {
  const [experienceList, setExperienceList] = useState(initialData || []);
  const [currentExperience, setCurrentExperience] = useState({
    title: '',
    company: '',
    years: '',
    summary: ''
  });
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    if (currentExperience.title && currentExperience.company && currentExperience.years) {
      setExperienceList([...experienceList, currentExperience]);
      setCurrentExperience({ title: '', company: '', years: '', summary: '' });
    }
  };

  const handleNext = () => {
    onNext(experienceList);
  };

  const handleGenerateSummary = async () => {
    if (!currentExperience.title || !currentExperience.company) {
      alert('Please fill in position title and company first');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMNIKEY}`,
        {
          contents: [{
            parts: [{
              text: `Generate a professional summary of responsibilities for a ${currentExperience.title} position at ${currentExperience.company}. Include 3-4 key responsibilities. Keep it concise and professional.`
            }]
          }]
        }
      );

      const summary = response.data.candidates[0].content.parts[0].text;
      setCurrentExperience(prev => ({ ...prev, summary }));
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 mb-6">
        {experienceList?.map((exp, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded">
            <p className="font-medium">{exp.title} at {exp.company}</p>
            <p className="text-sm text-gray-600">{exp.years}</p>
            <p className="text-sm mt-2">{exp.summary}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Position Title</label>
          <input
            type="text"
            value={currentExperience.title}
            onChange={(e) => setCurrentExperience({ ...currentExperience, title: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Company</label>
          <input
            type="text"
            value={currentExperience.company}
            onChange={(e) => setCurrentExperience({ ...currentExperience, company: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Years</label>
          <input
            type="text"
            value={currentExperience.years}
            onChange={(e) => setCurrentExperience({ ...currentExperience, years: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 2020-2024"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium">Role Summary</label>
            <button
              onClick={handleGenerateSummary}
              disabled={loading}
              className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
            >
              {loading ? 'Generating...' : 'Generate Summary'}
            </button>
          </div>
          <textarea
            value={currentExperience.summary}
            onChange={(e) => setCurrentExperience({ ...currentExperience, summary: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>
        <button
          onClick={handleAdd}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Experience
        </button>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          className="flex items-center px-4 py-2 bg-gray-200 rounded"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </button>
        <button
          onClick={handleNext}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

const SkillsForm = ({ onPrev, onComplete, initialData }) => {
  const [skills, setSkills] = useState(initialData || []);

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      setSkills([...skills, e.target.value]);
      e.target.value = '';
    }
  };

  const handleComplete = () => {
    onComplete(skills);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 mb-6 flex flex-wrap  w-fit  gap-3">
        {skills?.map((skill, index) => (
          <div key={index} className="flex p-4 bg-gray-50 rounded flex-wrap">
            <p className="font-medium">{skill}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium mb-1">Skills</label>
        <input
          type="text"
          onKeyDown={handleAddSkill}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Press Enter to add a skill"
        />
      </div>
      <div>
      
      </div>
      

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          className="flex items-center px-4 py-2 bg-gray-200 rounded"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </button>
        <button
          onClick={handleComplete}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

const Signin = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem("resumeData"));
    return savedData ?  savedData : {
      title:'',
      personalInfo: { name: localStorage.getItem('name'), email: localStorage.getItem('email'), phone: '', address: '' },
      education: [],
      projects: [],
      experience: [],
      skills: []
    };
  });

  const {setData} = useContext(ResumeContext);
 const router = useRouter();
  
  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(formData));
    setData(formData)

  }, [formData]);


  const handlePersonalInfoNext = (data) => {
    setFormData(prev => ({ ...prev, personalInfo: data }));
    setStep(2);
  };

  const handleEducationNext = (data) => {
    setFormData(prev => ({ ...prev, education: data }));
    setStep(3);
  };

  const handleProjectsNext = (data) => {
    setFormData(prev => ({ ...prev, projects: data }));
    setStep(4);
  };

  const handleExperienceNext = (data) => {
    setFormData(prev => ({ ...prev, experience: data }));
    setStep(5);
  };

  const handleSkillsComplete =async (data) => {
    setFormData(prev => ({ ...prev, skills: data }));

    
    try{
    let res  =  await createResume(formData,sessionStorage.getItem('userid'));
      router.push('/resume/resumeLanding')
      
   
    }catch(e){

    }
    console.log(formData)
    localStorage.removeItem('resumeData')
    
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalInfoForm onNext={handlePersonalInfoNext} initialData={formData.personalInfo} />;
      case 2:
        return <EducationForm onNext={handleEducationNext} onPrev={() => setStep(1)} initialData={formData.education} />;
      case 3:
        return <ProjectsForm onNext={handleProjectsNext} onPrev={() => setStep(2)} initialData={formData.projects} />;
      case 4:
        return <ExperienceForm onNext={handleExperienceNext} onPrev={() => setStep(3)} initialData={formData.experience} />;
      case 5:
        return <SkillsForm onPrev={() => setStep(4)} onComplete={handleSkillsComplete} initialData={formData.skills} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center bg-red-50 h-screen">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Resume Builder</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};

export default function Resumesignin({onSubmit}){
   
    return <ResumeProvider>
        <Signin onSubmit={onSubmit}/>
    </ResumeProvider>
};
