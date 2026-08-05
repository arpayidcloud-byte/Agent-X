import type { Metadata } from 'next';
import AgentsView from '@/components/agents-view';

export const metadata: Metadata = {
  title: 'Agents · AgentX Panel',
};

export default function AgentsPage() {
  return <AgentsView />;
}
