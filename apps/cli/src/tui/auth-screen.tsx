import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';

interface AuthScreenProps {
  onLogin: (email: string, password: string) => void;
  error: string | null;
  loading: boolean;
}

export function AuthScreen({ onLogin, error, loading }: AuthScreenProps): React.ReactNode {
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useInput((_input, key) => {
    if (key.escape) process.exit(0);
  });

  const handleSubmit = (value: string) => {
    if (step === 'email') {
      setEmail(value);
      setStep('password');
    } else {
      onLogin(email, value);
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      {/* ASCII Banner */}
      <Box flexDirection="column" marginBottom={1}>
        <Text bold color="cyanBright">
          {'  ╔══════════════════════════════════════════╗'}
        </Text>
        <Text bold color="cyanBright">
          {'  ║'}
          <Text bold color="white">
            {' '}
            ⚡ AgentX Enterprise AI Platform{' '}
          </Text>
          {'║'}
        </Text>
        <Text bold color="cyanBright">
          {'  ╚══════════════════════════════════════════╝'}
        </Text>
      </Box>

      <Text dimColor>Sign in to your AgentX account</Text>
      <Box marginTop={1} />

      {error && (
        <Box marginBottom={1}>
          <Text color="red"> ✗ {error}</Text>
        </Box>
      )}

      {step === 'email' ? (
        <Box flexDirection="row">
          <Text bold color="cyan">
            {' '}
            Email:{' '}
          </Text>
          <TextInput
            value={email}
            onChange={setEmail}
            onSubmit={handleSubmit}
            placeholder="you@example.com"
          />
        </Box>
      ) : (
        <Box flexDirection="column">
          <Box flexDirection="row">
            <Text bold color="cyan">
              {' '}
              Email:{' '}
            </Text>
            <Text>{email}</Text>
          </Box>
          <Box flexDirection="row" marginTop={0}>
            <Text bold color="cyan">
              {' '}
              Pass:{' '}
            </Text>
            <TextInput value={password} onChange={setPassword} onSubmit={handleSubmit} mask="*" />
          </Box>
        </Box>
      )}

      <Box marginTop={1}>
        <Text dimColor>{loading ? '  Authenticating...' : '  [Enter] submit  [Esc] quit'}</Text>
      </Box>
    </Box>
  );
}
