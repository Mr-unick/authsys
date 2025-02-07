import axios from "axios";





export async function createResume(data,id) {
  try {
    const response = await fetch(`/api/resume/createresume?id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create resume');
    }
    
    return await response.data;
  } catch (error) {
    console.error('Error creating resume:', error);
    throw error;
  }
}

export async function createUser(data) {
    try {
      const response = await axios.post('/api/resume/createuser',data);
      
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      
      return await response.data;
    } catch (error) {
      console.error('Error creating resume:', error);
      throw error;
    }
  }

  export async function getUser(email) {
    try {
      const response = await fetch(`/api/resume/createuser?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
    
      });
      
      if (!response.ok) {
        throw new Error('Failed to get user');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating resume:', error);
      throw error;
    }
  }

export async function updateResume(resumeId, data) {
  try {
    const response = await fetch('/api/resume/usedetails', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeId, ...data }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update resume');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating resume:', error);
    throw error;
  }
}

export async function getResumes(userId) {
  try {
    const response = await axios.get(`/api/resume/createresume?userId=${userId}`);
    
    return await response.data;
  } catch (error) {
    console.error('Error fetching resumes:', error);
    throw error;
  }
}