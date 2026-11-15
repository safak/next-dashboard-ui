import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const SigninPage = async () => {
  const { role } = await auth();
  redirect(role ? `/${role}` : "/");
};

export default SigninPage;
