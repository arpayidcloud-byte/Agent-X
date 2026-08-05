import QualityView from '@/components/quality-view';
import { PageHeader } from '@/components/ui/page-header';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return (
    <main>
      <PageHeader title="Quality" description="Score and track the quality of agent outputs." />
      <QualityView />
    </main>
  );
}
