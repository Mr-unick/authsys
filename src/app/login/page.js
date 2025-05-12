"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "../../components/components/ui/button";
import { Input } from "../../components/components/ui/input";
import { Checkbox } from "../../components/components/ui/checkbox";
import { Label } from "../../components/components/ui/label";
import { EyeIcon, EyeOffIcon, Layers, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios'

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader,setLoader]=useState(false);
  const router = useRouter();

  const isLoggedIn = async () => {
    try {
      const response = await fetch('api/auth/isauthenticated', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        //  body: JSON.stringify({ email, password })
      });
      if (response.status == 200) {
        router.push('/');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
    isLoggedIn()

  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoader(true)
      const response = await axios.post('/api/auth/login', { email : email, password :password });

      if (response.data.status == 200) {
        router.push('/');
        setLoader(false)
      } else{
        toast.error(response.data.message)
        setLoader(false)
      }

    
    } catch (error) {
      console.error('Login error:', error);
      setLoader(false)
    }
  };

  // Return null or a loading state while not mounted
  if (!mounted) {
    return null;
  }



  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br bg-gray-50">
      {/* Right section - Image */}
      <div className="hidden lg:block flex-1 relative">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg"
            alt="People working"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-purple-600/10 "></div>
        </div>
      </div>

      {/* Left section - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2  max-sm:px-0">
            <Layers className="h-8 w-8 text-[#4E49F2]" />
            <h1 className="text-2xl font-bold text-[#4E49F2]">AppName</h1>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl max-sm:text-2xl font-semibold text-gray-900">Welcome back</h1>
            <p className="text-gray-600 max-sm:text-sm">Please enter your details to sign in</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-10 px-4 bg-gray-50/50 border-gray-200 focus:bg-white"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-10 px-4 bg-gray-50/50 border-gray-200 focus:bg-white pr-10"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ?
                      <EyeOffIcon className="h-5 w-5" /> :
                      <EyeIcon className="h-5 w-5" />
                    }
                  </button>
                </div>
              </div>
            </div>

            {/* <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-gray-300" />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </Label>
              </div>
              <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-800">
                Forgot password?
              </a>
            </div> */}

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full h-12 bg-[#4E49F2] hover:bg-blue-700 text-base mt-4"
              >
               {
                  loader ? <Loader2 className="animate-spin" /> : "Sign in"
               }
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  {/* <div className="w-full border-t border-gray-200"></div> */}
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2  text-gray-500">Or continue with</span>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="font-medium text-purple-600 hover:text-purple-800">
                Sign up for free
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
