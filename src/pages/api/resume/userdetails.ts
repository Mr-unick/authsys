
import { NextResponse } from 'next/server';

const mongoose = require('mongoose');





export async function connectDB() {

  if (mongoose.connections[0].readyState) return;
  let pass= 'K5eEljOFlAotCvca';
  try {
    await mongoose.connect(`mongodb+srv://nikhillende9121:${pass}@cluster0.x3mmy.mongodb.net/`);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}


// export async function POST(request) {
//   try {
//     await connectDB();
//     const data = await request.json();

//     // Basic validation
//     if (!data.personalInfo || !data.personalInfo.email) {
//       return NextResponse.json(
//         { error: 'Required fields are missing' },
//         { status: 400 }
//       );
//     }

//     // Create new resume
//     const resume = new Resume({
//       user: data.userId, // Assuming you're passing userId from client
//       personalInfo: {
//         name: data.personalInfo.name,
//         email: data.personalInfo.email,
//         phone: data.personalInfo.phone,
//         address: data.personalInfo.address
//       },
//       education: data.education || [],
//       projects: data.projects || [],
//       skills: data.skills || []
//     });

//     await resume.save();

//     return NextResponse.json(
//       { message: 'Resume created successfully', resume },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Resume creation error:', error);
//     return NextResponse.json(
//       { error: 'Error creating resume' },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(request) {
//   try {
//     await connectDB();
//     const data = await request.json();
//     const { resumeId, ...updateData } = data;

//     if (!resumeId) {
//       return NextResponse.json(
//         { error: 'Resume ID is required' },
//         { status: 400 }
//       );
//     }

//     // Update resume
//     const updatedResume = await Resume.findByIdAndUpdate(
//       resumeId,
//       {
//         $set: {
//           personalInfo: updateData.personalInfo,
//           education: updateData.education,
//           projects: updateData.projects,
//           skills: updateData.skills
//         }
//       },
//       { new: true, runValidators: true }
//     );

//     if (!updatedResume) {
//       return NextResponse.json(
//         { error: 'Resume not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { message: 'Resume updated successfully', resume: updatedResume },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Resume update error:', error);
//     return NextResponse.json(
//       { error: 'Error updating resume' },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(request) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get('userId');

//     if (!userId) {
//       return NextResponse.json(
//         { error: 'User ID is required' },
//         { status: 400 }
//       );
//     }

//     const resumes = await Resume.find({ user: userId });
//     return NextResponse.json({ resumes }, { status: 200 });
//   } catch (error) {
//     console.error('Resume fetch error:', error);
//     return NextResponse.json(
//       { error: 'Error fetching resumes' },
//       { status: 500 }
//     );
//   }
// }

