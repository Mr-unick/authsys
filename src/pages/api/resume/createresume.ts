import { connectDB} from "./userdetails";



const mongoose = require('mongoose');

// Personal Information Schema
const personalInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  }
});

// Education Schema
const educationSchema = new mongoose.Schema({
  college: {
    type: String,
    required: [true, 'College/University name is required'],
    trim: true
  },
  years: {
    type: String,
    required: [true, 'Years of study are required'],
    trim: true
  },
  grade: {
    type: String,
    required: [true, 'Grade/CGPA is required'],
    trim: true
  }
});

// Project Schema
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  technologies: {
    type: String,
    required: [true, 'Technologies used are required'],
    trim: true
  },
  summary:String
});

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  company: {
    type: String,
    
  },
  summary:String,
  years:String
});

// Resume Schema (Main Schema)
const resumeSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalInfo: {
    type: personalInfoSchema,
    required: true
  },
  education: {
    type: [educationSchema],
    default: []
  },
  projects: {
    type: [projectSchema],
    default: []
  },
  experience: {
    type: [experienceSchema],
    default: []
  }
  ,

  skills: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});



const Resume =mongoose.models.Resume || mongoose.model('Resume', resumeSchema);

// userId

export default async function handler(request,response) {
  try {
    await connectDB();

    if(request.method == "POST"){
        

    
    const data = await request.body;


    if (!data.personalInfo || !data.personalInfo.email) {
      return response.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // Create new resume
    const resume = new Resume({
      title:data.title,
      user: request.query.id, 
      personalInfo: {
        name: data.personalInfo.name,
        email: data.personalInfo.email,
        phone: data.personalInfo.phone,
        address: data.personalInfo.address
      },
      education: data.education || [],
      experience:data.experience,
      projects: data.projects || [],
      skills: data.skills || []
    });

    await resume.save();

    return response.json(
      { message: 'Resume created successfully', resume },
      { status: 201 }
    );
    }

    if(request.method == "GET"){
        let id = request.query.userId;

        let resumes = await Resume.find({user:id});
      //  console.log(resumes);

       return  response.json(resumes)

    }

  } catch (error) {
    console.error('Resume creation error:', error);
    return response.json(
      { error: 'Error creating resume' },
      { status: 500 }
    );
  }
}