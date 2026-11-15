import ParentRegistrationForm from "@/components/forms/ParentRegistrationForm";

const ParentRegisterPage = () => (
  <>
    <div>
      <h1 className="text-2xl font-semibold text-gray-800">Parent registration</h1>
      <p className="text-sm text-gray-500 mt-1">
        Your child must register first. Ask them for the student number they
        received.
      </p>
    </div>
    <ParentRegistrationForm />
  </>
);

export default ParentRegisterPage;
