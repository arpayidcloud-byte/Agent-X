import type { Metadata } from 'next';
import AnalyticsView from '@/components/analytics-view';

export const metadata: Metadata = {
  title: 'Analytics · AgentX Panel',
};

export default function AnalyticsPage() {
  return <AnalyticsView />;
}
