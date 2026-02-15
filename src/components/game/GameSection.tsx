interface GameSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function GameSection({
  title,
  children,
  className = "",
}: GameSectionProps) {
  return (
    <section
      className={`p-5 md:bg-slate-800/75 rounded-sm mt-5 drop-shadow-md ${className}`}
    >
      {title && (
        <h2 className="text-2xl font-semibold tracking-tight mb-2">{title}</h2>
      )}
      {children}
    </section>
  );
}
