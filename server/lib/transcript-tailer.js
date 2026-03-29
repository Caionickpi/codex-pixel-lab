import fs from 'node:fs/promises';

export class TranscriptTailer {
  constructor(filePath, onLine, pollMs = 800) {
    this.filePath = filePath;
    this.onLine = onLine;
    this.pollMs = pollMs;
    this.offset = 0;
    this.buffer = '';
    this.timer = null;
  }

  async start() {
    await this.bootstrap();
    this.timer = setInterval(() => {
      this.poll().catch(() => {
        // Ignore polling hiccups while transcript rotates.
      });
    }, this.pollMs);
  }

  async bootstrap() {
    const text = await fs.readFile(this.filePath, 'utf8');
    this.offset = Buffer.byteLength(text);
    const lines = text.replace(/\r/g, '').split('\n');
    for (const line of lines) {
      if (line.trim()) this.onLine(line);
    }
  }

  async poll() {
    const stat = await fs.stat(this.filePath);
    if (stat.size <= this.offset) return;

    const handle = await fs.open(this.filePath, 'r');
    const readSize = stat.size - this.offset;
    const chunk = Buffer.alloc(readSize);

    try {
      await handle.read(chunk, 0, readSize, this.offset);
    } finally {
      await handle.close();
    }

    this.offset = stat.size;
    const text = this.buffer + chunk.toString('utf8');
    const lines = text.replace(/\r/g, '').split('\n');
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim()) this.onLine(line);
    }
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
