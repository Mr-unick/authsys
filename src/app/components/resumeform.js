import React, { useState } from 'react';
import { Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';

const ResumeForm = ({ onSubmit }) => {
  
 const [formData, setFormData] = useState({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    summary: "",
    education: [
      {
        collegeName: "",
        degree: "",
        fromYear: "",
        toYear: "",
        percentage: "",
        achievements: [],
      },
    ],
    experience: [
      {
        designation: "",
        company: "",
        fromYear: "",
        toYear: "",
        responsibilities: [],
      },
    ],
    projects: [
      {
        name: "",
        duration: "",
        technologies: "",
        details: [],
        link: "",
      },
    ],
    skills: [],
    certifications: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    personalInfo: true,
    education: true,
    experience: true,
    skills: true,
    certifications: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (e, section, index, field) => {
    
    const { value } = e.target;
    if (section === 'personalInfo') {
      setFormData(prev => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, [field]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: prev[section].map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    }
  };

  const handleArrayInputChange = (e, section, index) => {
    e.preventDefault()
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => i === index ? value : item)
    }));
  };

  const addItem = (section) => {
    const newItem = section === 'education' 
      ? { collegeName: '', fromYear: '', toYear: '', percentage: '' }
      : section === 'experience'
      ? { designation: '', fromYear: '', toYear: '', company: '' }
      : section === 'projects'
      ? { name: '', duration: '', technologies: '', link: '' }
      : '';
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));

  
    
  };

  const removeItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const SectionHeader = ({ title, isExpanded, onToggle, onAdd, showAdd }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg hover:bg-gray-100 transition-colors cursor-pointer">
      <div className="flex items-center gap-3" onClick={onToggle}>
        {isExpanded ? (
          <ChevronUp size={20} className="text-gray-500" />
        ) : (
          <ChevronDown size={20} className="text-gray-500" />
        )}
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      {showAdd && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200"
        >
          <Plus size={20} />
        </button>
      )}
    </div>
  );

  const InputField = ({ label, type = "text", value, onChange, required = true }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6 bg-white rounded-xl shadow-sm">
      {/* Personal Information */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <SectionHeader 
          title="Personal Information" 
          isExpanded={expandedSections.personalInfo}
          onToggle={() => toggleSection('personalInfo')}
        />
        {expandedSections.personalInfo && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
            {Object.entries(formData.personalInfo).map(([field, value]) => (
              <InputField
                key={field}
                label={field.replace(/([A-Z])/g, ' $1').trim().charAt(0).toUpperCase() + field.slice(1)}
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                value={value}
                onChange={(e) => handleInputChange(e, 'personalInfo', null, field)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Education */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <SectionHeader 
          title="Education" 
          isExpanded={expandedSections.education}
          onToggle={() => toggleSection('education')}
          onAdd={() => addItem('education')}
          showAdd={true}
        />
        {expandedSections.education && (
          <div className="p-6 space-y-6 bg-white">
            {formData.education.map((edu, index) => (
              <div key={index} className="relative p-6 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(edu).map(([field, value]) => (
                    <InputField
                      key={field}
                      label={field.replace(/([A-Z])/g, ' $1').trim().charAt(0).toUpperCase() + field.slice(1)}
                      value={value}
                      onChange={(e) => handleInputChange(e, 'education', index, field)}
                    />
                  ))}
                </div>
                {formData.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem('education', index)}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                  >
                    <Minus size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Experience */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <SectionHeader 
          title="Experience" 
          isExpanded={expandedSections.experience}
          onToggle={() => toggleSection('experience')}
          onAdd={() => addItem('experience')}
          showAdd={true}
        />
        {expandedSections.experience && (
          <div className="p-6 space-y-6 bg-white">
            {formData.experience.map((exp, index) => (
              <div key={index} className="relative p-6 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(exp).map(([field, value]) => (
                    <InputField
                      key={field}
                      label={field.replace(/([A-Z])/g, ' $1').trim().charAt(0).toUpperCase() + field.slice(1)}
                      value={value}
                      onChange={(e) => handleInputChange(e, 'experience', index, field)}
                    />
                  ))}
                </div>
                {formData.experience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem('experience', index)}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                  >
                    <Minus size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

       {/* Projects*/}

       <div className="overflow-hidden rounded-lg border border-gray-200">
        <SectionHeader 
          title="Projects" 
          isExpanded={expandedSections.projects}
          onToggle={() => toggleSection('projects')}
          onAdd={() => addItem('projects')}
          showAdd={true}
        />
        {expandedSections.projects && (
          <div className="p-6 space-y-6 bg-white">
            {formData.projects.map((exp, index) => (
              <div key={index} className="relative p-6 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(exp).map(([field, value]) => (
                    <InputField
                      key={field}
                      label={field.replace(/([A-Z])/g, ' $1').trim().charAt(0).toUpperCase() + field.slice(1)}
                      value={value}
                      onChange={(e) => handleInputChange(e, 'experience', index, field)}
                    />
                  ))}
                </div>
                {formData.projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem('projects', index)}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                  >
                    <Minus size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <SectionHeader 
          title="Skills" 
          isExpanded={expandedSections.skills}
          onToggle={() => toggleSection('skills')}
          onAdd={() => addItem('skills')}
          showAdd={true}
        />
        {expandedSections.skills && (
          <div className="p-6 space-y-4 bg-white">
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleArrayInputChange(e, 'skills', index)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Enter skill"
                  required
                />
                {formData.skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem('skills', index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                  >
                    <Minus size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
     
    </form>
  );
};

export default ResumeForm;