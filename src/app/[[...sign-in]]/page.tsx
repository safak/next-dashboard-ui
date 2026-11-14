import { SignIn } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const { userId } = await auth();

  if (userId) {
    const user = await currentUser();
    const role = (user?.publicMetadata as { role?: string })?.role;
    redirect(role ? `/${role}` : "/admin");
  }

  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      <SignIn fallbackRedirectUrl="/admin" />
    </div>
  );
};

export default LoginPage;
