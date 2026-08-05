import type { Metadata } from 'next';
import TasksView from '@/components/tasks-view';

export const metadata: Metadata = {
  title: 'Tasks · AgentX Panel',
};

export default function TasksPage() {
  return <TasksView />;
}
