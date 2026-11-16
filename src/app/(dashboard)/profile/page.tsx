import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import TwoFactorSettings from "@/components/forms/TwoFactorSettings";
import { getAccountEmail } from "@/lib/accountEmail";
import { auth, getDisplayName } from "@/lib/auth";
import { emailConfigured } from "@/lib/email";
import prisma from "@/lib/prisma";

const ProfilePage = async () => {
  const [{ userId, username, role }, displayName] = await Promise.all([
    auth(),
    getDisplayName(),
  ]);
  const [account, email] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId! },
      select: { mustChangePassword: true, twoFactorEnabled: true },
    }),
    getAccountEmail(userId!, role!),
  ]);
  const mustChange = !!account?.mustChangePassword;

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
      {!mustChange && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold">Email and two-step sign-in</h2>
          <p className="text-sm text-gray-500 mb-4 max-w-2xl">
            Your email address is where password reset links go. With two-step sign-in on,
            you also enter a code we email you each time you sign in, so a stolen password
            alone isn&apos;t enough to get into your account.
          </p>
          <TwoFactorSettings
            email={email}
            enabled={!!account?.twoFactorEnabled}
            emailReady={emailConfigured()}
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
