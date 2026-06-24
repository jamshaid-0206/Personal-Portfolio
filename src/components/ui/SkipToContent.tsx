export function SkipToContent() {
  return (
    <a
      id="skip-link"
      href="#main"
      className="sr-only focus:not-sr-only fixed top-4 left-4 z-[9999] bg-background text-foreground border border-border px-4 py-2 rounded-sm font-mono text-sm tracking-wider shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      [ SKIP TO CONTENT ]
    </a>
  );
}
