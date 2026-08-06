import type { Metadata } from 'next';
import TemplatesView from '@/components/templates-view';

export const metadata: Metadata = {
  title: 'Templates · AgentX Panel',
};

export default function TemplatesPage() {
  return <TemplatesView />;
}
