import type { Metadata } from 'next';
import MarketplaceView from '@/components/marketplace-view';

export const metadata: Metadata = {
  title: 'Marketplace · AgentX Panel',
};

export default function MarketplacePage() {
  return <MarketplaceView />;
}
