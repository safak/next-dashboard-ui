import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const SigninPage = async () => {
  const { userId } = await auth();

  if (userId) {
    const user = await currentUser();
    const role = (user?.publicMetadata as { role?: string })?.role;
    redirect(role ? `/${role}` : "/admin");
  }

  redirect("/");
};

export default SigninPage;