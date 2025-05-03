import Footer from '../components/Footer';
import Link from 'next/link';

const Homepage = () => {
  return (
    <main className="bg-gradient-to-br from-blue-50 to-white px-4 flex flex-col items-center justify-center">
      <section id='hero' className="max-w-4xl text-center min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          Build Stronger Minds Through Meaningful Connections
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          UpLift is a platform that helps individuals connect with trusted, verified therapists to begin or continue their mental wellness journey—securely, seamlessly, and effectively.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link href="/list/therapists">
            <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition">
              Explore Therapists
            </button>
          </Link>
          <Link href="/register">
            <button className="px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      <section id='why' className="py-20 bg-white w-full min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">
            Why Choose UpLift?
          </h2>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">Verified Therapists</h3>
              <p className="text-gray-600">
                All therapists are rigorously verified to ensure high professional standards and client safety.
              </p>
            </div>
            <div className="p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">Secure & Private</h3>
              <p className="text-gray-600">
                Your conversations and data are protected with end-to-end encryption to maintain confidentiality.
              </p>
            </div>
            <div className="p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">Effortless Booking</h3>
              <p className="text-gray-600">
                Find, book, and manage your therapy sessions easily with a seamless and user-friendly platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id='testimonials' className="py-20 bg-blue-50 w-full min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">
            What Our Clients Say
          </h2>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="p-6 rounded-lg bg-white shadow hover:shadow-lg transition">
              <p className="text-gray-600 mb-4">
                &quot;UpLift helped me find the right therapist in no time. The platform is simple, trustworthy, and effective.&quot;
              </p>
              <h4 className="text-lg font-semibold text-blue-600">— Sarah M.</h4>
            </div>
            <div className="p-6 rounded-lg bg-white shadow hover:shadow-lg transition">
              <p className="text-gray-600 mb-4">
                &quot;I felt safe and supported during the entire process. Booking sessions is just one click away!&quot;
              </p>
              <h4 className="text-lg font-semibold text-blue-600">— James T.</h4>
            </div>
            <div className="p-6 rounded-lg bg-white shadow hover:shadow-lg transition">
              <p className="text-gray-600 mb-4">
                &quot;Professional therapists, easy communication, and full privacy. Highly recommended.&quot;
              </p>
              <h4 className="text-lg font-semibold text-blue-600">— Emily R.</h4>
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </main>

  )
}

export default Homepage