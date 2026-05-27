export function Card({ children, className }) {
  return (
    <div class={`bg-surface rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/8 hover:-translate-y-1 border border-outline-variant group ${className || ''}`}>
      {children}
    </div>
  );
}
