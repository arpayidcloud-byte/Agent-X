import type { Metadata } from 'next';
import EvalView from '@/components/eval-view';

export const metadata: Metadata = { title: 'Evaluation · AgentX Panel' };

export default function Page() {
  return <EvalView />;
}
