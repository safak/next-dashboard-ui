import SettingsItem from "./SettingsItem";
import { User, Lock, Bell, Shield, Palette } from "lucide-react";

export default function SettingsList() {
  return (
    <div className="divide-y">
      <SettingsItem
        icon={<User size={18} />}
        label="Profile Settings"
        description="Manage your personal information"
        href="/profile"
      />
      <SettingsItem
        icon={<Lock size={18} />}
        label="Account & Security"
        description="Password, login & sessions"
        href="/admin/settings/security"
      />
      <SettingsItem
        icon={<Bell size={18} />}
        label="Notifications"
        description="Email and system alerts"
        href="/admin/settings/notifications"
      />
      <SettingsItem
        icon={<Shield size={18} />}
        label="Privacy & Permissions"
        description="Data access and roles"
        href="/admin/settings/privacy"
      />
      <SettingsItem
        icon={<Palette size={18} />}
        label="Appearance"
        description="Theme and display preferences"
        href="/admin/settings/appearance"
      />
    </div>
  );
}
