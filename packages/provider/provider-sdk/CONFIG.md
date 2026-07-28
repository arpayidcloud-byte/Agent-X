# Provider Configuration

Configure LLM provider API keys and settings via environment variables.

## Required Environment Variables

```bash
# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI (GPT)
OPENAI_API_KEY=sk-...

# Google (Gemini) - optional
GOOGLE_API_KEY=...
```

## Configuration Options

| Variable              | Required | Default                    | Description             |
| --------------------- | -------- | -------------------------- | ----------------------- |
| `ANTHROPIC_API_KEY`   | Yes      | -                          | Anthropic API key       |
| `OPENAI_API_KEY`      | Yes      | -                          | OpenAI API key          |
| `GOOGLE_API_KEY`      | No       | -                          | Google API key          |
| `LLM_MODEL_ANTHROPIC` | No       | `claude-sonnet-4-20250514` | Default Anthropic model |
| `LLM_MODEL_OPENAI`    | No       | `gpt-4o`                   | Default OpenAI model    |
| `LLM_TEMPERATURE`     | No       | `0.7`                      | Default temperature     |
| `LLM_MAX_TOKENS`      | No       | `4096`                     | Default max tokens      |

## Usage

```typescript
import { AnthropicProvider } from '@agentx/provider/native-providers';

const provider = new AnthropicProvider();
await provider.initialize();
await provider.connect();

const result = await provider.complete({
  prompt: 'Hello, Claude!',
  modelId: process.env.LLM_MODEL_ANTHROPIC,
  temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
  maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '4096'),
});
```

## Security Notes

- ⚠️ **NEVER** commit API keys to git
- ✅ Use `.env.local` for local development
- ✅ Use secrets manager for production
- ✅ API keys are loaded from environment variables only
