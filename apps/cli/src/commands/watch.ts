import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.resolve(process.cwd(), '.agentx');

export async function watch(args: string[]): Promise<void> {
  const graphId = args[0];

  console.log('Agentx Watch — Event Stream');
  console.log('===========================');
  if (graphId) {
    console.log(`Filtering by graph: ${graphId}`);
  }
  console.log('');
  console.log('Waiting for events... (press Ctrl+C to stop)');
  console.log('');

  const eventsFile = path.join(DATA_DIR, 'events.jsonl');

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  let lastPos = 0;
  if (fs.existsSync(eventsFile)) {
    lastPos = fs.statSync(eventsFile).size;
  }

  const poll = (): void => {
    if (!fs.existsSync(eventsFile)) {
      setTimeout(poll, 1000);
      return;
    }

    const stat = fs.statSync(eventsFile);
    if (stat.size > lastPos) {
      const fd = fs.openSync(eventsFile, 'r');
      const buf = Buffer.alloc(stat.size - lastPos);
      fs.readSync(fd, buf, 0, buf.length, lastPos);
      fs.closeSync(fd);
      lastPos = stat.size;

      const lines = buf.toString().trim().split('\n');
      for (const line of lines) {
        if (!line) continue;
        try {
          const event = JSON.parse(line) as {
            graphId?: string;
            timestamp: string;
            topic: string;
            payload: unknown;
          };
          if (graphId && event.graphId !== graphId) continue;
          const ts = new Date(event.timestamp).toLocaleTimeString();
          console.log(`[${ts}] ${event.topic} → ${JSON.stringify(event.payload).slice(0, 80)}`);
        } catch {
          // skip malformed lines
        }
      }
    }
    setTimeout(poll, 500);
  };

  poll();

  process.on('SIGINT', () => {
    console.log('\nStopped watching.');
    process.exit(0);
  });
}
