interface SyntaxHighlightProps {
  children: React.ReactNode;
  type?: "const" | "export" | "import" | "function" | "class";
  className?: string;
}

export function SyntaxHighlight({
  children,
  type = "const",
  className = "",
}: SyntaxHighlightProps) {
  return (
    <div className={`font-mono text-sm ${className}`}>
      <span className="text-primary">{type} </span>
      <span className="text-foreground">{children}</span>
    </div>
  );
}
