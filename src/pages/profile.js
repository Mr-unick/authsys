import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from "lucide-react";
import { UserProfileView } from "@/app/components/dashboard/UserProfileView";
import { useRouter } from "next/router";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/auth/isauthenticated');
                if (res.data.status === 200) {
                    setUser(res.data.data);
                } else {
                    router.push('/signin');
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
                router.push('/signin');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                <p className="text-xs text-slate-400 font-medium">Loading Profile...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-8">
            <UserProfileView userId={user.id} onBack={() => router.back()} />
        </div>
    );
};

export default ProfilePage;
