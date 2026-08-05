import FeedbackView from '@/components/feedback-view';
import { PageHeader } from '@/components/ui/page-header';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return (
    <main>
      <PageHeader
        title="Agent Feedback"
        description="Closed-loop feedback: low-scoring outputs get actionable revision guidance."
      />
      <FeedbackView />
    </main>
  );
}
