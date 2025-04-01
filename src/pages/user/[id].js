import { useRouter } from "next/router"



import React from 'react';
import { User, Mail, MapPin, Briefcase, Users } from 'lucide-react';

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
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <div className="flex flex-col items-center mb-6">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
                    {user?.profileImage ? (
                        <img
                            src={user.profileImage}
                            alt={user.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <User className="h-12 w-12 text-gray-400" />
                    )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mt-2">
                    {getRoleName(user.role)}
                </span>
            </div>

            <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center">
                    <div className="flex-shrink-0 w-10">
                        <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-500">Email</div>
                        <div className="text-gray-900">{user.email}</div>
                    </div>
                </div>

                {/* Address */}
                <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 pt-1">
                        <MapPin className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-500">Address</div>
                        <div className="text-gray-900">{user.address}</div>
                    </div>
                </div>

                {/* Gender */}
                <div className="flex items-center">
                    <div className="flex-shrink-0 w-10">
                        <Users className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-500">Gender</div>
                        <div className="text-gray-900">{getGenderDisplay(user.gender)}</div>
                    </div>
                </div>

                {/* Role */}
                <div className="flex items-center">
                    <div className="flex-shrink-0 w-10">
                        <Briefcase className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-500">Role</div>
                        <div className="text-gray-900">{getRoleName(user.role)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
