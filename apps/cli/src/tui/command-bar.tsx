import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

interface CommandBarProps {
  onSubmit: (cmd: string) => void;
  disabled?: boolean;
}

const SUGGESTIONS = [
  'submit',
  'status',
  'status <task-id>',
  'watch <task-id>',
  'cost',
  'providers',
  'refresh',
  'help',
  'logout',
  'exit',
];

export function CommandBar({ onSubmit, disabled }: CommandBarProps): React.ReactNode {
  const [value, setValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (v: string) => {
    setValue(v);
    setShowSuggestions(v.length > 0);
  };

  const handleSubmit = (v: string) => {
    const trimmed = v.trim();
    if (trimmed) onSubmit(trimmed);
    setValue('');
    setShowSuggestions(false);
  };

  const matches = value
    ? SUGGESTIONS.filter((s) => s.toLowerCase().startsWith(value.toLowerCase())).slice(0, 5)
    : [];

  return (
    <Box flexDirection="column">
      {showSuggestions && matches.length > 0 && (
        <Box flexDirection="column" paddingLeft={2}>
          {matches.map((m) => (
            <Text key={m} dimColor>
              {m}
            </Text>
          ))}
        </Box>
      )}
      <Box borderStyle="single" borderColor="green" paddingLeft={1} paddingRight={1}>
        <Text bold color="green">
          {'>'}{' '}
        </Text>
        <TextInput
          value={value}
          onChange={handleChange}
          onSubmit={handleSubmit}
          placeholder={disabled ? 'Login required...' : 'Type a command (help for list)...'}
        />
      </Box>
    </Box>
  );
}
