'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Workflow as WorkflowIcon,
  Plus,
  Trash2,
  Save,
  Copy,
  Play,
  Pencil,
  Loader2,
  X,
} from 'lucide-react';

interface WorkflowRecord {
  id: string;
  name: string;
  description: string | null;
  nodes: unknown;
  edges: unknown;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WorkflowNodeData {
  label: string;
  agent?: string;
  prompt?: string;
  [key: string]: unknown;
}

const NODE_TYPES = [
  { type: 'input', label: 'Trigger', color: 'text-emerald-400 border-emerald-500/30' },
  { type: 'agent', label: 'Agent', color: 'text-accent-400 border-accent-500/30' },
  { type: 'llm', label: 'LLM Call', color: 'text-amber-400 border-amber-500/30' },
  { type: 'tool', label: 'Tool', color: 'text-cyan-400 border-cyan-500/30' },
  { type: 'output', label: 'Output', color: 'text-fuchsia-400 border-fuchsia-500/30' },
];

const NODE_BG: Record<string, string> = {
  input: 'bg-emerald-500/10',
  agent: 'bg-accent-500/10',
  llm: 'bg-amber-500/10',
  tool: 'bg-cyan-500/10',
  output: 'bg-fuchsia-500/10',
};

let nodeIdCounter = 0;

function nextNodeId(): string {
  nodeIdCounter += 1;
  return `${nodeIdCounter}${Date.now().toString(36)}`;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function apiFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem('agentx_admin_token');
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<Record<string, unknown>>;
}

export default function WorkflowBuilderView() {
  const [workflows, setWorkflows] = useState<WorkflowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<WorkflowRecord | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WorkflowNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await apiFetch('/v1/workflows');
        if (!cancelled) setWorkflows((data.workflows as WorkflowRecord[]) ?? []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function newWorkflow() {
    const wf: WorkflowRecord = {
      id: 'new',
      name: 'Untitled Workflow',
      description: '',
      nodes: [],
      edges: [],
      isPublished: false,
      createdAt: '',
      updatedAt: '',
    };
    setSelected(wf);
    setEditing(true);
    setName('Untitled Workflow');
    setDescription('');
    setNodes([
      {
        id: 'n1',
        type: 'input',
        position: { x: 100, y: 150 },
        data: { label: 'Trigger', agent: 'user' },
      },
      {
        id: 'n2',
        type: 'agent',
        position: { x: 380, y: 150 },
        data: { label: 'Agent', agent: 'architect' },
      },
      {
        id: 'n3',
        type: 'output',
        position: { x: 660, y: 150 },
        data: { label: 'Output' },
      },
    ]);
    setEdges([
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3' },
    ]);
  }

  function openWorkflow(wf: WorkflowRecord) {
    setSelected(wf);
    setEditing(true);
    setName(wf.name);
    setDescription(wf.description ?? '');
    const savedNodes = Array.isArray(wf.nodes) ? (wf.nodes as Node<WorkflowNodeData>[]) : [];
    const savedEdges = Array.isArray(wf.edges) ? (wf.edges as Edge[]) : [];
    if (savedNodes.length === 0) {
      setNodes([
        {
          id: 'n1',
          type: 'input',
          position: { x: 100, y: 150 },
          data: { label: 'Trigger', agent: 'user' },
        },
      ]);
    } else {
      setNodes(savedNodes.map((n) => ({ ...n, data: { ...n.data } })));
    }
    setEdges(savedEdges);
  }

  function closeEditor() {
    setSelected(null);
    setEditing(false);
  }

  function addNode(type: string) {
    const label = NODE_TYPES.find((t) => t.type === type)?.label ?? type;
    const offset = nodes.length * 24;
    const node: Node<WorkflowNodeData> = {
      id: `n${nextNodeId()}`,
      type: type === 'input' || type === 'output' ? type : 'agent',
      position: { x: 120 + offset, y: 120 + offset },
      data: { label, agent: type },
    };
    setNodes((nds) => [...nds, node]);
  }

  function onConnect(conn: Connection) {
    setEdges((eds) => addEdge({ ...conn, id: `e${nextNodeId()}` }, eds));
  }

  async function saveWorkflow() {
    if (!name.trim()) {
      showToast('Nama workflow wajib diisi');
      return;
    }
    setSaving(true);
    try {
      const body = {
        name,
        description,
        nodes,
        edges,
      };
      if (selected && selected.id !== 'new') {
        await apiFetch(`/v1/workflows/${selected.id}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        });
        showToast('Workflow disimpan ✅');
      } else {
        const data = await apiFetch('/v1/workflows', {
          method: 'POST',
          body: JSON.stringify(body),
        });
        setSelected(data.workflow as WorkflowRecord);
        showToast('Workflow dibuat ✅');
      }
      const fresh = await apiFetch('/v1/workflows');
      setWorkflows((fresh.workflows as WorkflowRecord[]) ?? []);
    } catch (e) {
      showToast(`Gagal: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSaving(false);
    }
  }

  async function deleteWorkflow(id: string) {
    if (!confirm('Hapus workflow ini?')) return;
    try {
      await apiFetch(`/v1/workflows/${id}`, { method: 'DELETE' });
      setWorkflows((ws) => ws.filter((w) => w.id !== id));
      if (selected?.id === id) closeEditor();
      showToast('Workflow dihapus ✅');
    } catch (e) {
      showToast(`Gagal: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  function exportJson() {
    if (!selected) return;
    const blob = new Blob([JSON.stringify({ name, description, nodes, edges }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '-').toLowerCase()}.workflow.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSON diexport ✅');
  }

  function importJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as {
          name?: string;
          description?: string;
          nodes?: Node[];
          edges?: Edge[];
        };
        setName(parsed.name ?? 'Imported Workflow');
        setDescription(parsed.description ?? '');
        if (parsed.nodes && parsed.nodes.length > 0) {
          setNodes(parsed.nodes as Node<WorkflowNodeData>[]);
        }
        if (parsed.edges) setEdges(parsed.edges as Edge[]);
        setSelected({
          id: 'new',
          name: parsed.name ?? 'Imported Workflow',
          description: parsed.description ?? '',
          nodes: parsed.nodes ?? [],
          edges: parsed.edges ?? [],
          isPublished: false,
          createdAt: '',
          updatedAt: '',
        });
        showToast('Workflow diimport ✅');
      } catch {
        showToast('File JSON tidak valid');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  const nodeTypes = useMemo(
    () => ({
      input: (props: { data: WorkflowNodeData }) => (
        <div
          className={`glass-card rounded-lg border px-3 py-2 text-sm text-slate-100 ${NODE_BG.input ?? 'bg-slate-800'} min-w-[140px]`}
        >
          <div className="font-semibold text-emerald-300">⚡ {props.data?.label ?? 'Trigger'}</div>
          {props.data?.prompt ? (
            <div className="mt-1 text-xs text-slate-400 line-clamp-2">{props.data.prompt}</div>
          ) : null}
        </div>
      ),
      agent: (props: { data: WorkflowNodeData }) => (
        <div className="glass-card rounded-lg border px-3 py-2 text-sm text-slate-100 bg-accent-500/10 border-accent-500/30 min-w-[140px]">
          <div className="font-semibold text-accent-300">🤖 {props.data?.label ?? 'Agent'}</div>
          <div className="mt-1 text-xs text-slate-400">
            agent: {props.data?.agent ?? 'architect'}
          </div>
          {props.data?.prompt ? (
            <div className="mt-1 text-xs text-slate-500 line-clamp-2">{props.data.prompt}</div>
          ) : null}
        </div>
      ),
      output: (props: { data: WorkflowNodeData }) => (
        <div className="glass-card rounded-lg border px-3 py-2 text-sm text-slate-100 bg-fuchsia-500/10 border-fuchsia-500/30 min-w-[140px]">
          <div className="font-semibold text-fuchsia-300">📤 {props.data?.label ?? 'Output'}</div>
        </div>
      ),
    }),
    [],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <WorkflowIcon className="h-5 w-5 text-accent-400" />
            Visual Workflow Builder
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Rancang pipeline agent dengan drag &amp; drop, simpan, export/import JSON
          </p>
        </div>
        <button
          onClick={newWorkflow}
          className="inline-flex items-center gap-2 rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-500 transition"
        >
          <Plus className="h-4 w-4" /> New Workflow
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent-400" />
        </div>
      ) : (
        <>
          {/* Workflow list */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workflows.map((wf) => (
              <div
                key={wf.id}
                className="glass-card rounded-xl border border-white/[0.06] p-4 hover:border-accent-500/30 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-slate-100">{wf.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                      {wf.description || 'Tanpa deskripsi'}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => void openWorkflow(wf)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-white/[0.06] hover:text-accent-300"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => void deleteWorkflow(wf.id)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-white/[0.06] px-2 py-0.5">
                    {Array.isArray(wf.nodes) ? wf.nodes.length : 0} nodes
                  </span>
                  <span className="rounded-full bg-white/[0.06] px-2 py-0.5">
                    {Array.isArray(wf.edges) ? wf.edges.length : 0} edges
                  </span>
                  {wf.isPublished ? (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
                      Published
                    </span>
                  ) : null}
                  <span className="ml-auto">
                    {new Date(wf.updatedAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
            {workflows.length === 0 ? (
              <div className="glass-card col-span-full rounded-xl border border-dashed border-white/[0.1] p-10 text-center">
                <WorkflowIcon className="mx-auto h-10 w-10 text-slate-600" />
                <p className="mt-3 text-sm text-slate-400">
                  Belum ada workflow. Klik &quot;New Workflow&quot; untuk membuat pertama.
                </p>
              </div>
            ) : null}
          </div>

          {/* Editor */}
          {editing && selected ? (
            <div className="glass-card rounded-xl border border-white/[0.06] p-4">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama workflow"
                  className="rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-accent-500/50"
                />
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi"
                  className="flex-1 rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-accent-500/50 min-w-[200px]"
                />
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={exportJson}
                    className="rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.06]"
                    title="Export JSON"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <label
                    className="cursor-pointer rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.06]"
                    title="Import JSON"
                  >
                    <input type="file" accept=".json" className="hidden" onChange={importJson} />
                    <Play className="h-4 w-4" />
                  </label>
                  <button
                    onClick={() => void saveWorkflow()}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent-600 px-4 py-2 text-xs font-semibold text-white hover:bg-accent-500 disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save
                  </button>
                  <button
                    onClick={closeEditor}
                    className="rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-white/[0.06]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Palette */}
              <div className="mb-3 flex flex-wrap gap-2">
                {NODE_TYPES.map((t) => (
                  <button
                    key={t.type}
                    onClick={() => addNode(t.type)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:bg-white/[0.08] ${t.color}`}
                  >
                    + {t.label}
                  </button>
                ))}
              </div>

              {/* Canvas */}
              <div className="h-[480px] overflow-hidden rounded-xl border border-white/[0.08] bg-black/60">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  nodeTypes={nodeTypes}
                  fitView
                  proOptions={{ hideAttribution: true }}
                >
                  <Background gap={18} size={1} color="#1e293b" />
                  <Controls />
                  <MiniMap
                    nodeColor={(n) =>
                      n.type === 'agent' ? '#6366f1' : n.type === 'input' ? '#34d399' : '#d946ef'
                    }
                    className="!bg-slate-900/80"
                  />
                </ReactFlow>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Drag node untuk pindah, hubungkan dengan drag dari titik edge. Klik dua node untuk
                lihat koneksi.
              </p>
            </div>
          ) : null}
        </>
      )}

      {/* Toast */}
      {toast ? (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg border border-accent-500/30 bg-slate-900 px-4 py-3 text-sm text-slate-100 shadow-xl">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
