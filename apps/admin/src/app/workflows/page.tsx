import type { Metadata } from 'next';
import WorkflowBuilderView from '@/components/workflow-builder-view';

export const metadata: Metadata = {
  title: 'Workflow Builder · AgentX Panel',
};

export default function WorkflowsPage() {
  return <WorkflowBuilderView />;
}
