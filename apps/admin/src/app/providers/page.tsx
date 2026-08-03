import type { Metadata } from 'next';
import ProvidersView from '@/components/providers-view';

export const metadata: Metadata = {
  title: 'LLM Providers · AgentX Panel',
};

export default function ProvidersPage() {
  return <ProvidersView />;
}
