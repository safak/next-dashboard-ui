"use client";
import { useState } from "react";
import Image from "next/image";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/firebaseConfig";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState(""); // Controlled input for email
  const [password, setPassword] = useState(""); // Controlled input for password
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth); // React Firebase Hook
  const router = useRouter(); // For navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop form from refreshing the page

    try {
      await signInWithEmailAndPassword(email, password); // Sign in using Firebase
      setEmail(""); // Clear email state
      setPassword(""); // Clear password state
      router.push("/dashboard/student");
    } catch (err) {
      console.error(err); 
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-50">
      {/* Card Container */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        {/* Robot Image */}
        <div className="flex justify-center mb-4">
          <Image
            src="/robot-chatbot.png"
            alt="Friendly Robot"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Welcome Back!
        </h2>
        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email} // Controlled input
              onChange={(e) => setEmail(e.target.value)} // Update state
              placeholder="aspire.ai@botverse.io"
              className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Password Input */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password} // Controlled input
              onChange={(e) => setPassword(e.target.value)} // Update state
              placeholder="**********"
              className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/auth/signup" className="text-blue-500 hover:underline">
            Create an Account
          </a>
        </p>
        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-center mt-2">
            {error.message || "Login failed. Please try again."}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
