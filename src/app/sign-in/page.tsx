'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router

const SignInPage = () => {
  const [username, setUsername] = useState(''); // Changed from email to username
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Clear previous errors
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false, // Handle redirect manually based on result
        username, // Changed from email to username
        password,
      });

      setIsLoading(false);

      if (result?.error) {
        // Handle specific errors or show a generic message
        console.error('Sign-in error:', result.error);
        setError('Invalid email or password. Please try again.');
      } else if (result?.ok) {
        // Sign-in successful, redirect to home page
        // The home page will handle role-based redirection
        router.push('/');
        router.refresh(); // Optional: Refresh server components on the target page
      } else {
        // Handle unexpected cases
        setError('An unexpected error occurred. Please try again.');
      }
    } catch (err) {
      setIsLoading(false);
      console.error('Sign-in exception:', err);
      setError('An error occurred during sign-in.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f0f0f0',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '40px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Sign In</h1>
        {error && (
          <p style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</p>
        )}
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor='username'
            style={{ display: 'block', marginBottom: '8px', color: '#555' }}
          >
            Username
          </label>{' '}
          {/* Changed label */}
          <input
            id='username' // Changed id
            type='text' // Changed type
            value={username} // Changed value binding
            onChange={(e) => setUsername(e.target.value)} // Changed state setter
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        <div style={{ marginBottom: '30px' }}>
          <label
            htmlFor='password'
            style={{ display: 'block', marginBottom: '8px', color: '#555' }}
          >
            Password
          </label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        <button
          type='submit'
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            background: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default SignInPage;
