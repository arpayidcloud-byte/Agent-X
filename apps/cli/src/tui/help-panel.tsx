import React from 'react';
import { Box, Text } from 'ink';

export function HelpPanel(): React.ReactNode {
  return (
    <Box flexDirection="column">
      <Box flexDirection="column" gap={1}>
        <Text bold underline>
          Slash Commands (ketik di chat)
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            /help
          </Text>{' '}
          Tampilkan bantuan ini
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            /tasks
          </Text>{' '}
          (atau /t) — daftar task (↑↓ pilih, Enter detail, S submit)
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            /providers
          </Text>{' '}
          (atau /p) — daftar LLM provider
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            /cost
          </Text>{' '}
          (atau /c) — analisa biaya
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            /router
          </Text>{' '}
          (atau /m) — peta routing task → model
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            /health
          </Text>{' '}
          (atau /h) — status layanan (API + provider)
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            /deck
          </Text>{' '}
          (atau /d) — Command Deck 3-panel (AGENTS · TASK · LOGS + cpu/mem)
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            /submit &lt;goal&gt;
          </Text>{' '}
          Kirim task langsung dari chat
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            /logs [taskId]
          </Text>{' '}
          Live tail event task (SSE, auto-reconnect)
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            /model
          </Text>{' '}
          Pilih provider LLM (↑↓ Enter Esc)
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            /shell &lt;perintah&gt;
          </Text>{' '}
          (atau awali pesan dengan{' '}
          <Text bold color="red">
            !
          </Text>
          ) — jalankan shell command, output di modal
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            /btw &lt;pertanyaan&gt;
          </Text>{' '}
          Pertanyaan cepat one-shot
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            /context
          </Text>{' '}
          Ringkasan konteks sesi (pesan, chars, token)
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            /clear
          </Text>{' '}
          Bersihkan percakapan
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            /history
          </Text>{' '}
          Info jumlah pesan sesi ini
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            /settings
          </Text>{' '}
          Info akun (email, roles, API)
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            /logout
          </Text>{' '}
          Keluar akun (kembali ke layar login)
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            /quit
          </Text>{' '}
          (atau /q) — keluar TUI · Ctrl+C juga bisa
        </Text>

        <Text bold underline>
          Hotkeys (saat overlay terbuka)
        </Text>
        <Text>
          {' '}
          <Text bold color="cyan">
            ↑/↓
          </Text>{' '}
          Navigasi daftar task
        </Text>
        <Text>
          {' '}
          <Text bold color="cyan">
            Enter
          </Text>{' '}
          Buka detail task
        </Text>
        <Text>
          {' '}
          <Text bold color="cyan">
            S
          </Text>{' '}
          Submit task baru
        </Text>
        <Text>
          {' '}
          <Text bold color="cyan">
            R
          </Text>{' '}
          Refresh semua data
        </Text>
        <Text>
          {' '}
          <Text bold color="cyan">
            Esc
          </Text>{' '}
          Tutup overlay → kembali ke chat
        </Text>
      </Box>
    </Box>
  );
}
