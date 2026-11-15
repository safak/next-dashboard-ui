import Link from "next/link";

const options = [
  {
    href: "/register/student",
    title: "I'm a new student",
    body: "Register with your personal details, subjects and guardian information, and sign the enrolment agreement. You'll receive a student number.",
  },
  {
    href: "/register/parent",
    title: "I'm a parent or guardian",
    body: "Create a parent account using the student number your child received when they registered, plus their date of birth.",
  },
];

const RegisterPage = () => (
  <>
    <div>
      <h1 className="text-2xl font-semibold text-gray-800">Register</h1>
      <p className="text-sm text-gray-500 mt-1">Who is registering?</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((o) => (
        <Link
          key={o.href}
          href={o.href}
          className="card p-6 flex flex-col gap-2 transition hover:ring-2 hover:ring-indigo-300"
        >
          <span className="text-lg font-semibold text-gray-800">{o.title}</span>
          <span className="text-sm text-gray-500">{o.body}</span>
          <span className="text-sm font-medium text-indigo-600 mt-2">Continue →</span>
        </Link>
      ))}
    </div>
    <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 w-fit">
      Already have an account? Sign in
    </Link>
  </>
);

export default RegisterPage;
