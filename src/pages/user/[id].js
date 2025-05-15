import { useRouter } from "next/router"



import React from 'react';
import { User, Mail, MapPin, Briefcase, Users } from 'lucide-react';
import ActivityFeed from "@/app/components/cards/activitycard";

const UserProfile = () => {

    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        address: 'yavatmal, ghtanji dist',
        gender: 'male',
        role: 'admin'
    };

    // Sample role options
    const roleOptions = [
        { id: 'admin', name: 'Administrator' },
        { id: 'manager', name: 'Manager' },
        { id: 'editor', name: 'Editor' },
        { id: 'user', name: 'Regular User' }
    ];
    
    // Find role name from role id
    const getRoleName = (roleId) => {
        const role = roleOptions.find(r => r.id === roleId);
        return role ? role.name : 'Not assigned';
    };

    // Get gender display text
    const getGenderDisplay = (gender) => {
        if (gender === 'male') return 'Male';
        if (gender === 'female') return 'Female';
        if (gender === 'other') return 'Other';
        return 'Not specified';
    };

    return (
        <div className="  text-gray-600 h-full  p-4 ">
           <div className='text-start flex flex-col'>
            <p className="text-lg font-semibold">Nikhil Lende</p>
            <p className="text-sm">Admin</p>
            <p className="text-xs"> nikhillende@gmail.com</p>
           </div>
            <div className="w-full  gap-5 flex flex-row mt-5 "> 
           <div className=" w-[60%] overflow-y-scroll max-h-[33rem] bg-red-400  border rounded-md">
            <ActivityFeed/>
            </div>
            <div className=" w-[40%] ">
            s
            </div>
           </div>
        </div>
    );
};

export default UserProfile;
