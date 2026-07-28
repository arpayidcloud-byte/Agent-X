# Agentx — Whole-Repo Code Audit Report

**Tanggal audit:** 19 Juli 2026
**Metode:** Pembacaan langsung seluruh source (782 file source `.ts`, 46 file test) di `packages/**` dan `apps/cli`, dibandingkan terhadap `agentx-handbook` v1.0.
**Catatan verifikasi:** `node_modules` belum ter-install saat audit, sehingga test **tidak dijalankan** — status lulus/gagal test belum terverifikasi; hanya keberadaan file test yang dikonfirmasi.

---

## 1. Kesimpulan Utama

Agentx adalah **kerangka arsitektur yang rapi dan meng-compile, tetapi hampir seluruhnya merupakan simulasi in-memory berupa komponen-komponen yang tidak saling tersambung.**

Ciri paling penting: **stub disamarkan sebagai kode jadi.** Kelas bernama `BullMQAdapter`, `RedisLockProvider`, `PostgresAuditStore`, dan `PrismaMemoryStore` semuanya ternyata `Map` in-memory. Tidak ada penanda stub eksplisit sama sekali — **0 `TODO`/`FIXME`/`throw "not implemented"` di 782 file** — sehingga sifat simulasi ini mudah terlewat oleh pembacaan sekilas.

### Dua masalah struktural terbesar

1. **Komponen tidak di-wire satu sama lain.** `apps/cli` tidak meng-import satu pun `@agentx/*`; ia membaca/menulis file `.agentx/*.json` yang **tidak ada produsennya**. Grup package `cognitive/`, `reasoning/`, `planning/`, `distributed/`, `quality/`, `platform/` **100% orphaned** — tidak diimpor oleh apa pun di luar dirinya sendiri.
2. **Tidak ada jalur eksekusi nyata end-to-end.** Lapisan agent tidak memiliki dependency provider sehingga **tidak dapat memanggil LLM**. Credential resolver mengembalikan `stub-${key}`. Scheduler dijadwalkan tetapi tidak pernah di-dispatch.

---

## 2. Koreksi terhadap `AUDIT_REPORT_AND_PLAN.md`

| Klaim lama                                           | Realita hasil audit                                                                                                                       |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| "Vol 9 CLI cuma `console.log('agentx cli')`"         | **SALAH.** CLI ~626 LOC, 8 command lengkap dengan dispatch nyata + test. Namun backend-nya disimulasikan lewat JSON lokal tanpa produsen. |
| "Specialist agents = stub, no LLM call"              | **BENAR.** 8 agent mengembalikan string kaleng; `agent-platform` tidak punya dependency provider.                                         |
| "8 agent bukan 4"                                    | **BENAR.** 4 core (Coder/Reviewer/Tester/Security) + 4 ekstra (Planner/Architect/Documentation/QA).                                       |
| R4 plan mengasumsikan stub `throw "not implemented"` | **Pola salah.** Tidak ada penanda seperti itu. Gap sebenarnya = in-memory fakes + hardcoded returns.                                      |

---

## 3. Skor per Package

Skala: 1 = pure stub/theater … 5 = production-real.

### Nyata & layak dipertahankan

