import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/components/ui/card";
import { Button } from "../../components/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../../components/components/ui/alert";
import { GEMNIKEY } from '../../../const';

// Gemini API configuration
const GEMINI_PROMPT = `Analyze the following job description and provide:
1. Key required skills
2. Experience highlights to emphasize
3. Technical competencies
4. Soft skills to highlight
5. Resume action words that match the role
6. Project highlights format
7. Education recommendations
Format the response in clear sections.

Job Description:

`;

export default function Page() {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState(null);

  const analyzeJobDescription = async () => {
    if (!jobDescription.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMNIKEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: GEMINI_PROMPT + jobDescription
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

   
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to analyze job description');
      }

      // Parse the response into structured data
      const content = data.candidates[0].content.parts[0].text;
      const sections = parseGeminiResponse(content);
      setSuggestions(sections);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse Gemini's response into structured sections
  const parseGeminiResponse = (text) => {
    // This is a simple parser - enhance based on actual Gemini response format
    const sections = text.split('\n\n');
    return {
      keySkills: sections[0]?.split('\n').filter(Boolean) || [],
      experienceHighlights: sections[1]?.split('\n').filter(Boolean) || [],
      technicalCompetencies: sections[2]?.split('\n').filter(Boolean) || [],
      softSkills: sections[3]?.split('\n').filter(Boolean) || [],
      actionWords: sections[4]?.split('\n').filter(Boolean) || [],
      projectFormat: sections[5]?.split('\n').filter(Boolean) || [],
      education: sections[6]?.split('\n').filter(Boolean) || [],
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Left Panel - Input */}
        <div className="lg:w-1/2 p-8 border-r border-gray-200 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Guide </h1>
            <p className="text-gray-600 mb-6">Paste your target job description to get personalized resume suggestions</p>
            
            <Card>
              <CardContent className="pt-6">
                <textarea
                  className="w-full h-96 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <Button 
                  className="mt-4 w-full"
                  onClick={analyzeJobDescription}
                  disabled={!jobDescription.trim() || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Generate Resume Suggestions'
                  )}
                </Button>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="lg:w-1/2 p-8 bg-gray-50 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {suggestions ? (
              <div className="space-y-6">
                {/* Key Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle>Key Skills to Highlight</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-6 space-y-2">
                      {suggestions.keySkills.map((skill, index) => (
                        <li key={index} className="text-gray-700">{skill}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Technical Competencies */}
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Competencies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-6 space-y-2">
                      {suggestions.technicalCompetencies.map((tech, index) => (
                        <li key={index} className="text-gray-700">{tech}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Soft Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle>Soft Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-6 space-y-2">
                      {suggestions.softSkills.map((skill, index) => (
                        <li key={index} className="text-gray-700">{skill}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Experience Format */}
                <Card>
                  <CardHeader>
                    <CardTitle>Experience Highlights Format</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-6 space-y-2">
                      {suggestions.experienceHighlights.map((highlight, index) => (
                        <li key={index} className="text-gray-700">{highlight}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Action Words */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Action Words</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.actionWords.map((word, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {word}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Education */}
                <Card>
                  <CardHeader>
                    <CardTitle>Education Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-6 space-y-2">
                      {suggestions.education.map((edu, index) => (
                        <li key={index} className="text-gray-700">{edu}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center">
                  Enter a job description on the left to get personalized resume suggestions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}