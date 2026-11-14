import { UserProfile } from "@clerk/nextjs";

const ProfilePage = () => {
  return (
    <div className="p-4 flex justify-center">
      <UserProfile />
    </div>
  );
};

export default ProfilePage;
