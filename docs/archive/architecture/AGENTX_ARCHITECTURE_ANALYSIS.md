# Analisis Arsitektur Lengkap — agentx Handbook

> **Tanggal:** 14 Juli 2026
> **Status:** Draft untuk Review
> **Sumber:** Seluruh dokumen di `/root/agentx-handbook` (16 Volume, 42 RFC, 16 ADR, 16 Skema, 4 Runbook)

---

## Ringkasan Eksekutif

**agentx** adalah platform perangkat lunak rekayasa perangkat lunak berbasis AI multi-agen yang bersifat provider-agnostic. Saat ini menargetkan versi **v0.1**, platform ini diarsitektur untuk satu operator berbasis CLI, namun secara sengaja membangun primitif struktural yang dibutuhkan untuk _multi-tenancy_ enterprise dan kepatuhan di fase selanjutnya (v1.0+).

Arsitektur diatur secara ketat oleh sebuah **Konstitusi (10 Prinsip)** yang memastikan setiap keputusan menegaskan keamanan sejak awal (_security by design_), dekoupling berbasis _event-driven_, keterujiaan secara default melalui pengujian kontrak (_contract testing_), dan posisi tegas terhadap _vendor lock-in_.

### Alur Kerja Inti

1. Operator menyusun sebuah tujuan berbahasa alami.
2. **Core Runtime** memecah tujuan tersebut menjadi DAG (Directed Acyclic Graph) dari tugas-tugas.
3. Tugas-tugas ditugaskan ke roster agen spesialis tetap (coding, review, test, security).
4. Agen memanggil **Tool** melalui **Tool SDK** yang ter-sandboxing secara ketat.
5. Lapisan **Approval Gate** dua tingkat memastikan tidak ada tindakan destruktif (penulisan file, eksekusi shell) yang terjadi tanpa persetujuan manusia eksplisit.

### Cakupan Dokumentasi

Arsitektur didokumentasikan secara sangat ketat dengan:

- **16 Volume Spesifikasi Arsitektur** (termasuk Volume 15: Identity & Access dan Volume 16: Secrets & Key Management)
- **42 RFC** (Request for Comments) yang disetujui
- **16 ADR** (Architecture Decision Record) yang final
- **16 Skema JSON** untuk validasi kontrak mesin
- **4 Runbook** operasional (DR, Incident Response, Rollback, Security Incident)
- **CI Lint Gates** yang memaksa konsistensi format, persyaratan observabilitas, dan template pengujian kontrak

---

## Grafik Ketergantungan Modul

