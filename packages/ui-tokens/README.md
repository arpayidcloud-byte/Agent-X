# @agent-xai/ui-tokens

Shared design tokens (color palette, surfaces, radii, shadows, motion) for all Agent-X frontends.

Three consumers:
- `apps/web` — member workspace
- `apps/landing` — marketing
- `apps/admin` — owner panel

Import the CSS in `globals.css`:

```css
@import "@agent-xai/ui-tokens/styles";
```

Or use the TS palette directly:

```ts
import { palette } from "@agent-xai/ui-tokens";
```
