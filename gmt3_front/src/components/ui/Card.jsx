export function Card({ children, className }) {
  return (
    <div className={`bg-surface rounded-lg overflow-hidden flex flex-col h-full card-hover transition-all duration-300 shadow-sm border border-outline-variant ${className || ''}`}>
      {children}
    </div>
  );
}