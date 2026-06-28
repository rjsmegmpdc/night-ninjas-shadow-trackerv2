'use client';

import { useState } from 'react';

export function CopyButton({
  value,
  label = 'Copy',
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore — some browser contexts block the API
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={
        'font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border transition-colors ' +
        (copied
          ? 'border-signal-ok text-signal-ok'
          : 'border-ink-line text-bone-mute hover:border-bone-mute hover:text-bone')
      }
    >
      {copied ? '✓ copied' : label}
    </button>
  );
}
