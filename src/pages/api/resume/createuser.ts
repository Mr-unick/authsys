import { connectDB } from "./userdetails";

const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
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
  resumes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  }]
}, {
  timestamps: true
});

 const User = mongoose.models.User || mongoose.model('User', userSchema);

export default async function handler(request,response) {

  try {
    await connectDB();

  if(request.method == 'POST'){
    
   const data = request.body;

   if (!data.username || !data.email) {
     return response.json(
       { error: 'Required fields are missing' },
       { status: 400 }
     );
   }

   // Create new resume
   const user = new User({
     username:data.username,
     email:data.email,
   });

   await user.save();

   return response.json(
     { message: 'User created successfully', user },
     { status: 201 }
   );
  }

  if(request.method == "GET"){

    const email = request.query.email;
     
    let user = await User.find({email:email});


     if(user.length > 0){
      return response.json(
        { status: 201 ,data:user}
      );;
     }else{
      return response.json(
        { status: 404 }
      );;
     }

      
  }


  } catch (error) {
    console.error('Resume creation error:', error);
    return response.json(
      { error: 'Error creating resume' },
      { status: 500 }
    );
  }
}