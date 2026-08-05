import TeamView from '@/components/team-view';
import { PageHeader } from '@/components/ui/page-header';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return (
    <main>
      <PageHeader title="Team" />
      <TeamView />
    </main>
  );
}