Platform beroperasi dengan model ketergantungan vertikal ke bawah. Volume bernomor lebih tinggi bergantung pada volume bernomor lebih rendah. Ketergantungan melingkar atau ke atas dilarang secara ketat dan dipaksakan oleh CI linting.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DEPENDENCY GRAPH (Top-Down)                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Vol 12: AI Company OS                                              │
│       │                                                             │
│       ▼                                                             │
│  Vol 11: Cloud Platform ──────────────────┐                        │
│       │                                    │                        │
│       ▼                                    │                        │
│  Vol 10: Enterprise Platform               │                        │
│       │            │                       │                        │
│       ▼            ▼                       │                        │
│  Vol 15        Vol 9: CLI Platform         │                        │
│  (Identity)         │                      │                        │
│       │       ┌─────┼──────┐               │                        │
│       │       ▼     ▼      ▼               │                        │
│       │    Vol 8  Vol 6  Vol 13            │                        │
│       │   (Plugin) (Mem) (Obs)             │                        │
│       │       │     │      │               │                        │
│       │       ▼     │      ▼               │                        │
│       │    ┌──┼─────┼──────┘               │                        │
│       │    ▼  ▼     ▼                      │                        │
│       │  Vol 7  Vol 4                      │                        │
│       │  (Tool) (Provider)                 │                        │
│       │    │     │                         │                        │
│       │    ▼     ▼                         │                        │
│       │  Vol 3: Agent Platform             │                        │
│       │    │                               │                        │
│       │    ▼                               │                        │
│       │  Vol 5: Workflow Engine            │                        │
│       │    │                               │                        │
│       │    ▼                               │                        │
│       │  Vol 2: Core Runtime ◄─────────────┘                        │
│       │    │                                                        │
│       │    ▼                                                        │
│       └► Vol 1: Foundation ◄── Vol 16 (Secrets)                    │
│                                                                     │
│  Vol 14 (Testing & QA) ─── Cross-cutting, memvalidasi SEMUA Volume  │
└─────────────────────────────────────────────────────────────────────┘
```

### Tabel Ketergantungan Detail

| Volume | Judul               | Bergantung Pada   | Bergantung Oleh              |
| ------ | ------------------- | ----------------- | ---------------------------- |
| Vol 1  | Foundation          | Konstitusi        | Semua Volume lainnya         |
| Vol 2  | Core Runtime        | Vol 1             | Vol 3, 5, 6, 7, 8, 9, 13, 16 |
| Vol 3  | Agent Platform      | Vol 1, 2          | Vol 5, 8, 9                  |
| Vol 4  | Provider Platform   | Vol 1, 2          | Vol 3, 5, 8, 13              |
| Vol 5  | Workflow Engine     | Vol 1, 2, 3, 7    | Vol 8, 9, 12                 |
| Vol 6  | Memory Engine       | Vol 1, 2          | Vol 3, 4, 5, 9, 10, 13       |
| Vol 7  | Tool SDK            | Vol 1, 2, 3       | Vol 5, 8                     |
| Vol 8  | Plugin Platform     | Vol 1, 2, 3, 4, 7 | Vol 9, 10, 12                |
| Vol 9  | CLI Platform        | Vol 1–8           | Vol 10, 12                   |
| Vol 10 | Enterprise Platform | Vol 1–9, 15       | Vol 11, 12                   |
| Vol 11 | Cloud Platform      | Vol 1–10          | Vol 12                       |
| Vol 12 | AI Company OS       | Vol 1–11          | Tidak ada (puncak)           |
| Vol 13 | Observability & SRE | Vol 1, 2, 4, 6    | Vol 10, 11                   |
| Vol 14 | Testing & QA        | Vol 1             | Semua Volume                 |
| Vol 15 | Identity & Access   | Vol 1             | Vol 10, 9                    |
| Vol 16 | Secrets & Key Mgmt  | Vol 1, 2          | Vol 4, 10, 11                |

---

## Urutan Implementasi

Berdasarkan Engineering Execution Program (EEP), implementasi mengikuti fase-fase eksplisit yang dimulai dari trunk dependensi inti:

### Fase 0: Validasi Fondasi

- Setup CI linting untuk Volume, RFC, ADR (`schema-lint-handbook`, `xref-lint-handbook`, `template-lint-handbook`).
- Selesaikan template pengujian kontrak (`08-Examples/`) untuk semua antarmuka.
- **Keluaran:** Semua dokumen lolos CI lint.

### Fase 1: Inti Mendalam (M1 — Core Contracts)

- **Vol 16:** Secrets & Key Management (Backend env-var v0.1, `CredentialResolver`).
- **Vol 4:** Provider Platform (Antarmuka normalisasi, adapter Anthropic & Google).
- **Vol 2:** Core Runtime (Event Bus via BullMQ/Redis, Mesin State Task, Scheduler).
- **Vol 13:** Observability (Structured logging JSON, korelasi `traceId`).
- **Keluaran:** Kontrak inti terimplementasi, provider berjalan end-to-end.

### Fase 2: Eksekusi & Keamanan (M2 — Extensibility)

- **Vol 7:** Tool SDK (Sandboxing filesystem, Pemeriksaan Izin, Klasifikasi Destruktif).
- **Vol 3:** Agent Platform (System prompt, Logika Decomposer, roster 4 agen).
- **Vol 5:** Workflow Engine (Pembangunan graf, _conditional branching_, approval gate dua tingkat).
- **Keluaran:** Agen dapat menjalankan tugas dengan keamanan ketat.

### Fase 3: Persistensi & Antarmuka (M3/M4 — Orchestration)

- **Vol 6:** Memory Engine (Skema PostgreSQL, trigger append-only audit log).
- **Vol 9:** CLI Platform (Perintah: submit, status, approve/reject, cost, audit, watch).
- **Vol 14:** Testing & QA (Golden set eval, CI gating).
- **Keluaran:** **v0.1 release** — siklus hidup tugas lengkap dari submit hingga hasil.

### Fase 4: Ekosistem & Enterprise (M5/M6 — Post v0.1)

- **Vol 15:** Identity & Access Foundation (Token auth, SSO OIDC/SAML).
- **Vol 10:** Enterprise Platform (Postgres RLS, RBAC multi-tenant, Policy Engine).
- **Vol 8:** Plugin Platform (Isolasi proses, validasi manifest, plugin signing).
- **Vol 11:** Cloud Platform (Topologi multi-node, scaling).
- **Vol 12:** AI Company OS (Pelacakan portofolio lintas proyek).

---

## Peta Jalan Teknis (_Engineering Roadmap_)

| Fase | Versi    | Komponen Kunci                                         | Status       |
| ---- | -------- | ------------------------------------------------------ | ------------ |
| 0    | Pre-v0.1 | CI Lint, Schema, Template Kontrak                      | Direncanakan |
| 1    | v0.1     | Core Runtime, Provider SDK, Secrets (env)              | Direncanakan |
| 2    | v0.1     | Tool SDK, Agent Platform, Workflow Engine              | Direncanakan |
| 3    | v0.1     | Memory Engine, CLI Platform, Observability             | Direncanakan |
| 4    | v0.5     | Token Auth, Plugin Sandbox, Webhook Approval           | Direncanakan |
| 5    | v1.0     | SSO, Vault/AWS Secrets, Postgres RLS, Dashboard        | Direncanakan |
| 6    | v2.0+    | Plugin Marketplace, Multi-region DR, Adaptive Sessions | Spekulatif   |

### Detail Target per Versi

**v0.1 (Fokus Saat Ini)**

- Satu operator, CLI-only
- Autentikasi lokal (OS username)
- Secrets berbasis environment variable
- 4 agen bawaan (coding, review, test, security)
- 2 adapter provider (Anthropic, Google)
- Approval gate manual melalui CLI untuk semua panggilan tool destruktif
- Semua `fs.write` diklasifikasikan sebagai destruktif (ADR-0005)

**v0.5**

- Autentikasi berbasis token (JWT)
- Secrets berbasis file terenkripsi (AES-256-GCM)
- Notifikasi webhook untuk approval gates
- Sandbox plugin MVP (tier Core saja)
- Kompensasi file tingkat parsial (_compensation transactions_)

**v1.0**

- Enterprise SSO (OIDC/SAML)
- Secrets via Vault / AWS Secrets Manager
- Postgres Row-Level Security (RLS) untuk isolasi multi-tenant
- Rotasi secrets otomatis berbasis TTL
- Baseline kepatuhan SOC2
- Aplikasi Dashboard Web (terpisah dari CLI, Next.js)

**v2.0+**

- Plugin Marketplace terbuka
- DR multi-region
- Adaptif session lifetime berbasis risiko

---

## Analisis Keamanan

### 16 Ancaman Teridentifikasi (Threat Model)

| ID    | Ancaman                                        | Zona Kepercadaan | Risiko | Mitigasi                                              | Status                                 |
| ----- | ---------------------------------------------- | ---------------- | ------ | ----------------------------------------------------- | -------------------------------------- |
| T-001 | Injeksi prompt menyebabkan eksploitasi data    | Agent-Controlled | Kritis | Sanitasi input, filter output, destructive tool guard | Terbuka (v0.1 input, v1.0 output)      |
| T-002 | Agen membaca file rahasia (~/.ssh, env vars)   | Tool-Executed    | Kritis | Path allowlist, scrubbing env, scanning output        | Terbuka (v0.1 path, v1.0 scrubbing)    |
| T-003 | Graf rekursif tanpa batas (DoS)                | Agent-Controlled | Tinggi | Max depth 10, max subtasks 50                         | Mitigasi                               |
| T-005 | Sandbox escape melalui symlink traversal       | Tool-Executed    | Kritis | Resolve symlink, chroot/namespace                     | Terbuka (v0.1 resolve, v1.0 namespace) |
| T-008 | Plugin terkompromi menjalankan kode arbitrer   | External         | Kritis | Validasi manifest, sandbox, marketplace kurasi        | Terbuka (v1.0)                         |
| T-010 | Kebocoran data lintas-tenant via Memory Engine | Agent-Controlled | Kritis | Tenant ID column, Prisma middleware, RLS              | Terbuka (v1.0)                         |
| T-012 | API key provider tercatat dalam log plaintext  | External         | Tinggi | Secret masking, no-plaintext policy                   | Terbuka (v0.1)                         |

### Prinsip Keamanan Kunci

- **Fail-Closed:** Semua pemeriksaan izin (PermissionChecker) menolak secara default.
- **Audit Append-Only:** Log audit di PostgreSQL menggunakan trigger yang mencegah UPDATE/DELETE (ADR-0014).
- **Chained Hashes:** Setiap rekam audit memiliki hash rantai SHA-256 untuk mendeteksi pemalsuan (RFC-0024).
- **Dua Lapisan Enkripsi:** AES-256-GCM untuk data at-rest, TLS 1.3 untuk data in-transit.
- **Zero Secrets in Event Bus:** Credential tidak pernah diserialisasi ke Event Bus atau log.

---

## Risiko

### 1. Kelelahan Approval Gate (Risiko: Tinggi)

**Detail:** ADR-0005 menyatakan bahwa _semua_ panggilan `fs.write` diklasifikasikan sebagai destruktif di v0.1. Agen yang mengedit banyak file akan membanjiri CLI dengan permintaan persetujuan. Jika operator mulai menyetujui secara membabi buta, mekanisme keamanan dikalahkan.
**Mitigasi:** Implementasikan mekanisme "trust window" atau batch approval untuk editor multi-file di v0.5.

### 2. Biaya & Pertumbuhan Context Window (Risiko: Sedang)

**Detail:** Volume 6 mengandalkan "rolling summaries + last N results" alih-alih vector search. Untuk tugas kompleks dengan jumlah retry tinggi, ringkasan ini mungkin menjatuhkan konteks kritis atau cepat membatasi token.
**Mitigasi:** Pantau penggunaan token per agen di Volume 13; siapkan RFC untuk vector/semantic retrieval saat bottleneck diamati.

### 3. Ketergantungan Trigger Database (Risiko: Sedang)

**Detail:** ADR-0014 menggunakan trigger PostgreSQL untuk ketidakubahan Audit Log. Ini mengikat jaminan keamanan aplikasi secara ketat ke fitur spesifik Postgres, menambah gesekan pada prinsip "No Vendor Lock-in" jika bermigrasi ke RDBMS lain.
**Mitigasi:** Dokumentasikan path portabilitas (misalnya: migrasi ke SQLite atau MariaDB dengan trigger SETARA) di RFC mendatang.

### 4. Kebekuan Golden Set Agen (Risiko: Sedang)

**Detail:** Volume 14 menetapkan pengujian berbasis rubrik manual untuk output LLM. Saat platform berkembang, memelihara dan mengeksekusi Golden Set ini secara manual dapat menjadi bottleneck, membiarkan regresi prompt lolos.
**Mitigasi:** Mulai otomasi parsial Golden Set segera setelah v0.1 dirilis, sebelum prompt agen berevolusi signifikan.

### 5. Lingkungan Proses Bocor (Risiko: Tinggi)

**Detail:** Menggunakan environment variable untuk secrets v0.1 berarti child process (seperti shell build yang didefinisikan pengguna) mungkin mewarisi `process.env` yang berisi API key provider.
**Mitigasi:** Tool SDK harus secara eksplisit scrub `AGENTX_SECRET_*` dari environment sebelum spawn `shell.build` di v0.1. Ini harus divalidasi oleh contract test.

---

## Pertanyaan untuk Review

### Pertanyaan Arsitektural

1. **Alur Async Approval Gate:** Di v0.1, jika graf berhenti menunggu approval gate tetapi operator me-restart CLI/mesin, apakah status pending tersimpan secara tahan lama di PostgreSQL sehingga operator cukup mengetik `agentx status` untuk melanjutkan?

2. **Golden Set Awal:** Apakah "Golden Set" awal dari tujuan representatif untuk v0.1 (Volume 14, Bab 2) sudah disusun, atau ini prasyarat sebelum v0.1 secara resmi dirilis?

3. **Pembersihan Environment di Tool SDK:** Apakah Tool SDK secara eksplisit membuang variabel `AGENTX_SECRET_*` dari environment sebelum menjalankan child process `shell.build`? (T-002 merujuk hal ini — apakah ini blocker v0.1?)

### Pertanyaan Implementasi

4. **BullMQ vs Redis Streams:** Mengapa BullMQ dipilih alih-alih Redis Streams langsung untuk Event Bus? Apakah ada RFC yang mendokumentasikan trade-off ini?

5. **Adapter Provider Ketiga:** ADR-0003 mensyaratkan dua adapter di v0.1. Adakah rencana awal untuk adapter OpenAI atau Ollama (lokal) sebagai fallback offline?

6. **Contract Test Execution:** Volume 14 menyebutkan contract test templates di `08-Examples/`. Apakah template ini sudah bisa dijalankan secara lokal dengan perintah `npm test`, atau masih perlu penyesuaian sebelum bisa dieksekusi?

### Pertanyaan Tata Kelola

7. **Grandfathering RFC-0001 hingga RFC-0020:** ADR-0013 membebaskan RFC awal dari format minimum baru. Apakah ada rencana untuk merevisi RFC-0001 hingga RFC-0020 agar memenuhi standar baru, atau biarkan apa adanya?

8. **Performance Targets:** `PERFORMANCE_TARGETS.md` masih berstatus Draft. Apakah sudah ada RFC yang meratifikasi target ini menjadi mengikat (_binding_)? Tanpa ini, Performance Review Gate (EEP §8) tidak dapat jujur dilalui.

---

## Ringkasan Struktur Repository

```
agentx-handbook/
├── 00-Governance/           # Konstitusi, Standar, Glossary, Ancaman
│   ├── PROJECT_CONSTITUTION.md
│   ├── SECURITY_STANDARDS.md
│   ├── API_STANDARDS.md
│   ├── THREAT_MODEL.md
│   ├── PERFORMANCE_TARGETS.md
│   ├── CONTRIBUTING.md
│   └── GLOSSARY.md
├── 01-Volumes/              # 16 Volume Spesifikasi Arsitektur
│   ├── Volume-01.md ... Volume-16-*.md
├── 02-RFC/                  # 42 RFC (Request for Comments)
│   ├── RFC-0001.md ... RFC-0042.md
├── 03-ADR/                  # 16 ADR (Architecture Decision Records)
│   ├── ADR-0001.md ... ADR-0016.md
├── 04-Schemas/              # 16 Skema JSON untuk validasi kontrak
│   ├── volume-01.schema.json ... volume-16.schema.json
├── 05-Templates/            # Template untuk Volume, RFC, ADR
├── 06-Prompts/              # System prompt & codegen prompts
├── 07-Diagrams/             # Diagram Mermaid & ekspor
├── 08-Examples/             # Contract test templates (16 Volume)
├── 09-Runbooks/             # 4 Runbook operasional
│   ├── disaster-recovery.md
│   ├── incident-response.md
│   ├── rollback-procedures.md
│   └── security-incident-response.md
├── 09-Reviews/              # Laporan asesmen arsitektur
├── CERTIFICATION.md         # Sertifikasi Arsitektur v1.0
└── README.md                # Panduan repository root
```

---

## Statistik Repository

| Metrik                     | Jumlah                  |
| -------------------------- | ----------------------- |
| Total file Markdown        | ~100+                   |
| Volume Spesifikasi         | 16                      |
| RFC                        | 42                      |
| ADR                        | 16                      |
| Skema JSON                 | 16                      |
| Runbook                    | 4                       |
| Diagram                    | 7+                      |
| Contract Test Templates    | 16                      |
| Ancaman Teridentifikasi    | 15+                     |
| Prinsip Konstitusi         | 10                      |
| Skor Kematangan Arsitektur | 5.0/5.0 (setelah patch) |

---

- Dokumen ini dihasilkan dari pembacaan menyeluruh seluruh isi repository `agentx-handbook` pada 14 Juli 2026.*
