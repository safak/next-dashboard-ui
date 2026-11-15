import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import { auth, getDisplayName } from "@/lib/auth";
import prisma from "@/lib/prisma";

const ProfilePage = async () => {
  const [{ userId, username, role }, displayName] = await Promise.all([
    auth(),
    getDisplayName(),
  ]);
  const mustChange = !!(
    await prisma.user.findUnique({
      where: { id: userId! },
      select: { mustChangePassword: true },
    })
  )?.mustChangePassword;

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="card p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-lamaPurple flex items-center justify-center text-xl font-semibold text-gray-700">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-lg font-semibold">{displayName}</h1>
          <p className="text-sm text-gray-500">
            @{username} · <span className="capitalize">{role}</span>
          </p>
        </div>
      </div>
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Change password</h2>
        {mustChange && (
          <p role="alert" className="mb-4 rounded-lg bg-lamaYellowLight px-4 py-3 text-sm text-gray-700">
            Your password was set by the school. Choose your own password to
            continue using the app.
          </p>
        )}
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ProfilePage;
