import React from 'react';

const DashboardPage = () => {
  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        {/* Header Section */}
        <header className="mb-6 text-center">
          <h2 className="text-3xl font-bold">Welcome, [User's Name]!</h2>
          <p className="text-gray-600">Start your journey towards your dream career today.</p>
        </header>

        {/* Main Dashboard Widgets */}
        <div className="flex justify-center items-start " > {/* Center the grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Motivational Section */}
            <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-2 lg:col-span-3 transform transition-transform duration-500 hover:scale-105">
              <div className="w-full h-64 flex items-center justify-center overflow-hidden transform transition-transform duration-500 hover:scale-105">
                <img
                  src="/collegegrad.jpg" // Corrected path
                  alt="Motivational"
                  className="object-contain w-full h-full" // Ensures image is fully visible
                />
              </div>
              <h3 className="text-xl font-bold text-center mt-4">
                “Change will not come if we wait for some other person or some other time. We are the ones we've been waiting for. We are the change that we seek.” – Barack Obama
              </h3>
            </div>

            {/* Quick Links */}
            <div className="bg-white p-4 rounded shadow transform transition-transform duration-500 hover:scale-105">
              <h3 className="text-lg font-bold">Quick Actions</h3>
              <div className="mt-2 flex flex-col space-y-2">
                <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Submit Resume</button>
                <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Chat with AspireAI</button>
                <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">Explore Career Paths</button>
                <button className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600">Start Mock Interview</button>
              </div>
            </div>

            <div className="bg-gray-200 p-6 rounded shadow mt-6 transform transition-transform duration-500 hover:scale-105">
              <h3 className="text-lg font-bold">Feature Coming Soon!</h3>
                <p className="text-gray-600">We're working on adding exciting new features to help you succeed. Stay tuned!</p>
            </div>


            {/* Resources Highlights */}
            <div className="bg-white p-4 rounded shadow transform transition-transform duration-500 hover:scale-105">
              <h3 className="text-lg font-bold">Featured Resources</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <a href="https://www.careereducation.columbia.edu/resources/resumes-impact-creating-strong-bullet-points" 
                  className="text-blue-500 hover:underline">
                    How to Write an Outstanding Resume
                  </a>
                </li>
                <li>
                  <a href="https://money.usnews.com/careers/best-jobs/rankings/the-100-best-jobs" 
                  className="text-blue-500 hover:underline">
                    100 Best Jobs
                  </a>
                </li>
                <li>
                  <a href="https://ung.edu/career-services/online-career-resources/interview-well/tips-for-a-successful-interview.php" 
                  className="text-blue-500 hover:underline">
                    Ace Your Next Interview: Tips & Tricks
                  </a>
                </li>
                <li>
                  <a href="https://neetcode.io/roadmap" className="text-blue-500 hover:underline">
                    🚀 NeetCode For Technical Prep
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
