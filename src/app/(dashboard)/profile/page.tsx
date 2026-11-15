import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import { auth, getDisplayName } from "@/lib/auth";

const ProfilePage = async () => {
  const [{ username, role }, displayName] = await Promise.all([
    auth(),
    getDisplayName(),
  ]);

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
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ProfilePage;
