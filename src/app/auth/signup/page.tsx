'use client'
import { useState } from "react";
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {auth} from '@/app/firebase/firebaseConfig'
import {useRouter} from "next/navigation";


const Signup = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const router = useRouter();
  
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      setEmail('');
      setPassword('');
      if (!res) return;
      router.push("/dashboard/student");
    }
    catch(e){
      console.error(e);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-blue-600 font-medium mb-2">
              Email:
            </label>
            <input
              type="text"
              id="email"
              value={email} // Controlled input
              onChange={(e) => setEmail(e.target.value)} // Update state
              className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="aspire.ai@cyberbot.org"
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-blue-600 font-medium mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password} // Controlled input
              onChange={(e) => setPassword(e.target.value)} // Update state
              className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Account
          </button>

          {/* Already Registered Text */}
          <p className="text-center text-blue-600">
            Already Registered?{" "}
            <a href="/auth/login" className="underline text-blue-800">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
