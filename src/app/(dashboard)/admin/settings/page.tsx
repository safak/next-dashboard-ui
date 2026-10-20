import { redirect } from "next/navigation";

export default function SettingsPage() {
  redirect("/admin/settings/security");
}