| Package                                                                | Skor      | Bukti                                                                                                                                                                        |
| ---------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared/core-runtime`                                                  | **5/5**   | State machine transisi penuh, retry (exponential/linear/constant + jitter), dual EventBus (`InMemoryEventBus` + `BullMQEventBus` dengan dependency `bullmq`/`ioredis` asli). |
| `shared/tool-sdk`                                                      | **4/5**   | Executor shell/git berbasis `child_process.spawn` sungguhan, sandbox/allowlist/timeout, approval engine dengan audit lifecycle.                                              |
| `provider-sdk`                                                         | **4/5**   | 2 adapter vendor **asli** (`@anthropic-ai/sdk`, `@google/generative-ai`), `BaseProvider` dengan resilience/circuit-breaker/timeout/cost, registry + failover.                |
| `shared/secrets`                                                       | **4/5**   | Backend `env` nyata + resolver + LRU cache + redaction. Hanya backend env (belum file/vault).                                                                                |
| `reasoning-algorithms`                                                 | **4/5**   | Forward/backward chaining, conflict resolver, hypothesis engine sungguhan.                                                                                                   |
| `workflow-engine`                                                      | **4/5**   | Topological sort, cycle detection, retry coordinator asli.                                                                                                                   |
| `shared/shared`, `context-engine`, `knowledge-engine`, `memory-engine` | **3–4/5** | Logika nyata namun in-memory; `memory-engine` melanggar mandat Prisma Vol 6.                                                                                                 |

### Fake / aspirational

| Package                                                                                             | Skor      | Bukti                                                                                                                                                            |
| --------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autonomous-cognition`                                                                              | **1/5**   | "Theater": `AutonomousExecutor.execute()` **selalu** mengembalikan `status: 'SUCCESS'`, `durationMs: 0`.                                                         |
| `native-providers`                                                                                  | **1–2/5** | Lapisan provider **kedua yang duplikat**; semua provider stub (`Stub response for ${model}`); infra provider (postgres/redis/nats) hanya set `connected = true`. |
| `plugin-sdk`                                                                                        | **2/5**   | Registry lifecycle nyata, tetapi `load()` tidak pernah `import(entryPoint)` — tidak ada dynamic loading maupun sandbox.                                          |
| `agent-platform`                                                                                    | **2/5**   | Orkestrasi (pool, message-bus, resource-manager) nyata, tetapi 8 agent mengembalikan string kaleng dan tidak ada dependency provider → tidak bisa memanggil LLM. |
| `developer-platform`                                                                                | **2/5**   | `SDK.generate()` mengembalikan string satu baris; `ControlPlane` selalu return `COMPLETED`/`DEPLOYED`.                                                           |
| `cognitive-kernel`, `cognitive-learning`, `reasoning-framework`                                     | **2/5**   | Cangkang orkestrasi tanpa isi; `kernel.ts` return hardcoded `'default thinking output'`.                                                                         |
| `runtime-production`                                                                                | **2/5**   | `BullMQAdapter`/`RedisLockProvider`/`NATSAdapter`/`PostgresAdvisoryLockProvider` semuanya `Map` in-memory bernama palsu.                                         |
| `runtime`, `enterprise-runtime`, `runtime-adapters`, `workflow-orchestration`, `workflow-hardening` | **2–3/5** | Logika lifecycle nyata namun in-memory; `ReplanningEngine.replan` stub; approval tidak pernah dipanggil.                                                         |
| `distributed-cognition`                                                                             | **3/5**   | Logika konsensus/quorum nyata + 233 test, tetapi "distributed" adalah simulasi single-process (tanpa networking/RPC).                                            |

---

## 4. Fakta Spec-vs-Kode (menyelesaikan pertanyaan reconciliation)

Audit ini menjawab beberapa kontradiksi handbook — di beberapa kasus **kode sudah menentukan jawaban yang benar**:

