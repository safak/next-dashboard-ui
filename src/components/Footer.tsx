export default function Footer() {
    return (
      <footer className="w-full bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} UpLift. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-blue-600 transition">About</a>
            <a href="#" className="hover:text-blue-600 transition">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition">Terms</a>
            <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
          </div>
        </div>
      </footer>
    );
  }
  