import type { Metadata } from 'next';
import ActivityFeedView from '@/components/activity-feed-view';

export const metadata: Metadata = {
  title: 'Activity Feed · AgentX Panel',
};

export default function ActivityFeedPage() {
  return <ActivityFeedView />;
}