- **Provider path:** Kode memakai `@agentx/provider-sdk` di `packages/provider/provider-sdk`, konvensi flat `@agentx/*`. Ketiga varian di handbook salah semua; scope `@platform/` di Constitution juga salah. → **Handbook harus mengikuti kode.**
- **ToolCategory:** Kode memakai set kanonik Vol 7 persis (`fs.read`/`fs.write`/`shell.build`/`shell.exec`/`git.read`/`git.write`), **tidak pernah** memakai `shell.lint`/`shell.exec.arbitrary` dari Vol 3. → **Vol 3 yang salah.** (Catatan: `ToolCategory` di-type sebagai bare `string`, bukan union — melemahkan kontrak.)
- **Interface `Persistence`:** **Tidak ada di kode.** `core-runtime` memakai `ITaskRepository` (save/findById/findByRootId); `memory-engine/PrismaMemoryStore` punya method serupa tetapi salah nama — **tidak ada Prisma sama sekali**, semua `Map`. Tidak ada `@prisma/client` di dependency mana pun. Mandat PostgreSQL Vol 6 tidak terpenuhi.
- **6 event payload:** Tidak didefinisikan sebagai tipe. Desain memakai `EventEnvelope<T>` generik + enum `EventTopic` (yang justru sudah memuat ke-6 topik tersebut). Payload dipublikasikan sebagai `TaskModel` mentah.
- **RBAC:** Ada enum role bernama (`OWNER`/`DEVELOPER`/`VIEWER`) + permission string (`task.approve`, dll) di `domain/security/rbac-roles.ts`, tetapi **tidak di-wire** ke `RBACEngine` di `infrastructure/security` yang memakai model generik berbeda. **Tidak ada role `admin`. Tidak ada RLS sama sekali.**
- **Approval:** Terdapat 3 notasi approval independen (`DecomposedTask.requiresApproval`, `WorkflowPolicy.requiresApprovalFor`, `ExecutionPolicyManager.requiresApproval`), tanpa precedence, dan **orchestrator tidak pernah memanggilnya sebelum dispatch** → approval praktis tidak ditegakkan. Rejection bersifat terminal (`WAITING_APPROVAL → CANCELLED/FAILED`); tidak ada jalur "rejected → replan". String `destructive` = **0 hasil** di seluruh repo; routing destructive→approval Vol 2 tidak pernah ditegakkan.

---

## 5. Bug & Risiko

- **Bug audit git:** `tool-sdk` git executor menandai **semua** event git sebagai `git.read`, termasuk operasi write (commit/add/reset) — `git/executor.ts` (±baris 50/76/104). Audit trail salah kategori.
- **CI tidak mem-block:** contract tests & handbook lint berjalan dengan `continue-on-error: true` di `.github/workflows/ci.yml` → Principle 6 "Testable by Default" tidak ditegakkan.
- **Backdoor di kode produksi:** `cognitive-kernel/src/kernel.ts` memuat `if (metadata.fail === true) throw new Error('Forced execution failure')` — hook test tertanam di jalur produksi.
- **ID non-deterministik:** `Math.random().toString(36)` tersebar di distributed/platform/planning, ironis dengan klaim "deterministic" di dokumen.
- **RFC-0043/0046 mengklaim dependency yang tidak ada:** RFC menyatakan cognitive packages bergantung pada `core-runtime`/`secrets` dan punya persistence file/PostgreSQL — semua `dependencies: {}` di kode, semua in-memory.

---

## 6. Duplikasi Arsitektural (perlu keputusan kanonik)

- **Dua lapisan provider:** `@agentx/provider-sdk` (nyata) vs `@agentx/native-providers` (stub).
- **Dua implementasi RBAC** yang tidak saling terhubung (`rbac-roles.ts` enum vs `RBACEngine` generik).
- **Lima state machine** berbeda (core-runtime canonical, runtime-state, coordinator-state, workflow-orchestration, inline workflow-engine).

---

## 7. Rekomendasi Prioritas

1. **Buat satu jalur vertikal end-to-end benar-benar hidup** (CLI → runtime → agent → provider → LLM → persistence) sebagai bukti nyata v0.1. Tanpa satu jalur hidup, menyelaraskan spec hanya merapikan simulasi.
2. **Putuskan komponen kanonik** dari tiap duplikasi (provider, RBAC, state machine) sebelum wiring.
3. **Selaraskan handbook ke kode** untuk hal yang kode-nya sudah benar (provider path, ToolCategory).
4. **Putuskan arah persistence v0.1**: benar-benar Postgres/Prisma (sesuai Vol 6) atau in-memory eksplisit dengan handbook diperbarui.
5. **Tegakkan CI**: hapus `continue-on-error` pada contract tests agar Principle 6 nyata.
6. **Perbaiki bug & backdoor**: kategori audit git, hook `fail` di cognitive-kernel.

---

_Laporan ini dihasilkan dari audit read-only. Tidak ada file source yang dimodifikasi selama audit._
