import Link from 'next/link';
import ChatView from '@/components/chat-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ChatPage() {
  return (
    <main className="text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6">
          <h1 className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            AgentX Chat
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            <Link href="/" className="text-cyan-300 hover:underline">
              ← Dashboard
            </Link>
          </p>
        </header>
        <ChatView />
      </div>
    </main>
  );
}
