import type { Metadata } from 'next';
import CostTrackingView from '@/components/cost-tracking-view';

export const metadata: Metadata = {
  title: 'Cost Tracking · AgentX Panel',
};

export default function CostTrackingPage() {
  return <CostTrackingView />;
}
