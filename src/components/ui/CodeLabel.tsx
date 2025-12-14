interface CodeLabelProps {
  index?: string;
  children: React.ReactNode;
  className?: string;
}

export function CodeLabel({ index, children, className = "" }: CodeLabelProps) {
  return (
    <div className={`font-mono text-sm text-foreground-subtle tracking-wider ${className}`}>
      {index && <span className="text-foreground-ghost">{index} // </span>}
      {children}
    </div>
  );
}
