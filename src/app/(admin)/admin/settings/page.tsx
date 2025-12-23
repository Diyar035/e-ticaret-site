<<<<<<< HEAD
import { getSettings } from "@/lib/actions/settings-actions";
import SettingsClient from "@/components/admin/settings/SettingsClient";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return <SettingsClient initialData={settings} />;
=======
export default function AdminSettings() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Ayarlar</h1>
      <p>Sistem ayarları burada yapılacak.</p>
    </div>
  );
>>>>>>> 428add33e1b337f3dce63e86a9165e3ddef89c65
}
