'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

// Dark theme for code blocks — inline styles to avoid CSS conflicts
const codeTheme: Record<string, string> = {
  backgroundColor: 'rgba(255,255,255,0.04)',
  borderRadius: '0.5rem',
  padding: '0.75rem 1rem',
  fontSize: '0.8125rem',
  lineHeight: '1.5',
  overflowX: 'auto',
  fontFamily: 'var(--font-mono), ui-monospace, monospace',
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-body ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Code blocks
          code({ className: codeClassName, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClassName || '');
            const isInline = !match;
            if (isInline) {
              return (
                <code
                  className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[0.8125em] text-accent-300"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <div className="my-3 overflow-hidden rounded-xl border border-white/[0.06]">
                {match && (
                  <div className="flex items-center justify-between border-b border-white/[0.04] bg-surface-3/40 px-4 py-1.5">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                      {match[1]}
                    </span>
                  </div>
                )}
                <pre className="overflow-x-auto bg-surface-0/80 p-4" style={codeTheme}>
                  <code className={codeClassName} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          // Tables
          table({ children }) {
            return (
              <div className="my-3 overflow-x-auto rounded-xl border border-white/[0.06]">
                <table className="w-full text-sm">{children}</table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border-b border-white/[0.06] bg-surface-3/40 px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border-b border-white/[0.04] px-3 py-2 text-slate-300">{children}</td>
            );
          },
          // Blockquotes
          blockquote({ children }) {
            return (
              <blockquote className="my-3 border-l-2 border-accent-500/40 pl-4 text-slate-400 italic">
                {children}
              </blockquote>
            );
          },
          // Links
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-400 underline decoration-accent-400/30 underline-offset-2 transition-colors hover:text-accent-300 hover:decoration-accent-300/50"
              >
                {children}
              </a>
            );
          },
          // Headings
          h1({ children }) {
            return <h1 className="mt-6 mb-3 text-lg font-bold text-slate-100">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="mt-5 mb-2 text-base font-semibold text-slate-100">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="mt-4 mb-2 text-sm font-semibold text-slate-200">{children}</h3>;
          },
          // Lists
          ul({ children }) {
            return (
              <ul className="my-2 ml-4 list-disc space-y-1 text-slate-300 marker:text-slate-500">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="my-2 ml-4 list-decimal space-y-1 text-slate-300 marker:text-slate-500">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return <li className="pl-1">{children}</li>;
          },
          // Horizontal rule
          hr() {
            return <hr className="my-4 border-white/[0.06]" />;
          },
          // Paragraphs
          p({ children }) {
            return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
          },
          // Strong / Em
          strong({ children }) {
            return <strong className="font-semibold text-slate-100">{children}</strong>;
          },
          em({ children }) {
            return <em className="italic text-slate-300">{children}</em>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
