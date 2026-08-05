import SettingsView from '@/components/settings-view';
import { PageHeader } from '@/components/ui/page-header';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return (
    <main>
      <PageHeader title="Settings" />
      <SettingsView />
    </main>
  );
}
