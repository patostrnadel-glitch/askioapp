type SectionCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({ children, className = "" }: SectionCardProps) {
  return <section className={`card ${className}`.trim()}>{children}</section>;
}
