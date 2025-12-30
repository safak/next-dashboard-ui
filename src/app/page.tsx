import Image from 'next/image';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* 1. Full-screen Background Image */}
      <Image
        src="/MUICbuilding2.png" // IMPORTANT: Replace with your image path
        layout="fill"
        objectFit="cover"
        alt="MUIC campus background"
        className="-z-10 brightness-90" // Pushes image behind content
      />

      {/* 2. The Login Box */}
      <div className="w-full max-w-md bg-white/90 p-8 rounded-xl shadow-lg backdrop-blur-sm">
        {/* Header Section */}
        <div className="text-center mb-8">
          <Image
            src="/muiclogo.png" // IMPORTANT: Replace with your logo path
            alt="MUIC Logo"
            width={360}
            height={60}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            MUIC Single Sign-on
          </h1>
        </div>

        {/* Form Section */}
        <form className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              defaultValue="u6481221"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              defaultValue="••••••••"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <Link href="/overview">
              <button
                type="submit"
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Log In
              </button>
            </Link>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <Link
            href="#"
            className="text-sm text-purple-600 hover:text-purple-500"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
