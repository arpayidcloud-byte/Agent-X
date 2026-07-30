import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AgentXDashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">
            AgentX Dashboard
          </h1>
          <p className="mt-3 text-slate-400 text-lg">
            Enterprise AI Agent Platform — Monitor tasks, agents, and infrastructure.
          </p>
        </header>

        <section className="grid grid-cols-4 gap-4 mb-12">
          <Card className="bg-slate-900/40 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400 text-sm">Active Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4</div>
              <div className="text-xs text-slate-500">Coder, Reviewer, Tester, Security</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-blue-400 text-sm">Tasks Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">128</div>
              <div className="text-xs text-slate-500">This week</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-violet-400 text-sm">Cost Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$0.02</div>
              <div className="text-xs text-slate-500">LLM routing + caching active</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-amber-400 text-sm">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-400">IN PROGRESS</div>
              <div className="text-xs text-slate-500">Phase 2: Security Hardening</div>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-2 gap-6">
          <Card className="bg-slate-900/40 border-slate-700/30">
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between"><span>LLM Router build</span><span className="text-cyan-400">COMPLETED</span></li>
                <li className="flex justify-between"><span>CLI TUI setup</span><span className="text-amber-400">COMPLETED</span></li>
                <li className="flex justify-between"><span>Web Dashboard MVP</span><span className="text-violet-300">IN PROGRESS</span></li>
                <li className="flex justify-between"><span>Web Dashboard</span><span className="text-violet-300">PENDING</span></li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-700/30">
            <CardHeader>
              <CardTitle>Phase Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>✅ Phase 1 — Cleanup & Security</li>
                <li>✅ Phase 2 — Code Quality (Partial)</li>
                <li>⏳ Phase 2 — Security Audit (Batch 2.4)</li>
                <li>⏳ Phase 3 — Real LLM Integration</li>
                <li>⏳ Phase 4 — Reliability & Resilience</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
